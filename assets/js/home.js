/* 首頁：寫實地圖＋大頭針＋側邊面板
 * 網址的 # 決定面板內容（可以用上一頁返回，也可以分享）：
 *   #                       → 所有旅行
 *   #trip=<旅行id>          → 一趟旅行的景點列表
 *   #<旅行id>/<景點id>      → 一個景點的照片與心得
 */
(function () {
  "use strict";
  var F = window.Footprints;
  var esc = F.esc;
  var site = window.SITE || {};
  var trips = F.trips();
  var panel = document.getElementById("panel");

  if (site.title) {
    document.title = site.title;
    document.getElementById("site-title").textContent = site.title;
  }
  document.getElementById("site-title").insertAdjacentHTML("afterend", F.DOODLE.plane);

  // ---- 統計 ----
  var countries = [];
  var spotCount = 0;
  trips.forEach(function (t) {
    if (countries.indexOf(t.country) === -1) countries.push(t.country);
    spotCount += t.spots.length;
  });
  document.getElementById("count").textContent =
    "釘了 " + spotCount + " 個地方，" + trips.length + " 趟旅行，" + countries.length + " 個國家";

  // ---- 地圖與大頭針 ----
  var map = F.createMap("map", { zoomControl: true });
  var clusters = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    iconCreateFunction: function (cluster) {
      var n = cluster.getChildCount();
      return L.divIcon({ className: "cluster", html: "<span>" + n + "</span>", iconSize: [40, 40] });
    }
  });
  map.addLayer(clusters);

  var markers = {}; // key: 旅行id/景點id
  trips.forEach(function (t) {
    t.spots.forEach(function (s) {
      var key = t.id + "/" + s.id;
      var m = L.marker([s.lat, s.lng], { icon: F.pinIcon(F.colorOf(t)), title: s.name, alt: s.name, keyboard: true });
      m._trip = t;
      m._spot = s;
      m.on("click", function () { location.hash = key; });
      markers[key] = m;
    });
  });

  var country = "全部";
  function showMarkers() {
    clusters.clearLayers();
    Object.keys(markers).forEach(function (k) {
      if (country === "全部" || markers[k]._trip.country === country) clusters.addLayer(markers[k]);
    });
  }

  function fitSpots(spots) {
    if (!spots.length) { map.setView([23.7, 121], 7); return; }
    if (spots.length === 1) { map.setView([spots[0].lat, spots[0].lng], 15); return; }
    var bottom = F.isNarrow() ? map.getSize().y * 0.48 + 30 : 50; // 手機要避開下方面板
    map.fitBounds(spots.map(function (s) { return [s.lat, s.lng]; }), {
      paddingTopLeft: [50, 50],
      paddingBottomRight: [50, bottom],
      maxZoom: 15
    });
  }

  function visibleSpots() {
    var list = [];
    trips.forEach(function (t) {
      if (country === "全部" || t.country === country) list = list.concat(t.spots);
    });
    return list;
  }

  // ---- 國家切換 ----
  var filters = document.getElementById("filters");
  filters.innerHTML = ["全部"].concat(countries).map(function (c) {
    return '<button type="button" class="chip" aria-pressed="' + (c === "全部") + '" data-country="' + esc(c) + '">' + esc(c) + "</button>";
  }).join("");
  function setCountry(c) {
    country = c;
    Array.prototype.forEach.call(filters.children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-country") === c));
    });
    showMarkers();
  }
  filters.addEventListener("click", function (e) {
    var b = e.target.closest("button.chip");
    if (!b) return;
    setCountry(b.getAttribute("data-country"));
    fitSpots(visibleSpots());
    if (location.hash) location.hash = ""; else renderHome();
  });

  // ---- 大頭針選取狀態 ----
  var activeKey = null;
  function setActive(key) {
    if (activeKey && markers[activeKey]) {
      markers[activeKey].setIcon(F.pinIcon(F.colorOf(markers[activeKey]._trip)));
      markers[activeKey].setZIndexOffset(0);
    }
    activeKey = key;
    if (key && markers[key]) {
      markers[key].setIcon(F.pinIcon(F.colorOf(markers[key]._trip), null, true));
      markers[key].setZIndexOffset(1000);
    }
  }

  // ---- 面板 ----
  function sampleNote() {
    return trips.some(function (t) { return t.sample; })
      ? '<p class="sample-note">目前地圖上是示範內容，換成自己的旅行後這行會消失。</p>' : "";
  }

  function renderHome() {
    setActive(null);
    panel.style.removeProperty("--pin");
    var list = trips.filter(function (t) { return country === "全部" || t.country === country; });
    panel.innerHTML =
      '<div class="panel__body">' +
        '<p class="script panel__script">My trips' + F.DOODLE.flower + "</p>" +
        '<p class="panel__intro">' + esc(site.intro || "") + "</p>" +
        sampleNote() +
        '<ol class="schedule schedule--trips">' +
          list.map(function (t) {
            return '<li><a href="#trip=' + encodeURIComponent(t.id) + '" style="--pin:' + F.colorOf(t) + '">' +
              '<span class="schedule__time">' + esc(F.dotDate(t.startDate)) + "</span>" +
              '<span class="schedule__name">' + esc(t.title) +
                '<span class="schedule__sub">' + esc(t.country + "，" + F.dayCount(t) + " 天，" + t.spots.length + " 個地方") + "</span>" +
              "</span></a></li>";
          }).join("") +
        "</ol>" +
      "</div>" +
      '<footer class="panel__footer">' + F.footerHTML() + "</footer>";
  }

  function spotHref(t, s) {
    return "#" + encodeURIComponent(t.id) + "/" + encodeURIComponent(s.id);
  }

  function renderTrip(t) {
    setActive(null);
    panel.style.setProperty("--pin", F.colorOf(t));
    panel.innerHTML =
      '<div class="panel__body">' +
        '<a class="panel__back" href="#">所有旅行</a>' +
        '<h2 class="panel__title">' + esc(t.title) + "</h2>" +
        '<p class="panel__meta">' + esc(t.country + "　" + F.dateRange(t) + "　" + F.dayCount(t) + " 天" + (t.companions ? "　和" + t.companions : "")) + "</p>" +
        (t.summary ? '<p class="sticky sticky--blue">' + esc(t.summary) + "</p>" : "") +
        F.scheduleHTML(t, function (s) { return spotHref(t, s); }) +
        '<a class="panel__link" href="trip.html?id=' + encodeURIComponent(t.id) + '">打開這趟旅行的行程頁</a>' +
      "</div>";
  }

  function renderSpot(t, s) {
    var key = t.id + "/" + s.id;
    panel.style.setProperty("--pin", F.colorOf(t));
    var others = t.spots.filter(function (o) { return o !== s; });
    panel.innerHTML =
      '<div class="panel__body">' +
        '<a class="panel__back" href="#trip=' + encodeURIComponent(t.id) + '">' + esc(t.title) + "</a>" +
        '<h2 class="place-title">' + F.PIN_GLYPH + "<span>" + esc(s.name) + "</span></h2>" +
        '<p class="visited">' +
          (s.date ? '<span class="day-oval">' + esc(F.dayLabel(t, s.date).toUpperCase()) + "</span>" : "") +
          "<span>" + esc(F.visitedText(t, s)) + (s.time ? "，" + esc(s.time) : "") + "</span></p>" +
        F.photoStripHTML(s.photos) +
        (s.note
          ? '<p class="caption">' + esc(s.note) + "</p>"
          : '<p class="caption caption--empty">還沒有寫心得。想到什麼，隨時回來補上。</p>') +
        (others.length
          ? '<h3 class="panel__heading">這趟旅行還去了</h3><ul class="chips">' +
            others.map(function (o) {
              return '<li><a class="chip" href="' + spotHref(t, o) + '">' + esc(o.name) + "</a></li>";
            }).join("") + "</ul>"
          : "") +
        '<a class="panel__link" href="trip.html?id=' + encodeURIComponent(t.id) + "#" + encodeURIComponent(s.id) + '">在行程頁裡看</a>' +
      "</div>";

    panel.querySelectorAll("[data-photo]").forEach(function (b) {
      b.addEventListener("click", function () { F.openPhotos(s.photos, Number(b.getAttribute("data-photo"))); });
    });

    if (country !== "全部" && t.country !== country) setCountry("全部");
    clusters.zoomToShowLayer(markers[key], function () {
      map.setView([s.lat, s.lng], Math.max(map.getZoom(), 15), { animate: false });
      // 手機上面板蓋住下半部，把大頭針移到上半部看得到的地方
      if (F.isNarrow()) map.panBy([0, map.getSize().y * 0.24], { animate: false });
      setActive(key);
    });
  }

  // ---- 依網址顯示 ----
  function route(first) {
    var h = decodeURIComponent(location.hash.slice(1));
    panel.scrollTop = 0;
    if (h.indexOf("trip=") === 0) {
      var t = F.findTrip(h.slice(5));
      if (t) { renderTrip(t); fitSpots(t.spots); return; }
    } else if (h.indexOf("/") !== -1) {
      var parts = h.split("/");
      var trip = F.findTrip(parts[0]);
      var spot = trip && trip.spots.filter(function (s) { return s.id === parts[1]; })[0];
      if (spot) { renderSpot(trip, spot); return; }
    }
    renderHome();
    if (!first && h === "") fitSpots(visibleSpots());
  }

  showMarkers();
  fitSpots(visibleSpots()); // 地圖一定要先有初始視野，直接從網址打開景點時才能定位
  window.addEventListener("hashchange", function () { route(false); });
  route(true);
})();
