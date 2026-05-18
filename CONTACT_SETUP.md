# お問い合わせフォームの設定

`/contact` から送信された内容は、サーバー側 API ルート `/app/api/contact/route.ts` で受け取り、
**環境変数で指定された外部サービス**に転送されます。
データはそのサービス側のダッシュボードに溜まっていく仕組みです。

ローカルでは何も設定しなくても動きますが、本番（Vercel）では下記いずれかを必ず設定してください。

---

## 推奨: Formspree（無料枠あり）

1. https://formspree.io にアクセスしてアカウント作成（GitHub ログイン可）
2. New Form → Form Name に `YuriThai Contact` などを入力
3. 通知を受け取りたいメールアドレスを設定
4. 発行された endpoint URL（`https://formspree.io/f/xxxxxxxx` の形）をコピー
5. **Vercel ダッシュボード** → プロジェクト → Settings → Environment Variables
   - Name: `FORMSPREE_ENDPOINT`
   - Value: コピーした URL
   - Environments: Production にチェック
6. Redeploy（または次の push で自動反映）

無料枠: 月50件まで。超えそうな場合はプランアップグレード or 他サービスへ。

ダッシュボードでお問い合わせ一覧の確認・CSV/Excel エクスポートが可能です。

---

## 代替1: Web3Forms（無料、月250件）

1. https://web3forms.com で受信メールアドレスを登録 → access key が発行される
2. Vercel に環境変数を設定
   - Name: `WEB3FORMS_ACCESS_KEY`
   - Value: 発行された access key

メールでの通知中心。一覧管理は弱め。

---

## 代替2: 任意の webhook

Slack/Discord webhook、Make/Zapier、独自バックエンド等に POST したい場合:

- Name: `CONTACT_WEBHOOK_URL`
- Value: POST 先 URL

POST されるボディ:

```json
{
  "topic": "sponsor",
  "topicLabel": "スポンサー・タイアップ",
  "name": "山田 花子",
  "email": "...",
  "phone": "...",
  "company": "...",
  "body": "...",
  "submittedAt": "2026-05-18T12:34:56.789Z",
  "source": "yurithai.jp / contact"
}
```

---

## 優先順位

`FORMSPREE_ENDPOINT` → `WEB3FORMS_ACCESS_KEY` → `CONTACT_WEBHOOK_URL` の順で
最初に見つかった転送先のみが使われます。複数設定しても問題ありません（上位だけ使われます）。

何も設定されていない状態で送信があると、Production ではフォームが
503 を返してユーザーに「準備中」と表示します。
