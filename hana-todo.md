# Hana 対応タスクまとめ

私（Claude）の作業で完結できないHana側の対応事項を整理。

---

## 🔴 即時対応（デプロイ直前・直後）

### 1. GitHub Desktop でコミット・Push
- これまでの大量の変更を Vercel にデプロイ
- 詳細手順は前回の最終コミット案内を参照
- コミットメッセージ案も既に提示済み

### 2. デプロイ後の検証
- https://yurithai.jp/sitemap.xml が生成されるか確認
- https://yurithai.jp/robots.txt が生成されるか確認
- 任意の作品ページで OGP・JSON-LDを確認
  - https://search.google.com/test/rich-results に作品URL入力

### 3. Google Search Console にサイトマップ登録
- https://search.google.com/search-console にアクセス
- yurithai.jp プロパティ選択（未登録なら所有権確認から）
- 左メニュー「サイトマップ」→ `sitemap.xml` を送信
- 数日でクロール開始

---

## 🟡 中期対応（コンテンツ・運用）

### 4. OGデフォルト画像の作成・配置
- `/public/og-default.png`（1200×630px）
- 現在 layout.tsx で参照しているが画像未配置
- 内容案: YuriThai ロゴ + 「日本人のためのタイGLドラマ案内所」キャッチコピー

### 5. アフィリエイトリンク取得・差し替え
配信先URLを公式トップから個別作品ページのアフィリエイトリンクに差し替える:
- Netflix（個別作品リンクに対応）
- TELASA（auコマース＆ライフ系アフィリエイト）
- iQIYI（アフィリエイト要確認）
- RakutenTV（楽天アフィリエイト）
- YouTube は変更なし（個別1話URL）

→ 各プラットフォームで提携完了後、`scripts/apply_platform_homes.py` 風スクリプトでURL一括差し替え可能

### 6. 公開予定11作品の配信先決定後の追記
配信が決まったタイミングで `streaming-corrections.md` に追記:
- The Fire / Bake Love Feeling / Her / Ditto / Lunar Secret
- Beauty & The Bike / Dangerous Love / Trial Love
- Moonshadow / Wish upon a star / Love's Echoes

### 7. 画像追加
- 公開予定作品のサムネ未配置のもの（特に Dangerous Love / Trial Love が cover_image: null）
- イベント発表・新作発表時のキービジュアル追加

---

## 🟢 任意対応（情報拡充）

### 8. 女優情報の補完
thaiglhub.com に詳細プロフィールが追加された時に補完したい女優:

**身長が null（10人ほど）**
- Tan / Bam / Mim (AppleMimu) / Tangkwa / Nur / Jan / Pitcha
- View / Mim-R （ViewMim）/ Mewnich / Pahn

**全項目 null（thaiglhub未掲載）**
- Enya（Love beyond Dreams）
- Miphat（Love beyond Dreams）
- Renee（Beauty & The Bike）
- Mew（Beauty & The Bike）

→ 公式プロフィールやIGから情報拾った時に追記。最小情報でも検索流入には貢献。

### 9. レビュー本文（body_ja）の充実
全23作品中、`review.body_ja` が空欄。1作品 200〜300字書くと:
- 「GAP 感想」「Pluto レビュー」等のロングテール検索流入が見込める
- AI下書き → 人手修正の運用も可能（要相談）

### 10. ブログ機能の追加検討
- `/blog/[slug]` でロングテール流入を狙う
- 「タイGL入門」「FreenBecky歴史」「事務所別おすすめ」など
- 専用CMSは不要、Markdownファイルで運用可能

---

## 🔵 残タスク（私が対応するもの）

| # | 内容 | 状態 |
|---|------|------|
| #49 | 放送中→完結 自動移動 | pending（end_date方式で実装可） |
| #50 | イベントカレンダー（事務所/ペア絞り込み） | pending |
| **Phase 2** | 女優個別ページ /cast/[id] | これから着手 |
| Phase 3 | タグ別ページ /tags/[tag] | Phase 2 完了後 |
| Phase 4 | レビュー本文 + ブログ | コンテンツ運用と並走 |
