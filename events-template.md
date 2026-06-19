# イベント情報入力テンプレート

`content/events.json` を編集する際の参考テンプレート。
**Manus などの自動更新ツールでブログ記事を作成する際は、新規イベント情報を検出したらこのファイルを参考に events.json にも追記してください。**

---

## 🤖 自動更新ツール（Manus 等）への指示

ブログ記事「【本日更新】タイGL最新公式情報まとめ」を作成する際、以下の条件を満たすイベントは **必ず events.json にも追記** してください：

- **日時が確定している**（"未確認" の場合は description にメモして status を pending に）
- **会場や開催形式が判明している**（オンラインの場合も含む）
- **GL関連のペア・俳優が出演 / 関連している**
- **公式情報源（Instagram / X / 公式チケットページ等）から確認できる**

events.json への追記が漏れがちな例：
- ファンフェスティバル（BBFanFest など）
- 撮影スケジュール（公開可能なもの）
- ブランドイベント / 番組出演 / 授賞式

---

## JSON フォーマット（現行スキーマ）

```json
{
  "id": "2026-08-15-freenbecky-tokyo",
  "title": "FreenBecky Fan Meeting in Tokyo",
  "title_ja": "FreenBecky ファンミーティング in 東京",
  "title_th": null,
  "date": "2026-08-15",
  "end_date": null,
  "time": "18:00 (JST) / 日本時間 18:00",
  "timezone": "JST (日本時間)",
  "location": "東京国際フォーラム ホールA",
  "location_en": "Tokyo International Forum Hall A",
  "description": "FreenBeckyの単独ファンミーティング。トーク・ミニライブ・ハイタッチ含む。",
  "category": "fan-meeting",
  "color": "#FFC107",
  "pairs": ["FreenBecky"],
  "cast": ["Freen Sarocha", "Becky Armstrong"],
  "company": "IDOLFACTORY",
  "ticket_info": "2026年6月1日 12:00 発売開始",
  "official_link": "https://example.com/event-page",
  "status": "confirmed"
}
```

## フィールド説明（現行スキーマ）

| フィールド | 必須 | 形式 | 例・注意点 |
|---|---|---|---|
| `id` | ✓ | unique slug | **必ず `YYYY-MM-DD-スラッグ` 形式**（時系列ソート用）|
| `title` | ✓ | string | 英語タイトル |
| `title_ja` | ✓ | string | 日本語タイトル（リスト表示で優先）|
| `title_th` | - | string or null | タイ語タイトル |
| `date` | ✓ | YYYY-MM-DD | 開始日 |
| `end_date` | - | YYYY-MM-DD or null | 複数日の場合のみ |
| `time` | - | string or null | 例: `"18:00 (ICT) / 日本時間 20:00"` |
| `timezone` | - | string or null | 例: `"ICT (タイ時間)"`, `"JST (日本時間)"` |
| `location` | - | string or null | 会場名+都市（日本語）|
| `location_en` | - | string or null | 会場名+都市（英語）|
| `description` | - | string or null | イベントの説明 |
| `category` | ✓ | EventCategory | 下記参照 |
| `color` | - | hex色 | 既存色から選ぶ（フィルタ用） |
| `pairs` | - | string[] | **配列**。pairs.jsonキー（例: `["LingOrm", "MilkLove"]`）|
| `cast` | - | string[] | **配列**。個人名（例: `["Freen Sarocha", "Becky Armstrong"]`）|
| `company` | - | 事務所名 | 例: `"GMMTV"`, `"IDOLFACTORY"`（**先頭大文字、ALL CAPS不可**）|
| `ticket_info` | - | string or null | 例: `"2026年6月1日 12:00 発売開始"` |
| `official_link` | - | URL or null | 公式情報源 |
| `status` | ✓ | string | `"confirmed"` / `"pending"` / `"past"` / `"cancelled"` |

## category の選択肢（11種類）

| category | 用途 | アイコン | 色 |
|---|---|---|---|
| `"birthday"` | 女優の誕生日（actresses.json から自動生成）| 🎂 | ピンク |
| `"broadcast"` | ドラマ放送日（自動生成）| 📺 | スカイブルー |
| `"fan-meeting"` | ファンミーティング | 🎤 | ローズ |
| `"concert"` | コンサート・大型ライブ・ファンフェス | 🎵 | バイオレット |
| `"premiere"` | プレミア試写・舞台挨拶 | 🎬 | アンバー |
| `"press"` | 記者会見・プレス発表 | 🗞 | スレートグレー |
| `"release"` | 商品リリース・発売イベント | 💿 | エメラルド |
| `"fashion"` | ファッションウィーク・ブランドショー | 👗 | フューシャ |
| `"award-ceremony"` | 授賞式・アワード | 🏆 | イエロー |
| `"event"` | 番組出演・ブランドイベント等（汎用）| ✨ | インディゴ |
| `"other"` | 撮影など、上記いずれにも該当しない | ✦ | グレー |

---

## 表記の統一ルール

### 事務所名（company フィールド）
**先頭大文字 + 通常表記**で統一：

✅ 正：`"GMMTV"` / `"IDOLFACTORY"` / `"Me Mind Y"` / `"Becky Entertainment"` / `"Solenn Entertainment"`
❌ 誤：`"gmmtv"` / `"ME MIND Y"` / `"BECKY ENTERTAINMENT"`（大文字小文字違いで dropdown 重複の原因）

### 共催の場合
**"X / Y" 形式** で1つの string にまとめる：

```json
"company": "Solenn Entertainment / Becky Entertainment"
```

### 個人名（cast フィールド）の正規化
**actresses.json の `name_en` と完全一致** させる：

- `"Freen Sarocha"` ✅
- `"freen sarocha"` ❌（小文字）
- `"Sarocha Chankimha"` ❌（本名）

特に注意：**"LingLing"**（双 L 大文字）、`"Lingling"` は誤り

---

## 入力サンプル（複数）

### サンプル1：ファンミ
```json
{
  "id": "2026-08-15-girl-rules-singapore",
  "title": "Girl Rules Fan Meeting in Singapore",
  "title_ja": "Girl Rules シンガポールファンミーティング",
  "date": "2026-08-15",
  "time": "18:30 (SGT) / 日本時間 19:30",
  "timezone": "SGT (シンガポール時間)",
  "location": "D'MARQUEE @ DOWNTOWN EAST（シンガポール）",
  "location_en": "D'MARQUEE @ DOWNTOWN EAST, Singapore",
  "description": "Girl Rules のシンガポール公演。MilkLove, NamtanFilm, ViewMim が出演。",
  "category": "fan-meeting",
  "color": "#FFC107",
  "pairs": ["NamtanFilm", "MilkLove", "ViewMim"],
  "cast": ["Namtan Tipnaree", "Film Rachanun", "Milk Pansa", "Love Pattranite", "View Benyapa", "Mim Rattanawadee"],
  "company": "GMMTV",
  "ticket_info": "2026年5月29日 12:00 発売開始",
  "official_link": "https://www.instagram.com/p/DYeBuw3Abp4/",
  "status": "confirmed"
}
```

### サンプル2：ファンフェスティバル
```json
{
  "id": "2026-06-13-bbfanfest-bangkok",
  "title": "BBFanFest 2026: Blush Blossom Midnight Bloom Fan Fest",
  "title_ja": "BBFanFest 2026（Blush Blossom Midnight Bloom Fan Fest）",
  "date": "2026-06-13",
  "end_date": "2026-06-14",
  "location": "バンコク（タイ）",
  "category": "concert",
  "color": "#E91E63",
  "pairs": ["MilkLove", "EmiBonnie", "NamtanFilm", "JanJingJing"],
  "company": "GMMTV",
  "official_link": "https://www.thaiticketmajor.com/concert/blush-blossom-fan-fest-2026-midnight-bloom.html",
  "status": "past"
}
```

### サンプル3：授賞式
```json
{
  "id": "2026-06-21-global-ott-awards",
  "title": "2026 GLOBAL OTT AWARDS",
  "date": "2026-06-21",
  "time": "20:00 (KST) / 日本時間 20:00",
  "location": "釜山シネマセンター（釜山、韓国）",
  "category": "award-ceremony",
  "color": "#FFC107",
  "pairs": [],
  "cast": ["Becky Armstrong"],
  "company": "Becky Entertainment",
  "status": "confirmed"
}
```

### サンプル4：番組出演 / ブランドイベント
```json
{
  "id": "2026-06-12-becky-uniqlo-event",
  "title": "Becky x Uniqlo UT Graphic-T Universe Event",
  "date": "2026-06-12",
  "location": "Fashion Hall, サイアムパラゴン（バンコク、タイ）",
  "category": "event",
  "color": "#3F51B5",
  "pairs": [],
  "cast": ["Becky Armstrong"],
  "company": "Becky Entertainment",
  "status": "past"
}
```

---

## ペア名一覧（pairs フィールド用）

主要ペア（短縮名・pairs.json のキーと完全一致が必要）：

```
FreenBecky / LingOrm / MilkLove / NamtanFilm / EmiBonnie / ViewMim
JanJingJing / FayeYoko / LMSY / LillyBelle / EngLot / KaoJane
GraceOaey / LenaMiu / OomBam / AppleMim / GinJay / TKNur
FayeAtom / TanYada / PitchaNatt / EnyaMiphat / JuneMewnich
PahnFond / MewRenee / NamneungNoey / ShellyPundao / BleJie
EnjoyJune / FayMay / OrmFolk / IceMemi / TungpangJessie
ChristineMae / ArhoungPam / PlaifahBebell / NileNamwan / AndaLookkaew
BMineMashi / BMineNear / AndaPraewa / MookShu / KittyPunch
MookPink / NoonPraewa / MayyuChanya / DianaYoshi / NeneKhaimook
```

---

## 自動更新ツール用：チェックリスト

毎日のスキャンで以下を確認：

- [ ] 公式 Instagram で新規イベント告知があるか？
  - GMMTV: [@gmmtv](https://instagram.com/gmmtv)
  - IDOLFACTORY: [@idolfactoryth](https://instagram.com/idolfactoryth)
  - CHANGE2561: [@change2561](https://instagram.com/change2561)
  - Channel 3 / BEC World: [@ch3thailand](https://instagram.com/ch3thailand)
  - Me Mind Y: [@memindyofficial](https://instagram.com/memindyofficial)
  - その他主要事務所多数
- [ ] 検出したイベントは `content/events.json` に追記したか？
- [ ] 日付・会場・出演者の3点セットが揃っているか？
- [ ] `id` は `YYYY-MM-DD-keyword` の形式か？
- [ ] `pairs[]` のペア名は上記の正規キーと一致するか？

---

最終更新: 2026-06-19（スキーマv2: pairs配列/cast配列/company移行）
