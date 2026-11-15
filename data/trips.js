/*
 * 旅行足跡資料（全站唯一的內容來源）
 * ------------------------------------------------------------
 * 結構：一趟旅行（trip）底下有很多景點（spots），每個景點 = 地圖上一根大頭針。
 * 新增景點：在對應旅行的 spots 陣列加一筆。新增旅行：在 TRIPS 陣列加一筆。
 * 欄位規格見 CLAUDE.md 第 5 節。加完後執行：node tools/validate.mjs
 */
window.TRIPS = [
  {
    id: "okinawa-2026",
    title: "來去Okinawa",
    country: "日本",
    countryCode: "JP",
    startDate: "2026-06-29",
    endDate: "2026-07-04",
    companions: "家人",
    color: "blue",
    summary: "好久沒有家族旅遊，第一次來沖繩。",
    spots: [
      {
        id: "parco-city",
        name: "PARCO CITY 浦添西海岸",
        lat: 26.26317,
        lng: 127.69865,
        date: "2026-07-04",
        note: "海邊的百貨公司，餐廳旁邊的海景好美，好壯觀。",
        photos: [
          { src: "images/okinawa-2026/parco-city-01.jpg" }
        ]
      },
      {
        id: "a-long-vacation",
        name: "A LONG VACATION.",
        lat: 26.21563,
        lng: 127.68417,
        date: "2026-07-03",
        note: "鬆餅超級好吃！應該可以是沖繩必吃。",
        photos: [
          { src: "images/okinawa-2026/a-long-vacation-01.jpg" }
        ]
      },
      {
        id: "gyokusendo",
        name: "玉泉洞",
        lat: 26.14034,
        lng: 127.7494,
        date: "2026-07-03",
        photos: [
          { src: "images/okinawa-2026/gyokusendo-01.jpg" }
        ]
      },
      {
        id: "Naminoue Shrine",
        name: "波上宮神社",
        lat: 26.220636,
        lng: 127.671352,
        date: "2026-07-02",
        photos: [
          { src: "images/okinawa-2026/Naminoue Shrine-01.jpg" }
        ]
      },
      {
        id: "Cape Manzamo",
        name: "萬毛座",
        lat: 26.505060,
        lng: 127.849823,
        date: "2026-07-01",
        photos: [
          { src: "images/okinawa-2026/Cape Manzamo-01.jpg" }
        ]
      },
      {
        id: "Ocean Expo Park",
        name: "海洋博公園",
        lat: 26.69452,
        lng: 127.87773,
        date: "2026-07-01",
        note: "終於來到這個海洋館，真的好美，會想再來一遍",
        photos: [
          { src: "images/okinawa-2026/Ocean Expo Park-01.jpg" }
        ]
      },
      {
        id: "KOURI SHRIMP",
        name: "蝦蝦飯",
        lat: 26.69685,
        lng: 128.01982,
        date: "2026-06-29",
        note: "蝦蝦飯滿普通的。",
        photos: [
          { src: "images/okinawa-2026/KOURI SHRIMP-01.jpg" }
        ]
      },
      {
        id: "KARIYUSHI LCH. RESORT on The Beach",
        name: "喜璃愈志LCH海灘度假村",
        lat: 26.53209,
        lng: 127.93013,
        date: "2026-06-29",
        note: "飯店看出去長這樣，很漂亮",
        photos: [
          { src: "images/okinawa-2026/KARIYUSHI LCH. RESORT on The Beach-01.jpg" }
        ]
      },
      {
        id: "KARIYUSHI LCH. RESORT on The Beach",
        name: "喜璃愈志LCH海灘度假村",
        lat: 26.53209,
        lng: 127.93013,
        date: "2026-06-30",
        note: "整天都在飯店完遊樂設施，飯店的私人海灘也是很多東西可以玩",
        photos: [
          { src: "images/okinawa-2026/KARIYUSHI LCH. RESORT on The Beach-02.jpg" }
        ]
      }
    ]
  },
  {
    id: "mongolia-2024",
    title: "蒙古",
    country: "中國",
    countryCode: "CN",
    startDate: "2024-07-04",
    endDate: "2024-07-07",
    companions: "花班",
    color: "red",
    summary: "來蒙古就超級酷!",
    spots: [
      {
        id: "xiangshawan",
        name: "鄂爾多斯響沙灣旅遊區",
        // 大約位置，請用手機照片資訊或 Google 地圖的座標換掉
        lat: 40.24,
        lng: 110.0,
        date: "2024-07-07",
        note: "響沙灣超級好玩",
        photos: [
          { src: "images/mongolia-2024/xiangshawan-01.jpg", caption: "人家騎馬，我騎駱駝，超級酷的體驗！" },
          { src: "images/mongolia-2024/xiangshawan-02.jpg", caption: "沙漠上面的小火車超級酷" },
          { src: "images/mongolia-2024/xiangshawan-03.jpg", caption: "第一次看到沙漠有水上設施……大開眼界" },
          { src: "images/mongolia-2024/xiangshawan-04.jpg", caption: "另一個園區還有普通陸地遊樂設施，也都是在沙漠上面蓋，酷" },
          { src: "images/mongolia-2024/xiangshawan-05.jpg", caption: "超可愛的畫面" }
        ]
      }
    ]
  },
  {
    id: "beijing-2024",
    title: "北京",
    country: "中國",
    countryCode: "CN",
    startDate: "2024-07-08",
    endDate: "2024-07-10",
    companions: "花班",
    color: "red",
    summary: "來中國也是蠻多次了，第一次來首都。",
    spots: [
      {
        id: "Mutianyu Great Wall Tourist Area",
        name: "慕田峪長城旅遊區",
        lat: 40.4319077,
        lng: 116.5703749,
        date: "2024-07-10",
        note: "終於看到萬里長城了!",
        photos: [
          { src: "images/beijing-2024/Mutianyu Great Wall Tourist Area-01.jpg", caption: "打卡照" },
          { src: "images/beijing-2024/Mutianyu Great Wall Tourist Area-02.jpg", caption: "爬上來就很累了，根本走不了多遠" },
          { src: "images/beijing-2024/Mutianyu Great Wall Tourist Area-03.jpg", caption: "這超厲害的，這全部都用手敲出來的" },
        ]
      },
      {
        id: "The Palace Museum",
        name: "北京故宮博物院",
        lat: 39.916345,
        lng: 116.397155,
        date: "2024-07-09",
        note: "故宮人超多快熱死...",
        photos: [
          { src: "images/beijing-2024/The Palace Museum-01.jpg" }
        ]
      },
      {
        id: "Summer Palace",
        name: "頤和園",
        lat: 39.999912,
        lng: 116.275482,
        date: "2024-07-10",
        note: "頤和園人也超多，感覺所有中國人都擠在這裡",
        photos: [
          { src: "images/beijing-2024/Summer Palace-01.jpg" }
        ]
      }
    ]
  },
  {
    id: "da Nang-2026",
    title: "峴港",
    country: "越南",
    countryCode: "VN",
    startDate: "2026-07-15",
    endDate: "2026-07-19",
    companions: "花班",
    color: "green",
    summary: "大夏天來越南快融化了",
    spots: [
      {
        id: "Golden bridge",
        name: "佛手橋",
        lat: 15.99486,
        lng: 107.99625,
        date: "2026-07-18",
        note: "上來巴拿山超級高，搭纜車超級心驚膽顫。",
        photos: [
        { src: "images/da Nang-2026/Golden bridge-01.jpg" }
        ]
      },
      {
        id: "Ba Na Hills",
        name: "巴拿山遊樂設施",
        lat: 15.99709,
        lng: 107.98887,
        date: "2026-07-18",
        note: "這個超級好玩，只不過要排很久",
        photos: [
          { src: "images/da Nang-2026/Ba Na Hills-01.jpg" }
        ]
      },
      {
        id: "Bay Mau Coconut Forest",
        name: "迦南島椰子森林",
        lat: 15.87550,
        lng: 108.37870,
        date: "2026-07-16",
        note: "竹桶船越坐越暈...",
        photos: [
          { src: "images/da Nang-2026/Bay Mau Coconut Forest-01.jpg" }
        ]
      }
    ]
  },
  {
    id: "tainan-2026",
    title: "臺南",
    country: "台灣",
    countryCode: "TW",
    startDate: "2026-07-09",
    endDate: "2026-07-09",
    companions: "大學群",
    color: "yellow",
    summary: "原本要去露營，遇到颱風，假都請了，趁颱風來之前衝一波!",
    spots: [
      {
        id: "Yuguang Island",
        name: "漁光島",
        lat: 22.9813427,
        lng: 120.1550643,
        date: "2026-07-09",
        note: "來很多次了還是很漂亮",
        photos: [
          { src: "images/tainan-2026/Yuguang Island-01.jpg", caption: "打卡照" },
          { src: "images/tainan-2026/Yuguang Island-02.jpg", caption: "玩到鞋子襪子都濕掉了..." },
        ]
      },
      {
        id: "Grilled Corn",
        name: "南都石頭燜烤玉米",
        lat: 22.992739,
        lng: 120.194287,
        date: "2026-07-09",
        note: "來臺南這麼多次第一次吃這間，驚為天人，身為烤玉米愛好者怎麼能沒吃過。",
        photos: [
          { src: "images/tainan-2026/Grilled Corn-01.jpg"}
        ]
      },
      {
        id: "Tainan Garden Night Market",
        name: "花園夜市",
        lat: 23.008198,
        lng: 120.206798,
        date: "2026-07-09",
        note: "來臺南必吃花園夜市，不然不知道要幹嘛。",
        photos: [
          { src: "images/tainan-2026/Tainan Garden Night Market-01.jpg"}
        ]
      }
    ]
  },
  {
    id: "osaka-2026",
    title: "大阪、京都",
    country: "日本",
    countryCode: "JP",
    startDate: "2026-03-02",
    endDate: "2026-03-08",
    companions: "大學群",
    color: "yellow",
    summary: "畢業旅行~",
    spots: [
      {
        id: "Kansai International Airport",
        name: "關西國際機場",
        lat: 34.427299,
        lng: 135.244003,
        date: "2026-03-02",
        note: "完全沒有來到日本的實感",
        photos: [
          { src: "images/osaka-2026/Kansai International Airport-01.jpg"}
        ]
      },
      {
        id: "Ōtori Taisha",
        name: "大鳥大社",
        lat: 34.536778,
        lng: 135.460861,
        date: "2026-03-02",
        note: "沒想到第一天運氣就這麼旺，抽中透明的",
        photos: [
          { src: "images/osaka-2026/Ōtori Taisha-01.png"}
        ]
      },
      {
        id: "Yukari Namba Okonomiyaki",
        name: "難波大阪燒 Yukari千日前店",
        lat: 34.66539,
        lng: 135.50302,
        date: "2026-03-02",
        note: "第一次大阪燒就大踩雷",
        photos: [
          { src: "images/osaka-2026/Namba Okonomiyaki-01.jpg"}
        ]
      },
      {
        id: "Kiyomizu-dera Temple",
        name: "京都清水寺",
        lat: 34.9948,
        lng: 135.7850,
        date: "2026-03-03",
        note: "第二次來清水寺，但這次來一直在下雨",
        photos: [
          { src: "images/osaka-2026/Kiyomizu-dera Temple-01.jpg", caption: "京都下雨又更冷了"},
          { src: "images/osaka-2026/Kiyomizu-dera Temple-02.jpg", caption: "好爽，我這次日本行可能會很順利"},
          { src: "images/osaka-2026/Kiyomizu-dera Temple-03.jpg", caption: "打卡照"},
          { src: "images/osaka-2026/Kiyomizu-dera Temple-04.jpg", caption: "團子蠻好吃的"},
        ]
      },
      {
        id: "Wagyu Sukiyaki Kyoto Rikizan Kyoto Ekimae",
        name: "和牛壽喜燒 京都力山 京都站前店",
        lat: 34.9889,
        lng: 135.7609,
        date: "2026-03-03",
        note: "壽喜燒超級好吃。",
        photos: [
          { src: "images/osaka-2026/Wagyu Sukiyaki Kyoto Rikizan Kyoto Ekimae-01.jpg"}
        ]
      },
      {
        id: "Katsuoji Temple",
        name: "勝尾寺",
        lat: 34.86583,
        lng: 135.49111,
        date: "2026-03-04",
        note: "感覺是大阪必來景點-勝尾寺",
        photos: [
          { src: "images/osaka-2026/Katsuoji Temple-01.jpg", caption: "第一次來勝尾寺，也是打卡到了"},
          { src: "images/osaka-2026/Katsuoji Temple-02.jpg", caption: "印章感覺蓋淺了"},
        ]
      },
      {
        id: "HUGHES PIZZA",
        name: "HUGHES PIZZA",
        lat: 34.70905,
        lng: 135.50381,
        date: "2026-03-04",
        note: "超大PIZZA，也好吃。",
        photos: [
          { src: "images/osaka-2026/HUGHES PIZZA-01.jpg"}
        ]
      },
      {
        id: "Universal Studios Japan",
        name: "環球影城",
        lat: 34.665469,
        lng: 135.433112,
        date: "2026-03-05",
        note: "來到世界上最快樂的地方了",
        photos: [
          { src: "images/osaka-2026/Universal Studios Japan-01.jpg", caption: "紀念第一次來大阪環球影城"},
          { src: "images/osaka-2026/Universal Studios Japan-02.jpg", caption: "終於看到哈利波特城堡"},
          { src: "images/osaka-2026/Universal Studios Japan-03.jpg", caption: "超級任天堂世界超級可愛!"},
        ]
      },
      {
        id: "Kuromon Market",
        name: "黑門市場",
        lat: 34.6659,
        lng: 135.5063,
        date: "2026-03-06",
        photos: [
          { src: "images/osaka-2026/Kuromon Market-01.jpg"}
        ]
      },
      {
        id: "Orange Street",
        name: "橘子街",
        lat: 34.6725,
        lng: 135.4950,
        date: "2026-03-06",
        note: "超多潮牌的一條街，但沒看到喜歡的",
        photos: [
          { src: "images/osaka-2026/Orange Street-01.jpg"}
        ]
      },
      {
        id: "Akiba Kart Osaka Namba",
        name: "秋葉卡丁車大阪難波店",
        lat: 34.6569,
        lng: 135.5064,
        date: "2026-03-06",
        note: "剛拿到駕照沒多久就要在國外開車，甚至是卡丁車",
        photos: [
          { src: "images/osaka-2026/Akiba Kart Osaka Namba-01.jpg", caption: "超級冷，還下雨，教練還開超快，超可怕，但好好玩"},
          { src: "images/osaka-2026/Akiba Kart Osaka Namba-02.jpg", caption: "通天閣"},
        ]
      },
      {
        id: "Umeda",
        name: "梅田",
        lat: 34.70395,
        lng: 135.49754,
        date: "2026-03-07",
        note: "梅田跟無限城一樣",
        photos: [
          { src: "images/osaka-2026/Umeda-01.jpg", caption: "偶像打卡照"},
          { src: "images/osaka-2026/Umeda-02.jpg", caption: "超級難吃"},
        ]
      },
      {
        id: "Dotonbori Glico Sign",
        name: "道頓堀跑跑人",
        lat: 34.66917,
        lng: 135.50131,
        date: "2026-03-07",
        note: "打卡照",
        photos: [
          { src: "images/osaka-2026/Dotonbori Glico Sign-01.jpg"}
        ]
      },
      {
        id: "Namba Yasaka Shrine",
        name: "難波八阪神社",
        lat: 34.66135,
        lng: 135.49687,
        date: "2026-03-08",
        note: "大阪必來神社2，也是打卡到了",
        photos: [
          { src: "images/osaka-2026/Namba Yasaka Shrine-01.jpg"}
        ]
      },
      {
        id: "Rinku Town",
        name: "臨空城",
        lat: 34.40863,
        lng: 135.29706,
        date: "2026-03-08",
        note: "超級漂亮的outlets",
        photos: [
          { src: "images/osaka-2026/Rinku Town-01.jpg", caption: "摩天輪很漂亮"},
          { src: "images/osaka-2026/Rinku Town-02.jpg", caption: "超級難吃"},
        ]
      }
    ]
  },
];
