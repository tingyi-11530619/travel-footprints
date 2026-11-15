# 我的旅行足跡

我去過一些國家，但常常忘記自己具體去過哪些地方。
這個網站把去過的每個景點都用大頭針釘在地圖上，點開就能看到那天的照片和心得，想起自己曾經來過這裡。

- **網站**：https://你的帳號.github.io/travel-footprints/
- **首頁**：寫實街道地圖，每個景點一根大頭針，同一趟旅行同一個顏色，可以依國家切換。點大頭針，側邊面板會顯示日期、照片（最多 10 張）和心得。
- **旅行頁**：一趟旅行的路線地圖，加上依日期排列的景點時間軸。

## 給 AI 的規則

專案規則寫在 [`CLAUDE.md`](./CLAUDE.md)，包括和 AI 討論後定下的設計決策、資料格式、照片規則與新增流程。[`AGENTS.md`](./AGENTS.md) 給其他 AI 工具用，內容指向同一份規則。

要新增景點，只要對 AI 說：

> 我 2025 年 10 月去了墾丁，第一天去了船帆石看日出，心得是「五點起床很痛苦，但太陽出來那一刻值得」，照片在這裡。

AI 會依 `CLAUDE.md` 的流程建立旅行、查座標、釘上大頭針、放好照片，並執行檢查。

## 自己新增

1. 打開 `data/trips.js`，在對應旅行的 `spots` 裡加一個景點（或新增一趟旅行）。
2. 有照片就放進 `images/<旅行id>/`。
3. 執行 `node tools/validate.mjs` 檢查格式。
4. 雙擊 `index.html` 預覽，沒問題就 push。

## 技術

純 HTML、CSS、JavaScript，不需要安裝或 build。地圖使用 [Leaflet](https://leafletjs.com/) 與 Leaflet.markercluster。底圖：放在網站上時使用 [OpenStreetMap](https://www.openstreetmap.org/)；在 `data/site.js` 填入 CARTO 免費金鑰後改用 CARTO Voyager；雙擊檔案預覽時使用 Esri 街道地圖。
