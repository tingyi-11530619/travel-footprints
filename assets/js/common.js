/* 共用工具：首頁和旅行頁都會載入 */
(function () {
  "use strict";

  // 大頭針顏色：名稱 → 色碼。新增顏色時，tools/validate.mjs 的 COLORS 和 CLAUDE.md 也要一起改。
  var PIN_COLORS = {
    red: "#e9636a",
    blue: "#4f86e8",
    green: "#3faa7a",
    orange: "#f08c3c",
    purple: "#9a72dc",
    teal: "#2fa8b8",
    pink: "#e86fa6",
    brown: "#b0844f"
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // 旅行依出發日期由新到舊；景點依日期由早到晚（同一天維持資料裡的順序）
  function trips() {
    var list = Array.isArray(window.TRIPS) ? window.TRIPS.slice() : [];
    list.sort(function (a, b) { return a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0; });
    list.forEach(function (t) {
      t.spots = (t.spots || []).map(function (s, i) { s._i = i; return s; })
        .sort(function (a, b) {
          // 沒有日期的景點排在最後，維持資料裡的順序
          var da = a.date || "9999", db = b.date || "9999";
          return da < db ? -1 : da > db ? 1 : a._i - b._i;
        });
    });
    return list;
  }

  function findTrip(id) {
    return trips().filter(function (t) { return t.id === id; })[0] || null;
  }

  function colorOf(trip) {
    return PIN_COLORS[trip.color] || PIN_COLORS.red;
  }

  function dotDate(iso) {
    return String(iso || "").replace(/-/g, ".");
  }

  function dateRange(trip) {
    if (!trip.endDate || trip.endDate === trip.startDate) return dotDate(trip.startDate);
    return dotDate(trip.startDate) + " – " + dotDate(trip.endDate);
  }

  // 景點的日期文字：有日期顯示日期，沒有就顯示整趟旅行的日期範圍
  function visitedText(trip, spot) {
    return spot.date ? dotDate(spot.date) + " 你來過這裡" : dateRange(trip) + " 之間來過這裡";
  }

  // 第幾天：用旅行的出發日算，出發當天是 Day 01
  function dayLabel(trip, date) {
    if (!date) return "Day ?";
    var n = Math.round((new Date(date + "T00:00:00") - new Date(trip.startDate + "T00:00:00")) / 86400000) + 1;
    return "Day " + String(n).padStart(2, "0");
  }

  // 小小的定位圖示（景點名稱前面用）
  var PIN_GLYPH = '<svg class="pin-glyph" viewBox="0 0 16 20" aria-hidden="true"><path d="M8 19.5S15 12 15 7.5A7 7 0 0 0 1 7.5C1 12 8 19.5 8 19.5Z" fill="currentColor"/><circle cx="8" cy="7.5" r="2.6" fill="#fff"/></svg>';

  // 行程表：依日期分組，每組一個「Day 05」標題，下面一行一個景點
  // link(spot) 回傳該景點要連到的網址
  function scheduleHTML(trip, link) {
    var groups = [];
    trip.spots.forEach(function (s) {
      var last = groups[groups.length - 1];
      if (last && last.date === (s.date || "")) last.spots.push(s);
      else groups.push({ date: s.date || "", spots: [s] });
    });
    return groups.map(function (g) {
      return '<div class="sched-day">' +
        '<p class="sched-day__label"><span class="day-oval">' + esc(g.date ? dayLabel(trip, g.date).toUpperCase() : "SOMEDAY") + "</span>" +
        '<span class="sched-day__date">' + esc(g.date ? dotDate(g.date) : "日期未記錄") + "</span></p>" +
        '<ol class="schedule">' + g.spots.map(function (s) {
          return '<li><a href="' + esc(link(s)) + '">' +
            '<span class="schedule__time">' + esc(s.time || "") + "</span>" +
            '<span class="schedule__name">' + esc(s.name) + "</span></a></li>";
        }).join("") + "</ol></div>";
    }).join("");
  }

  // 飛機形狀（40×40，機頭朝右）：機身、主翼、尾翼，都是自己畫的簡單形狀
  function planeShape() {
    return '<path d="M4 20c0-2.5 3-2.6 5-2.6h22c4.5 0 8 1.2 8.6 2.6-.6 1.4-4.1 2.6-8.6 2.6H9c-2 0-5-.1-5-2.6z"/>' +
      '<path d="M18 18h6.5L16.5 4h-4.2zM18 22h6.5l-8 14h-4.2zM5.5 18h4.3L6.3 11H3.6zM5.5 22h4.3l-3.5 7H3.6z"/>';
  }

  // 航線分隔線：一條波浪虛線＋一架飛機。to = "right"（出發，飛機在右）或 "left"（回程，飛機在左、機頭朝左）
  function flightPath(to) {
    var line = '<svg class="flight__line" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0 10c25-12 50 12 75 0s50 12 75 0 50 12 75 0 50 12 75 0 50 12 75 0" fill="none" ' +
      'style="stroke:var(--accent)" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
    var plane = '<svg class="flight__plane" viewBox="0 0 40 40" aria-hidden="true"><g style="fill:var(--accent)"' +
      (to === "left" ? ' transform="translate(40 0) scale(-1 1)"' : "") + ">" + planeShape() + "</g></svg>";
    return '<div class="flight flight--' + (to === "left" ? "left" : "right") + '" aria-hidden="true">' +
      (to === "left" ? plane + line : line + plane) + "</div>";
  }

  // 自己畫的小插圖（原創、只用簡單形狀），顏色取自 CSS 變數
  var DOODLE = {
    // 飛機（俯視、機頭朝右）＋一小段波浪虛線航跡
    plane: '<svg class="doodle doodle--plane" viewBox="0 0 92 40" aria-hidden="true">' +
      '<path d="M2 24c8-8 16 8 24 0s16 8 24 0" fill="none" style="stroke:var(--accent-soft)" stroke-width="2.2" stroke-dasharray="5 5" stroke-linecap="round"/>' +
      '<g transform="translate(52 0)" style="fill:var(--accent)">' + planeShape() + "</g></svg>",
    cloud: '<svg class="doodle doodle--cloud" viewBox="0 0 62 32" aria-hidden="true">' +
      '<path d="M12 28h38a9 9 0 0 0 0-18 12 12 0 0 0-21-5 10 10 0 0 0-17 7 8 8 0 0 0 0 16z" fill="#fff" style="stroke:var(--rule-strong)" stroke-width="1.5"/></svg>',
    suitcase: '<svg class="doodle doodle--suitcase" viewBox="0 0 42 56" aria-hidden="true">' +
      '<path d="M15 10V4h12v6" fill="none" style="stroke:var(--text)" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="4" y="10" width="34" height="38" rx="7" style="fill:var(--sky);stroke:var(--text)" stroke-width="2"/>' +
      '<path d="M13 16v26M29 16v26" style="stroke:var(--text)" stroke-width="1.5" opacity=".35"/>' +
      '<path d="M21 34s-6-3.6-6-7.4a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3.8-6 7.4-6 7.4z" style="fill:var(--flower)"/>' +
      '<circle cx="11" cy="51" r="3" style="fill:var(--text)"/><circle cx="31" cy="51" r="3" style="fill:var(--text)"/></svg>',
    flower: '<svg class="doodle doodle--flower" viewBox="-13 -13 26 26" aria-hidden="true">' +
      '<g style="fill:var(--flower)"><circle cx="0" cy="-6" r="5"/><circle cx="5.7" cy="-1.9" r="5"/><circle cx="3.5" cy="4.9" r="5"/><circle cx="-3.5" cy="4.9" r="5"/><circle cx="-5.7" cy="-1.9" r="5"/></g>' +
      '<circle r="2.8" fill="#ffd77a"/></svg>'
  };

  function dayCount(trip) {
    var s = new Date(trip.startDate + "T00:00:00");
    var e = new Date((trip.endDate || trip.startDate) + "T00:00:00");
    return Math.round((e - s) / 86400000) + 1;
  }

  // 大頭針圖示（SVG 水滴形）。label 有值時在圓心寫字（旅行頁的順序編號）。
  function pinIcon(color, label, active) {
    var size = active ? 1.25 : 1;
    var w = Math.round(30 * size), h = Math.round(42 * size);
    var inner = label != null
      ? '<circle cx="15" cy="15" r="9" fill="#fff"/><text x="15" y="19.5" text-anchor="middle" font-size="12" font-weight="700" font-family="Huninn, sans-serif" fill="' + color + '">' + esc(label) + "</text>"
      : '<circle cx="15" cy="15" r="5.5" fill="#fff"/>';
    return L.divIcon({
      className: "pin" + (active ? " pin--active" : ""),
      html: '<svg width="' + w + '" height="' + h + '" viewBox="0 0 30 42" aria-hidden="true">' +
        '<path d="M15 41C15 41 28 25.5 28 15A13 13 0 0 0 2 15C2 25.5 15 41 15 41Z" fill="' + color + '" stroke="#fff" stroke-width="2"/>' +
        inner + "</svg>",
      iconSize: [w, h],
      iconAnchor: [w / 2, h],
      popupAnchor: [0, -h]
    });
  }

  // 寫實街道地圖的底圖來源（規則見 CLAUDE.md 第 3 節）
  //   1. data/site.js 有填 cartoKey → CARTO Voyager（本機、線上都能用）
  //   2. 從網站開啟（GitHub Pages，http/https）→ OpenStreetMap 標準地圖
  //   3. 雙擊檔案開啟（file://）且沒有金鑰 → Esri 街道地圖，只當本機預覽用
  // OpenStreetMap 不接受 file:// 的請求（會顯示 403 Access blocked）；
  // CARTO 從 2026 年 9 月起沒有金鑰就只顯示「API KEY REQUIRED」。
  function baseLayer() {
    var key = (window.SITE && window.SITE.cartoKey) || "";
    var osm = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 貢獻者';
    if (key) {
      return L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=" + encodeURIComponent(key), {
        maxZoom: 19,
        attribution: osm + ' &copy; <a href="https://carto.com/attributions">CARTO</a>'
      });
    }
    if (/^https?:$/.test(location.protocol)) {
      return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: osm });
    }
    return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri（本機預覽用）"
    });
  }

  function createMap(elementId, options) {
    var map = L.map(elementId, Object.assign({ worldCopyJump: true }, options || {}));
    baseLayer().addTo(map);
    // 手機上首頁面板會蓋住地圖下方，把版權標示移到右上角
    if (isNarrow()) map.attributionControl.setPosition("topright");
    return map;
  }

  function isNarrow() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  // 照片燈箱：所有頁面共用一個 <dialog>
  var box = null;
  function openPhotos(photos, start) {
    if (!photos || !photos.length) return;
    if (!box) {
      document.body.insertAdjacentHTML("beforeend",
        '<dialog class="lightbox" aria-label="照片">' +
          '<button type="button" class="lightbox__close" aria-label="關閉">×</button>' +
          '<button type="button" class="lightbox__nav lightbox__prev" aria-label="上一張">‹</button>' +
          '<figure><img alt=""><figcaption></figcaption></figure>' +
          '<button type="button" class="lightbox__nav lightbox__next" aria-label="下一張">›</button>' +
        "</dialog>");
      box = document.querySelector(".lightbox");
      box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
      box.querySelector(".lightbox__prev").addEventListener("click", function () { show(box._i - 1); });
      box.querySelector(".lightbox__next").addEventListener("click", function () { show(box._i + 1); });
      box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
      box.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") show(box._i - 1);
        if (e.key === "ArrowRight") show(box._i + 1);
      });
    }
    function show(i) {
      var n = box._photos.length;
      box._i = (i + n) % n;
      var p = box._photos[box._i];
      box.querySelector("img").src = p.src;
      box.querySelector("img").alt = p.caption || "";
      box.querySelector("figcaption").textContent = (p.caption ? p.caption + "　" : "") + (box._i + 1) + " / " + n;
      box.querySelectorAll(".lightbox__nav").forEach(function (b) { b.hidden = n < 2; });
    }
    box._photos = photos;
    show(start || 0);
    if (!box.open) box.showModal();
  }

  function photoStripHTML(photos) {
    if (!photos || !photos.length) return "";
    return '<div class="photo-strip">' + photos.map(function (p, i) {
      return '<button type="button" class="photo-strip__item" data-photo="' + i + '" aria-label="放大照片：' + esc(p.caption || "第 " + (i + 1) + " 張") + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.caption || "") + '" loading="lazy"></button>';
    }).join("") + "</div>";
  }

  function footerHTML() {
    var site = window.SITE || {};
    return "<span>© " + new Date().getFullYear() + " " + esc(site.owner || "") + "</span>" +
      "<span>地圖資料 © OpenStreetMap 貢獻者</span>";
  }

  window.Footprints = {
    PIN_COLORS: PIN_COLORS,
    esc: esc,
    trips: trips,
    findTrip: findTrip,
    colorOf: colorOf,
    dotDate: dotDate,
    dateRange: dateRange,
    visitedText: visitedText,
    dayCount: dayCount,
    dayLabel: dayLabel,
    PIN_GLYPH: PIN_GLYPH,
    DOODLE: DOODLE,
    flightPath: flightPath,
    scheduleHTML: scheduleHTML,
    pinIcon: pinIcon,
    createMap: createMap,
    isNarrow: isNarrow,
    openPhotos: openPhotos,
    photoStripHTML: photoStripHTML,
    footerHTML: footerHTML
  };
})();
