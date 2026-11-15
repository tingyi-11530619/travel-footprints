// 檢查 data/trips.js 是否符合 CLAUDE.md 的格式。
// 用法：在專案根目錄執行  node tools/validate.mjs
// 有錯誤會列出並以代碼 1 結束；只有提醒（例如還有示範資料）時仍算通過。

import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "data/trips.js"), "utf8"), sandbox);
const trips = sandbox.window.TRIPS;

const COLORS = ["red", "blue", "green", "orange", "purple", "teal", "pink", "brown"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TRIP_ID = /^[a-z0-9]+(-[a-z0-9]+)*-\d{4}$/;
const SPOT_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = ["trip", "trip-map", "footer", "map", "panel"]; // 頁面上已經用掉的 HTML id
const MAX_PHOTOS = 10;
const MAX_PHOTO_KB = 800;

const errors = [];
const warnings = [];

if (!Array.isArray(trips)) {
  console.error("data/trips.js 沒有定義 window.TRIPS 陣列");
  process.exit(1);
}

const tripIds = new Set();
const colorByYear = {};
trips.forEach((t, i) => {
  const at = `旅行 ${i + 1}（${t.id || "沒有 id"}）`;
  for (const k of ["id", "title", "country", "countryCode", "startDate", "color", "spots"]) {
    if (t[k] === undefined || t[k] === "") errors.push(`${at}：缺少必填欄位 ${k}`);
  }
  if (t.id && !TRIP_ID.test(t.id)) errors.push(`${at}：id 要是「英文小寫地名-年份」，例如 kyoto-2025`);
  if (tripIds.has(t.id)) errors.push(`${at}：id 重複`);
  tripIds.add(t.id);
  if (t.startDate && !DATE.test(t.startDate)) errors.push(`${at}：startDate 格式要是 YYYY-MM-DD`);
  if (t.endDate && !DATE.test(t.endDate)) errors.push(`${at}：endDate 格式要是 YYYY-MM-DD`);
  if (t.endDate && t.startDate && t.endDate < t.startDate) errors.push(`${at}：endDate 早於 startDate`);
  if (t.id && t.startDate && !t.id.endsWith(t.startDate.slice(0, 4))) warnings.push(`${at}：id 的年份和 startDate 不一致`);
  if (t.countryCode && !/^[A-Z]{2}$/.test(t.countryCode)) errors.push(`${at}：countryCode 要是兩個大寫英文字母`);
  if (t.color && !COLORS.includes(t.color)) errors.push(`${at}：color 只能是 ${COLORS.join("、")}`);
  if (t.title && t.title.length > 16) warnings.push(`${at}：title 超過 16 個字`);
  if (t.sample) warnings.push(`${at}：這是示範資料，記得換成自己的旅行`);

  const spots = Array.isArray(t.spots) ? t.spots : [];
  if (!spots.length) errors.push(`${at}：spots 至少要有一個景點`);
  const spotIds = new Set();
  spots.forEach((s, k) => {
    const sat = `${at} 景點 ${k + 1}（${s.name || s.id || "?"}）`;
    if (!s.date) warnings.push(`${sat}：還沒有填日期，網頁會顯示整趟旅行的日期範圍`);
    for (const key of ["id", "name", "lat", "lng"]) {
      if (s[key] === undefined || s[key] === "") errors.push(`${sat}：缺少必填欄位 ${key}`);
    }
    if (s.id && !SPOT_ID.test(s.id)) errors.push(`${sat}：id 只能用英文小寫、數字和連字號`);
    if (RESERVED.includes(s.id)) errors.push(`${sat}：id「${s.id}」是保留字，請換一個`);
    if (spotIds.has(s.id)) errors.push(`${sat}：同一趟旅行裡 id 重複`);
    spotIds.add(s.id);
    if (typeof s.lat !== "number" || s.lat < -90 || s.lat > 90) errors.push(`${sat}：lat 要是 -90 到 90 的數字`);
    if (typeof s.lng !== "number" || s.lng < -180 || s.lng > 180) errors.push(`${sat}：lng 要是 -180 到 180 的數字`);
    if (s.date && !DATE.test(s.date)) errors.push(`${sat}：date 格式要是 YYYY-MM-DD`);
    if (s.time !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time)) errors.push(`${sat}：time 格式要是 HH:MM，例如 09:30`);
    if (s.date && t.startDate && (s.date < t.startDate || s.date > (t.endDate || t.startDate))) {
      errors.push(`${sat}：date 不在這趟旅行的日期範圍內`);
    }
    if (!s.note && !(s.photos && s.photos.length)) warnings.push(`${sat}：沒有心得也沒有照片，之後記得補`);
    const photos = s.photos || [];
    if (photos.length > MAX_PHOTOS) errors.push(`${sat}：照片最多 ${MAX_PHOTOS} 張，目前 ${photos.length} 張`);
    photos.forEach((p) => {
      const prefix = `images/${t.id}/${s.id}-`;
      if (!p.src || !p.src.startsWith(prefix)) {
        errors.push(`${sat}：照片要放在 images/${t.id}/，檔名以「${s.id}-」開頭（目前是 ${p.src}）`);
      } else if (!/\.(jpe?g|png|webp)$/i.test(p.src)) {
        errors.push(`${sat}：照片只能是 jpg、png 或 webp（${p.src}）`);
      } else if (!existsSync(join(root, p.src))) {
        errors.push(`${sat}：找不到照片 ${p.src}`);
      } else if (statSync(join(root, p.src)).size > MAX_PHOTO_KB * 1024) {
        warnings.push(`${sat}：${p.src} 超過 ${MAX_PHOTO_KB}KB，建議壓縮`);
      }
    });
  });
});

warnings.forEach((w) => console.log("提醒  " + w));
errors.forEach((e) => console.log("錯誤  " + e));
const spotTotal = trips.reduce((n, t) => n + (t.spots || []).length, 0);
console.log(`\n共 ${trips.length} 趟旅行、${spotTotal} 個景點，${errors.length} 個錯誤，${warnings.length} 個提醒。`);
process.exit(errors.length ? 1 : 0);
