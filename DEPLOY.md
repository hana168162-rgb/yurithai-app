# YuriThai デプロイ手順書

コマンド不要・GUI のみで `yurithai.jp` に本番公開する手順です。所要時間 30〜60分。

---

## 全体の流れ

```
ローカルフォルダ → GitHub Desktop → GitHub → Vercel → yurithai.jp
```

1. GitHub アカウント作成
2. GitHub Desktop でフォルダをアップロード
3. Vercel アカウント作成 → GitHub と連携
4. プロジェクトをインポート → 自動デプロイ
5. ドメイン `yurithai.jp` を Vercel に紐付け
6. お名前.com で DNS 設定

---

## ステップ1: GitHub アカウント作成（5分）

すでに持っている場合はスキップ。

1. https://github.com にアクセス
2. 「Sign up」→ メールアドレス・パスワード・ユーザー名を設定
3. メール認証を完了
4. **Plan 選択は「Free」**で十分

---

## ステップ2: GitHub Desktop で yurithai-app をアップロード（10分）

### a) GitHub Desktop をインストール

1. https://desktop.github.com からダウンロード（Mac / Windows）
2. インストール後、起動 → GitHubアカウントでログイン

### b) フォルダをリポジトリ化

1. GitHub Desktop の画面上部：「File」→「Add Local Repository」
2. フォルダを選択：`yurithai-app` のフォルダ
3. 「**Create a Repository**」リンクをクリック（Add ではなく Create）
4. 設定：
   - Name: `yurithai` （または `yurithai-app`）
   - Description: `YuriThai - Thai GL information platform`
   - Local Path: 自動入力
   - Git Ignore: `Node` を選択
   - License: 任意（個人プロジェクトなら None でもOK）
5. 「**Create Repository**」をクリック

### c) GitHub に Push（公開）

1. 上部メニューの「**Publish repository**」をクリック
2. 設定：
   - Name: 自動入力
   - **「Keep this code private」のチェックを外す**（無料 Vercel デプロイには Public 必要 ※注）
3. 「**Publish Repository**」をクリック

> **注**: コードを非公開にしたい場合は Vercel Hobby プラン（無料）でも GitHub Pro（月額 $4）アカウントなら Private リポジトリでもデプロイ可能。最初は Public でOK。

完了！ブラウザで `https://github.com/{あなたのアカウント}/yurithai` を開けば、すべてのファイルが見えます。

---

## ステップ3: Vercel アカウント作成（5分）

1. https://vercel.com にアクセス
2. 「**Sign Up**」→ **「Continue with GitHub」**
3. GitHub の認証を許可
4. アカウント名・プラン（**Hobby = 無料**）を選択

---

## ステップ4: プロジェクトをインポート（5分）

1. Vercel ダッシュボードで「**Add New...**」→ 「**Project**」
2. 「Import Git Repository」セクションに、さきほど Publish した `yurithai` リポジトリが表示される
3. 「**Import**」をクリック
4. 設定画面：
   - **Project Name**: `yurithai`（自動入力されたもので可）
   - **Framework Preset**: 自動で「Next.js」と検出される ✓
   - **Root Directory**: そのまま（変更不要）
   - **Build/Output Settings**: 触らない
   - **Environment Variables**: 不要
5. 「**Deploy**」をクリック

ビルドが始まる（2〜3分）。完了すると自動で `yurithai-XXXXX.vercel.app` のような仮URLが発行されます。

クリックして動作確認。

---

## ステップ5: yurithai.jp を紐付け（10分）

### a) Vercel 側の設定

1. プロジェクトの「**Settings**」タブ → 左メニュー「**Domains**」
2. 「**Add Domain**」→ `yurithai.jp` を入力 → 「Add」
3. Vercel が表示する DNS レコード情報をメモ：
   - 例：`A レコード` の値（76.76.21.21 など）または `CNAME` の値

### b) お名前.com 側の DNS 設定

1. お名前.com にログイン
2. 「**ドメイン設定**」→ `yurithai.jp` → 「DNS設定/転送設定」
3. 「**DNSレコード設定を利用する**」→ 「設定する」
4. レコードを追加：

| ホスト名 | TYPE | VALUE |
|---|---|---|
| （空欄）| **A** | `76.76.21.21`（Vercel指定の値）|
| `www` | **CNAME** | `cname.vercel-dns.com` |

5. 「確認画面へ進む」→ 設定完了

> DNS の反映には **5分〜数時間** かかります。

### c) 反映確認

数分待ってから、Vercel の Domains 画面で `yurithai.jp` の横に「Valid Configuration ✓」が出れば完了。

ブラウザで `https://yurithai.jp` にアクセスして表示されればOK！

---

## トラブルシューティング

### ビルドエラーが出た場合

Vercel の「Deployments」タブから失敗したデプロイをクリック → ログを確認。よくあるエラー：

- **`Cannot find module ...`**: 依存パッケージの不足。`package.json` を確認
- **`Type error: ...`**: TypeScript 型エラー。該当ファイル修正後、再 push
- **画像の読み込みエラー**: `public/images/dramas/` 配下のファイル名と `dramas.json` の `cover_image` パスが一致しているか確認

### DNS が反映されない

- 6時間待っても反映されない場合、お名前.com の設定で `ネームサーバー` がデフォルトに戻っているか確認
- VercelのDomain設定の指示通りのレコードか再確認

---

## 更新フロー（公開後）

サイトを更新したいとき：

1. ローカルでファイルを編集（`content/dramas.json` 等）
2. GitHub Desktop を開く
3. 変更が「Changes」タブに表示される
4. Summary を入力（例：「3作品追加」）→ 「Commit to main」
5. 上部「Push origin」をクリック
6. 1〜2分で Vercel が自動再デプロイ → サイトに反映

---

## デプロイ後のチェックリスト

- [ ] `https://yurithai.jp` でトップが表示される
- [ ] `/dramas` で23作品の一覧が表示される
- [ ] `/dramas/airing` で放送中5作品が表示される
- [ ] 任意の作品をクリックして詳細ページが表示される
- [ ] `/recommend` でGL診断クイズが動く
- [ ] 診断完了で結果が表示される
- [ ] `/cast` で女優ペア一覧が表示される
- [ ] フッターの「プライバシーポリシー」「利用規約」「特定商取引法に基づく表記」がリンク切れしない
- [ ] スマホで開いてレスポンシブ動作確認
- [ ] 個人SNSのBioに `yurithai.jp` を追記

---

## 次のステップ（公開後）

1. **計測ツール導入**：Vercel Analytics（Vercel管理画面でクリック1つ）
2. **OGP画像生成**：Twitterシェア時のサムネ画像
3. **サイトマップ生成**：`next-sitemap` パッケージ追加
4. **レビュー本文の追記**：`dramas.json` の `review.body_ja` を順次埋める
5. **SNS告知**：個人アカウントから「サイトオープンしました」投稿

---

質問・不明点があれば、各ステップで止まって相談してください。
