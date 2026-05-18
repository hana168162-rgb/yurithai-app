# Google Search Console セットアップガイド

このガイドに沿って進めれば、YuriThai を Google Search Console に登録し、
検索パフォーマンスの計測・インデックスの確認・サイトマップの送信ができるようになります。
所要時間: **約30分**（DNS確認方式の場合のみ、DNS反映待ちで最大24h）

---

## なぜ必要か

| 項目 | 内容 |
|---|---|
| **検索順位の計測** | 「タイGL」「タイGL おすすめ」等のキーワードでの表示順位・クリック率を確認 |
| **インデックス状況** | Googleがどのページをインデックスしているか確認、漏れがあれば再申請 |
| **サイトマップ送信** | 約170ページの存在を一括でGoogleに通知し、クロールを早める |
| **エラー検出** | 404・サーバーエラー・モバイル対応問題などを通知してもらえる |
| **検索結果の見え方** | パンくず・FAQ・サイトリンクなどリッチリザルトが正しく表示されるか確認 |

---

## 手順1: Google Search Console アカウント作成

1. [https://search.google.com/search-console](https://search.google.com/search-console) にアクセス
2. Google アカウントでログイン（普段使いのアカウントで可）
3. 初めての方は「今すぐ開始」をクリック

---

## 手順2: プロパティを追加（推奨：ドメインプロパティ）

「プロパティを追加」画面で、左側の **「ドメイン」** を選択。

入力欄に: `yurithai.jp`

> ❗ 「URLプレフィックス」ではなく「ドメイン」を強く推奨します。
> ドメインプロパティだとhttp/https/www有無/サブドメインを全部まとめて計測できます。

---

## 手順3: ドメインの所有権確認

ドメインプロパティを選ぶと「**DNSレコードを追加して確認**」と案内されます。

### 方法A: お名前.com / ムームードメイン等で取得した場合

1. Search Console画面に表示された **TXTレコード**（`google-site-verification=...` の文字列）をコピー
2. ドメイン管理画面（お名前.com、ムームードメイン、Cloudflare等）にログイン
3. DNSレコード設定で以下を追加:
   - **タイプ**: TXT
   - **ホスト名 / 名前**: `@`（または空欄、ドメインルート）
   - **値**: コピーした `google-site-verification=...` 文字列
   - **TTL**: 3600（デフォルトでOK）
4. 保存して、DNS反映を待つ（通常5-15分、最大24h）
5. Search Console に戻って「確認」をクリック

### 方法B: Vercelでドメイン管理している場合

Vercelダッシュボード → Domains → yurithai.jp → DNS Records → Add Record:
- Type: TXT
- Name: `@`
- Value: `google-site-verification=...`（Search Consoleからコピー）
- TTL: 60（短くて早い）

保存後、Search Console で「確認」をクリック。

---

## 手順3-Alt: HTMLメタタグ方式（より簡単）

「URLプレフィックスプロパティ」を使う場合は、HTMLメタタグでの確認も可能です:

1. Search Consoleで「URLプレフィックス」を選び、`https://yurithai.jp` を入力
2. 確認方法から **「HTMLタグ」** を選択
3. 表示される `<meta name="google-site-verification" content="ABC123..." />` の **content の値** だけをコピー
4. Vercel ダッシュボード → Settings → Environment Variables で:
   - Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Value: コピーした文字列（`ABC123...` の部分のみ）
   - Environments: Production
5. Save → Redeploy（or 次のpushで自動反映）
6. Search Console画面で「確認」をクリック

> ✅ コード側は対応済み。環境変数を設定するだけで `<head>` に自動挿入されます。

---

## 手順4: サイトマップを送信

所有権確認が完了したら、左メニューから **「サイトマップ」** を選択:

1. 「新しいサイトマップの追加」欄に: `sitemap.xml`
2. 「送信」をクリック

数分〜数時間で「成功しました」と表示され、URLの検出が始まります。
（YuriThai のサイトマップは約170ページ含む大規模なものです）

---

## 手順5: 主要ページのインデックス申請

特に重要なページは個別にインデックス申請すると、クロールが早まります。

左メニュー「URL検査」→ 検査したいURLを入力 → 「インデックス登録をリクエスト」

優先して申請したいページ:
- `https://yurithai.jp/`
- `https://yurithai.jp/guide/what-is-thai-gl`
- `https://yurithai.jp/blog/thai-gl-ranking-2026`
- `https://yurithai.jp/dramas`
- `https://yurithai.jp/recommend`
- `https://yurithai.jp/guide/vpn`
- 各人気作品の詳細ページ（GAP、Pluto、The Loyal Pin等）

> ⚠️ 1日あたり10件程度の上限あり。優先度の高いページから順に申請。

---

## 手順6: Bing Webmaster Tools にも登録（推奨）

国内シェアは少ないですが、Edge ブラウザ・ChatGPT検索などで使われるため有効。

1. [https://www.bing.com/webmasters](https://www.bing.com/webmasters) にアクセス
2. Microsoftアカウントでログイン
3. **「Google Search Consoleからインポート」** を選択するのが最速（30秒で完了）
4. 個別に登録したい場合は、Vercel環境変数で `NEXT_PUBLIC_BING_SITE_VERIFICATION` を設定すれば
   コード側は自動でメタタグを出力する形にすでに対応済み

---

## 手順7: 検証

サイトマップ送信から **1〜3日後**、以下のメニューで状況を確認できます:

| メニュー | 確認内容 |
|---|---|
| 検索パフォーマンス | クリック数・表示回数・CTR・平均掲載順位 |
| ページ - インデックス登録 | インデックス済みページ数（170ページが目安に近づく） |
| 拡張機能 | パンくず / FAQ / サイトリンクのリッチリザルト出現確認 |
| Core Web Vitals | LCP / FID / CLS の実測値 |

---

## SEO観察ポイント（中長期）

| 期間 | 確認すること |
|---|---|
| 1週間 | インデックス開始、表示回数増加開始 |
| 1ヶ月 | 「タイGL おすすめ」等のロングテールキーワードで表示回数 |
| 3ヶ月 | 主要キーワードの平均掲載順位、「タイGL」での掲載順位 |
| 6ヶ月 | 「タイGL」TOP10内が現実的な目標。TOP5以内ならかなり健闘 |

---

## トラブルシューティング

### Q. DNS確認が「確認できませんでした」になる
DNS反映に時間がかかる場合があります。最大24時間待ってから再試行。
それでも確認できない場合は、HTMLタグ方式（手順3-Alt）に切り替え。

### Q. 環境変数を設定したのにメタタグが出ない
Vercelの再デプロイが必要です。`Redeploy` を選ぶか、空コミットをpushします:
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

### Q. サイトマップが「取得できません」エラー
`https://yurithai.jp/sitemap.xml` をブラウザで開いて確認。
取得できない場合はビルドエラーの可能性、Vercelログを確認。

### Q. 「タイGL」で表示されない
新規ドメインでは数週間〜数か月かかります。並行して:
- 内部リンクを増やす
- ブログを定期的に更新
- 外部リンク（被リンク）を獲得する努力

---

## 環境変数まとめ

Vercel の Settings → Environment Variables で設定:

| 変数名 | 用途 | 値の取り方 |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console所有権確認（HTML方式） | Search Console → 確認方法 → HTMLタグの content 部分 |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster所有権確認 | Bing Webmaster → 所有権の確認 → メタタグ |

設定後は Production にチェックを入れて Save、Redeploy で反映。
