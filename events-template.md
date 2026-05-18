# イベント情報入力テンプレート

`content/events.json` を編集する際の参考テンプレート。

## JSON フォーマット

```json
{
  "id": "freenbecky-fanmeet-tokyo-202608",
  "title": "FreenBecky Fan Meeting in Tokyo",
  "title_th": null,
  "date": "2026-08-15",
  "end_date": null,
  "time": "18:00",
  "venue": "東京国際フォーラム ホールA",
  "city": "東京",
  "country": "日本",
  "category": "fan-meeting",
  "pair": "FreenBecky",
  "agency": "IDOLFACTORY",
  "description": "FreenBeckyの初の日本単独ファンミーティング。トーク、ミニライブ、ハイタッチセッション。",
  "link": "https://example.com/event-page",
  "cover_image": null
}
```

## フィールド説明

| フィールド | 必須 | 形式 | 例 |
|---|---|---|---|
| `id` | ✓ | unique slug | `"freenbecky-fanmeet-tokyo-202608"` |
| `title` | ✓ | string | `"FreenBecky Fan Meeting in Tokyo"` |
| `title_th` | - | string or null | タイ語タイトル |
| `date` | ✓ | YYYY-MM-DD | `"2026-08-15"` |
| `end_date` | - | YYYY-MM-DD or null | 複数日の場合のみ |
| `time` | - | string or null | `"18:00"` / `"13:00 / 18:00（2回公演）"` |
| `venue` | - | string or null | 会場名 |
| `city` | - | string or null | `"東京"` / `"Bangkok"` |
| `country` | - | string or null | `"日本"` / `"タイ"` |
| `category` | ✓ | EventCategory | 下記参照 |
| `pair` | - | pairs.jsonキー or null | `"FreenBecky"` / `"LMSY"` 等 |
| `agency` | - | 事務所名 or null | `"IDOLFACTORY"` / `"GMMTV"` 等 |
| `description` | - | string or null | イベントの説明 |
| `link` | - | URL or null | 公式チケットページ等 |
| `cover_image` | - | path or null | `/images/events/xxx.jpg` |

## category の選択肢

- `"fan-meeting"` → ファンミ
- `"concert"` → コンサート
- `"premiere"` → プレミア・上映会
- `"press"` → 記者会見
- `"release"` → リリースイベント
- `"fashion"` → ファッションイベント
- `"other"` → その他

## 入力サンプル（events.json）

```json
[
  {
    "id": "lingorm-fanmeet-tokyo-202604",
    "title": "LingOrm 1st Fan Meeting in Japan",
    "date": "2026-04-12",
    "venue": "舞浜アンフィシアター",
    "city": "千葉",
    "country": "日本",
    "category": "fan-meeting",
    "pair": "LingOrm",
    "agency": "Channel 3 / BEC World",
    "link": "https://example.com/lingorm-jp"
  },
  {
    "id": "broken-of-love-premiere-202603",
    "title": "Broken of Love 試写会",
    "date": "2026-03-15",
    "venue": "Central World",
    "city": "Bangkok",
    "country": "タイ",
    "category": "premiere",
    "pair": "FayeAtom",
    "agency": "Fabel Entertainment"
  }
]
```

## ペア名一覧（pair フィールド用）

主要ペア: FreenBecky / LingOrm / MilkLove / NamtanFilm / EmiBonnie / FayeYoko / LMSY / EngLot / KaoJane / GraceOaey / LenaMiu / LillyBelle / AppleMimu / GinJay / TKNur / FayeAtom / TanYada / OomBam / JanJingJing / PitchaNatt / ViewMim / EnyaMiphat / JuneMewnich / PahnFond / MewRenee
