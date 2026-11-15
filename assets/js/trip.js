/* 旅行頁：做成一張「旅行行程表」
 *   上半部：大標題、白色行程卡（Day 分組＋虛線時間軸）、旁邊的 MEMO 卡
 *   中間：路線地圖
 *   下半部：每個景點一張卡片（定位圖示＋名稱、照片、置中的心得）
 */
(function () {
  "use strict";
  var F = window.Footprints;
  var esc = F.esc;
  var site = window.SITE || {};
  var root = document.getElementById("trip");
  document.getElementById("footer").innerHTML = F.footerHTML();

  var id = new URLSearchParams(location.search).get("id");
  var t = id ? F.findTrip(id) : null;

  if (!t) {
    document.title = "找不到這趟旅行";
    root.innerHTML =
      '<section class="card not-found"><h1>找不到這趟旅行</h1>' +
      "<p>網址裡的 id 是「" + esc(id || "（空白）") + "」，但 <code>data/trips.js</code> 裡沒有這筆資料。回到足跡地圖重新選一趟旅行。</p>" +
      '<p><a href="index.html">回到足跡地圖</a></p></section>';
    return;
  }

  document.title = t.title + "｜" + (site.title || "我的旅行足跡");
  var color = F.colorOf(t);
  root.style.setProperty("--pin", color);


  var html =
    '<header class="sched-head">' +
      F.DOODLE.cloud + F.DOODLE.cloud +
      '<p class="sched-head__kicker">旅行日程表</p>' +
      "<h1>" + esc(t.title) + "</h1>" +
      '<p class="sched-head__sub">' + esc(t.country + "　" + F.dateRange(t) + "　" + F.dayCount(t) + " 天") + "</p>" +
      F.flightPath("right") +
      (t.sample ? '<p class="sample-note">這是示範內容，換成自己的旅行後就會消失。</p>' : "") +
    "</header>" +

    '<div class="sched-top">' +
      '<section class="card sched-card airmail" aria-label="行程">' +
        F.DOODLE.suitcase +
        F.scheduleHTML(t, function (s) { return "#" + s.id; }) +
      "</section>" +
      '<aside class="sched-side">' +
        '<div class="memo">' +
          '<p class="memo__title">MEMO</p>' +
          '<ul class="memo__lines">' +
            (t.summary ? "<li>" + esc(t.summary) + "</li>" : "") +
            (t.companions ? "<li>同行：" + esc(t.companions) + "</li>" : "") +
            "<li>" + esc(F.dayCount(t) + " 天，去了 " + t.spots.length + " 個地方") + "</li>" +
          "</ul>" +
          F.DOODLE.flower +
        "</div>" +
      "</aside>" +
    "</div>" +

    '<div class="card map-card"><div id="trip-map" class="trip-map" role="region" aria-label="這趟旅行的路線"></div></div>' +

    '<section class="spot-cards" aria-label="景點">';

  t.spots.forEach(function (s, i) {
    var photos = s.photos || [];
    html +=
      '<article class="spot-card" id="' + esc(s.id) + '">' +
        '<h2 class="place-title">' + F.PIN_GLYPH + "<span>" + (s.time ? '<span class="place-title__time">' + esc(s.time) + "~</span>" : "") + esc(s.name) + "</span></h2>" +
        (photos.length
          ? '<button type="button" class="spot-card__photo" data-spot="' + i + '" data-photo="0" aria-label="放大照片：' + esc(photos[0].caption || s.name) + '">' +
              '<img src="' + esc(photos[0].src) + '" alt="' + esc(photos[0].caption || "") + '" loading="lazy">' +
              (photos.length > 1 ? '<span class="spot-card__more">共 ' + photos.length + " 張</span>" : "") +
            "</button>"
          : '<div class="spot-card__nophoto">' + F.PIN_GLYPH + "<span>沒有照片，但我來過這裡</span></div>") +
        (s.note ? '<p class="caption">' + esc(s.note) + "</p>" : '<p class="caption caption--empty">還沒有寫心得。</p>') +
        '<p class="spot-card__meta">' +
          esc(s.date ? F.dayLabel(t, s.date) + "　" + F.dotDate(s.date) : "日期未記錄") + (s.time ? "　" + esc(s.time) : "") +
          '　<a href="index.html#' + encodeURIComponent(t.id) + "/" + encodeURIComponent(s.id) + '">在大地圖上看</a>' +
        "</p>" +
      "</article>";
  });
  html += "</section>";
  html += F.flightPath("left"); // 回程

  // 上一趟／下一趟（依日期）
  var all = F.trips();
  var idx = all.map(function (x) { return x.id; }).indexOf(t.id);
  var newer = all[idx - 1];
  var older = all[idx + 1];
  if (newer || older) {
    html += '<nav class="pager" aria-label="其他旅行">' +
      (older ? '<a class="pager__older" href="trip.html?id=' + encodeURIComponent(older.id) + '">更早的旅行：' + esc(older.title) + "</a>" : "<span></span>") +
      (newer ? '<a class="pager__newer" href="trip.html?id=' + encodeURIComponent(newer.id) + '">之後的旅行：' + esc(newer.title) + "</a>" : "<span></span>") +
    "</nav>";
  }

  root.innerHTML = html;

  root.querySelectorAll("[data-photo]").forEach(function (b) {
    b.addEventListener("click", function () {
      F.openPhotos(t.spots[Number(b.getAttribute("data-spot"))].photos, Number(b.getAttribute("data-photo")));
    });
  });

  // 路線地圖：依順序編號的大頭針，用虛線連起來
  var map = F.createMap("trip-map", { scrollWheelZoom: false });
  var points = t.spots.map(function (s) { return [s.lat, s.lng]; });
  if (points.length > 1) {
    L.polyline(points, { color: color, weight: 3, opacity: 0.7, dashArray: "2 8", lineCap: "round" }).addTo(map);
    map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  } else if (points.length === 1) {
    map.setView(points[0], 15);
  }
  t.spots.forEach(function (s, i) {
    L.marker([s.lat, s.lng], { icon: F.pinIcon(color, i + 1), title: s.name })
      .addTo(map)
      .on("click", function () {
        document.getElementById(s.id).scrollIntoView({ behavior: "smooth", block: "start" });
      });
  });

  // 從大地圖點進來時，捲到那個景點
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
