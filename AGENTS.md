# AGENTS.md

本專案的完整規則寫在 [`CLAUDE.md`](./CLAUDE.md)。任何 AI 工具（Codex、Cursor、Copilot、Gemini 等）在修改前都要先讀那份文件。

最重要的四條：

1. 一個景點 = 地圖上一根大頭針。新增內容只改 `data/trips.js`，不要在 HTML 裡手寫。
2. 不可以編造使用者沒去過的地方或沒寫過的心得；沒有的欄位直接省略。
3. 照片可以沒有，有的話一個景點最多 10 張，放在 `images/<旅行id>/`。
4. 改完執行 `node tools/validate.mjs`，必須是 0 個錯誤。
