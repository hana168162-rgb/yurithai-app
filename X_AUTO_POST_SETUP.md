# X (Twitter) 自動投稿 セットアップガイド

YuriThai は **毎日のブログ記事を自動で X に投稿する機能**を備えています。
本ドキュメントは、初回設定（API キー取得 + Vercel 環境変数登録）の手順をまとめたものです。

---

## 1. アーキテクチャ — 1日3スロット運用

```
[Vercel Cron Jobs] (毎日 09:00 / 13:00 / 18:00 JST = 1日3スロット)
       ↓
GET /api/cron/auto-tweet
       ↓
スロット番号を JST 時刻から自動判定 (0/1/2)
       ↓
当日付の新着ブログ記事を slug 昇順で並べる
       ↓
┌─ blogs[slot] が存在 → 新着ブログ投稿
│
└─ 存在しない → スロット別フォールバック
     slot 0 → 過去ブログ再紹介 (throwback-blog)
     slot 1 → 放送中作品の紹介 (drama-airing)
     slot 2 → ローテーション (完結作品 / 過去ブログ / 診断)
       ↓
ツイート文を組み立て (280字以内に自動整形)
       ↓
X に投稿
```

### 投稿の種類と日次イメージ

| スロット | JST 時刻 | 当日新着ブログあり | 新着なし時のフォールバック |
|---|---|---|---|
| **0** morning | 09:00 | blogs[0] を投稿 | 過去ブログ再紹介 |
| **1** noon | 13:00 | blogs[1] を投稿 | 放送中作品の紹介 |
| **2** evening | 18:00 | blogs[2] を投稿 | 完結作品 / 過去ブログ / 診断のローテ |

### 重要な仕様

- **対象は「ブログ記事のみ」**（`sns-update` カテゴリは除外。Manus 速報は対象外）
- **新着の判定**は `date` フィールドが JST 当日と一致するもの
- **同じ日に同じ内容を投稿しないため**、フォールバック内の選択は `date + slot` を seed にした決定的ハッシュで決定
- **過去ブログ**は「公開から 14 日以上経過」を再紹介の対象に
- **毎日必ず 3 回**投稿する（ブログが無い日もフォールバックで動く）

### ツイートのフォーマット

```
[ヘッダ絵文字付きラベル]

[タイトル]

[1行フック]

[URL]
#タイGL (#追加タグ)
```

### 投稿例

新着ブログ:
```
🌸 新着記事

本日プレミア：In Love Forever 第1話 — LingOrm 第3作、今夜 22:30 JST から

2026年6月19日（金）22:30 JST、LingOrm の Channel 3 第3作『In Love Forever』第1話が放送開始。…

https://yurithai.jp/blog/in-love-forever-premiere-day
#タイGL #LingOrm
```

過去ブログ再紹介:
```
📚 アーカイブから

ShellyPundao 完全ガイド

無名から Roller Coaster 主演まで、新世代ペアの軌跡を追う。

https://yurithai.jp/blog/shellypundao-feature
#タイGL
```

放送中作品紹介:
```
🎬 放送中の注目作

Chasing Love（ตามล่าหารัก）

CHANGE2561 Original制作 / 原作Peony / 監督Bo Pantip Vibultham

https://yurithai.jp/dramas/chasing-love
#タイGL
```

診断プロモ:
```
✦ おすすめ診断

タイGL、何から観ればいい？

5 問の質問で、あなたに合う 1 作をマッチング。

https://yurithai.jp/recommend
#タイGL #タイGLおすすめ
```

---

## 2. X Developer Portal でキーを取得

### 2-1. アプリ作成

1. https://developer.x.com/portal/dashboard にアクセス（YuriThai 公式 X アカウントでログイン）
2. **Sign up for Free Access** で開発者アカウントを作成（無料プランで OK）
3. **Project 作成** → **App 作成**
   - App 名: 何でも OK（例 `YuriThai Auto Post`）
   - User authentication settings の **Set up** を選択
4. **User authentication settings**:
   - **App permissions**: **Read and write** を必ず選ぶ ✅
   - **Type of App**: **Web App, Automated App or Bot**
   - **Callback URI**: `https://yurithai.jp/api/x-callback`（実際には使わないが要入力）
   - **Website URL**: `https://yurithai.jp`
   - **Save**

### 2-2. キー・トークンを取得

App 画面の **Keys and tokens** タブで以下 4 つを取得：

| 名前（X 表記）| 環境変数名 |
|---|---|
| **API Key**（Consumer Key）| `X_API_KEY` |
| **API Key Secret**（Consumer Secret）| `X_API_SECRET` |
| **Access Token** | `X_ACCESS_TOKEN` |
| **Access Token Secret** | `X_ACCESS_SECRET` |

> ⚠️ **Access Token は permission 設定（Read and write）変更後に "Regenerate" し直して取得**してください。
> permission 変更前のトークンだと投稿時に 403 エラーになります。

---

## 3. Vercel に環境変数を登録

1. Vercel Dashboard → YuriThai プロジェクト → **Settings** → **Environment Variables**
2. 以下を **Production** と **Preview** の両方に追加：

```
X_API_KEY=（取得した API Key）
X_API_SECRET=（取得した API Key Secret）
X_ACCESS_TOKEN=（取得した Access Token）
X_ACCESS_SECRET=（取得した Access Token Secret）
CRON_SECRET=（任意の英数字を 32 文字以上で生成。例: openssl rand -hex 32 の出力）
```

3. 設定後、**Redeploy** で反映

> 💡 `CRON_SECRET` を設定すると、Cron 以外からの API 叩きを 401 で弾けます（推奨）。
> Vercel Cron はこの Secret を `Authorization: Bearer <secret>` ヘッダで自動送信するので、
> Cron 自身の動作には影響しません。

---

## 4. 動作確認

### 4-1. ローカルで動作確認（投稿はしない）

`.env.local` に X_API_KEY 等を**入れない**状態で：

```bash
npm install            # twitter-api-v2 を入れる
npm run dev
curl http://localhost:3000/api/cron/auto-tweet
```

レスポンスに `posted: 0`、`reason: "X API credentials not set"` が含まれれば
**no-op で安全に動いている**証拠です。

### 4-2. Vercel 本番で動作確認

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://yurithai.jp/api/cron/auto-tweet
```

レスポンス例（今日付の記事が無いとき）:
```json
{
  "ok": true,
  "today": "2026-06-19",
  "message": "No posts for today, nothing to tweet.",
  "candidates": 0
}
```

レスポンス例（投稿が走ったとき）:
```json
{
  "ok": true,
  "today": "2026-06-19",
  "candidates": 1,
  "posted": 1,
  "skipped": 0,
  "results": [
    {
      "slug": "in-love-forever-premiere-day",
      "title": "本日プレミア：In Love Forever 第1話 — LingOrm 第3作、今夜 22:30 JST から",
      "posted": true,
      "id": "1234567890123456789",
      "reason": null
    }
  ]
}
```

---

## 5. Cron スケジュール

`vercel.json` で 3 回 / 日 設定済み：

```json
{
  "crons": [
    { "path": "/api/cron/auto-tweet", "schedule": "0 0,4,9 * * *" }
  ]
}
```

| Cron 時刻 (UTC) | JST | スロット | 用途 |
|---|---|---|---|
| 00:00 | 09:00 | 0 (morning) | 新着ブログ[0] or 過去ブログ再紹介 |
| 04:00 | 13:00 | 1 (noon) | 新着ブログ[1] or 放送中作品 |
| 09:00 | 18:00 | 2 (evening) | 新着ブログ[2] or ローテ |

スケジュールを変更したい場合は `vercel.json` の `schedule` を編集してデプロイ。

---

## 6. 手動テスト・デバッグ

エンドポイントに以下のクエリを付けるとデバッグできます:

- `?dry=1` : 実投稿せず生成テキストだけ JSON で返す（プレビュー専用）
- `?slot=0|1|2` : スロットを強制指定（時刻判定をバイパス）

例: 「今、夕方枠で出すならどんな文面？」を見たい時:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://yurithai.jp/api/cron/auto-tweet?slot=2&dry=1"
```

レスポンス例:
```json
{
  "ok": true,
  "today": "2026-06-20",
  "slot": 2,
  "type": "diagnostic",
  "text": "✦ おすすめ診断\n\nタイGL、何から観ればいい？\n\n5 問の質問で…",
  "length": 117,
  "dry": true
}
```

### type の意味

| type | 内容 |
|---|---|
| `new-blog` | 当日付の新着ブログ |
| `throwback-blog` | 14日以上前のブログ再紹介 |
| `drama-airing` | 放送中作品の紹介 |
| `drama-completed` | 完結作品の紹介 |
| `diagnostic` | 診断 (/recommend) のプロモ |

---

## 7. トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| `reason: "X API credentials not set"` | 環境変数未設定 | Vercel に X_API_KEY 等 4 件を登録 → Redeploy |
| `reason: "403 Forbidden"` | App permission が Read only のまま | Read and write に変更 → Access Token を Regenerate |
| `reason: "429 Too Many Requests"` | API 上限到達 | Free プランで月 500 投稿。プラン確認 |
| 投稿されない（cron が動いていない）| Vercel Cron 未有効化 | Pro プランで Cron は有効。Hobby だと制限あり |

---

## 8. 拡張アイデア（必要なら）

- **画像付き投稿**: 記事の cover_image をアップロードしてツイートに添付
- **複数プラットフォーム**: Bluesky / Threads にも同時投稿
- **イベントリマインダー**: events.json をチェックして「明日 X さんのファンミ」とツイート
- **重複防止の永続化**: Vercel KV (Redis) に投稿済み slug を記録

実装の追加が必要なら言ってください。

---

最終更新: 2026-06-19
