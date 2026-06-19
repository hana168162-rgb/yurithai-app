# X (Twitter) 自動投稿 セットアップガイド

YuriThai は **毎日のブログ記事を自動で X に投稿する機能**を備えています。
本ドキュメントは、初回設定（API キー取得 + Vercel 環境変数登録）の手順をまとめたものです。

---

## 1. アーキテクチャ

```
content/blog/*.md (新規記事 commit)
       ↓
   Vercel デプロイ
       ↓
[Vercel Cron Jobs] (毎日 09:00 / 18:00 JST)
       ↓
GET /api/cron/auto-tweet
       ↓
1. getAllBlogPosts() で全記事取得
2. 「今日 (JST)」の日付の記事を抽出
3. 各記事を X に投稿
   - 「📖 新着記事」or「🗓 デイリー速報」プレフィックス
   - description（自動省略・280字以内）
   - URL（t.co 短縮で 23 文字計算）
   - #タイGL + タグから最大 3 つ
4. 結果を JSON で返す
```

- **投稿日 = `date` フィールド（JST 当日）が一致するときだけ投稿**するので、
  古い記事や未来日の予約記事は無視されます。
- **1 回の実行で最大 5 件**まで（連投防止の安全装置）。
- **Vercel Cron は 1 日 2 回** スケジュール済み（09:00 JST と 18:00 JST）。
  Manus の自動更新が朝に走るパターンと、夕方の追加記事の両方に対応。

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

`vercel.json` で 2 回 / 日 設定済み：

```json
{
  "crons": [
    { "path": "/api/cron/auto-tweet", "schedule": "0 0,9 * * *" }
  ]
}
```

| Cron 時刻 (UTC) | JST | 想定用途 |
|---|---|---|
| 00:00 | 09:00 | Manus デイリー速報の自動投稿（朝） |
| 09:00 | 18:00 | 編集者が午後に書いた記事の自動投稿（夕方） |

スケジュールを変更したい場合は `vercel.json` の `schedule` を編集してデプロイ。

---

## 6. 投稿テキストの仕様

`lib/twitter.ts` の `buildTweetText()` で生成されます。

### 通常記事の例

```
📖 新着記事 タイGL × オフィス職場ロマンス完全ガイド — GAP から Hak Na My Boss まで、上司×部下構造の系譜

タイGL における職場ロマンス／オフィスもの作品を横断整理。GAP（2022）が確立した『社長×部下』のテンプレートから、Affair の屋敷内ヒエラルキー、Whale Store xoxo の食料品店、そして Hak Na My Boss の輸出入会社まで…

https://yurithai.jp/blog/thai-gl-office-romance-guide

#タイGL #タイGL #オフィスロマンス #職場恋愛 #GAP
```

### Manus デイリー速報の例

```
🗓 デイリー速報 【本日更新】タイGL最新公式情報まとめ（2026年6月19日）

In Love Forever本日プレミア、BBFanFest2026ハイライト、GMMTV Outing 2026、NorthStar最新情報など今週のGL情報を総まとめ。

https://yurithai.jp/blog/2026-06-19-daily-update

#タイGL #Instagram #最新情報 #InLoveForever
```

- **プレフィックス絵文字**：`sns-update` カテゴリは 🗓、それ以外は 📖
- **タイトル**：そのまま
- **説明文**：280 字に収まるよう自動省略
- **URL**：`https://yurithai.jp/blog/{slug}` 固定
- **ハッシュタグ**：`#タイGL` 固定 + 記事の `tags[]` から先頭3つ

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
