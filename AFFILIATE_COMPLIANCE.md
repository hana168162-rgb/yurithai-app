# アフィリエイト規約 準拠メモ

YuriThai における NordVPN® アフィリエイトの実装は、以下のルールに準拠した形で行っています。
将来の差し替え・追加時の参考にしてください。

---

## 準拠している主なポイント

### 1. 景品表示法（ステマ規制 / 2023年10月施行）対応

- カード右上に「広告」ラベルを常時表示
- ガイドページ冒頭に「広告（PR）を含みます」のブロック
- アフィリエイトカード wide 版に長文の免責文を表示
- ガイドページ末尾にも長文免責文を表示

### 2. Nord Security 商標ガイドライン対応

参考: https://nordsecurity.com/trademark-policy

- **NordVPN®** と初出時に登録商標マーク（®）を表記
- 表示するロゴ・バナー画像はすべて **NordVPN 公式アフィリエイトプログラム提供のクリエイティブ** のみを使用（`/public/affiliate/nordvpn/` 配下）
- 画像の改変・トリミング・色変更・テキスト変更は行わない
- 当サイト独自の商標と Nord Marks を組み合わせない
- 「NordVPN が YuriThai を公認している」と誤認させないよう、商標帰属表記で明示
- 商標帰属文を `lib/affiliate.ts` の `NORD_TRADEMARK_ATTRIBUTION` に集約

### 3. アフィリエイト一般ルール

- すべての外部リンクに `rel="sponsored nofollow noopener noreferrer"`
- 公開不能な「編集部が実際に使ってます」のような検証不能な主観的claimは記載しない
- 機能・条件は NordVPN 公式が公表している一般情報のみ
- 価格・キャンペーン情報は最新確認を促す注意書きを併記
- ガイドページに「規約違反となる可能性」「現地法令の確認義務」を明示
- 海賊版を推奨しない旨を明示

### 4. コンテンツ規約

- 当サイトはタイGLドラマの**作品レビューサイト**であり、ポルノ・賭博・違法行為とは無関係
- LGBT+テーマを扱うが、Nord Security の禁止コンテンツ（defamatory, obscene 等）に該当しない

---

## クリエイティブの差し替え方法

### URL の差し替え

`lib/affiliate.ts` の `NORDVPN_DEFAULT_URL` を編集、または Vercel の環境変数で
`NEXT_PUBLIC_NORDVPN_AFF_URL` を設定（環境変数のほうが優先）。

### バナー画像の追加・差し替え

NordVPN 公式から新しいバナー画像を受け取ったら:

1. `/public/affiliate/nordvpn/` に画像を保存（ファイル名は `lib/affiliate.ts` の `NORDVPN.banners` のキーと一致させる）
2. 新しいバナーを使いたい場合は `NORDVPN.banners` にキーを追加し、設置箇所で `<NordVpnBanner banner="key名" />` を呼ぶ
3. 画像は元データのまま使用すること（改変禁止）

### バナー HTML / iframe を追加する場合

`lib/affiliate.ts` の `NORDVPN.bannerHtml` に NordVPN 公式アフィリエイトダッシュボードで
取得した HTML をそのまま貼ってください。/guide/vpn ページの末尾に「広告」ラベル付きで自動表示されます。

### 文言の差し替え

`lib/affiliate.ts` の `NORDVPN.cardTitle` / `cardSubtitle` / `cta` を編集（フォールバックの NordVpnCard 用）。

---

## 設置箇所

- `/dramas/[slug]` — 各作品詳細「どこで見れる？」セクション直下に公式バナー
  - モバイル: `borderless_300x300`
  - PC: `borderless_728x90`
- `/guide/vpn` — 「VPNとタイGL」ガイドページに3箇所
  - ファーストビュー（NordVPN®紹介セクション直後）: モバイル `borderless_300x300` / PC `borderless_1200x630`
  - 中段（注意点とFAQの間）: モバイル `borderless_300x300` / PC `cybersec_1500x180`
  - 最終CTA（末尾）: モバイル `borderless_300x300` / PC `borderless_1500x180`

ガイドページはサイトマップにも追加済み。
