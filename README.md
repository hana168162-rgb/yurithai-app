# YuriThai（ユリタイ）

日本人のためのタイGLドラマ情報プラットフォーム。

## セットアップ

### 必要なもの

- Node.js 20+
- npm（または pnpm / yarn）

### 起動

```bash
npm install
npm run dev
```

`http://localhost:3000` でローカル開発サーバーが立ち上がります。

### ビルド

```bash
npm run build
npm run start
```

## ディレクトリ構成

```
yurithai-app/
├── app/                    # Next.js App Router
│   ├── page.tsx            # トップページ
│   ├── dramas/             # ドラマ一覧 + 詳細
│   ├── cast/               # 女優一覧
│   ├── recommend/          # GL診断
│   ├── about/              # サイト情報
│   ├── contact/            # お問い合わせ
│   ├── privacy/            # プライバシーポリシー
│   ├── terms/              # 利用規約
│   └── legal/tokushoho/    # 特商法表記
├── components/             # UIコンポーネント
│   ├── DramaCard.tsx
│   ├── WatchingCard.tsx
│   ├── TagBadge.tsx
│   ├── AgeBadge.tsx
│   ├── StatusBadge.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── content/                # コンテンツデータ（JSON）
│   ├── dramas.json         # 視聴済み20作品
│   ├── watching.json       # 視聴中（放送中）作品
│   ├── companies.json      # 制作会社情報
│   ├── taxonomy.json       # タグ分類体系
│   └── diagnostic/
│       └── questions.json  # GL診断の質問
├── lib/                    # ロジック・型定義
│   ├── types.ts
│   ├── content.ts          # コンテンツローダー
│   ├── diagnostic.ts       # 診断のマッチングロジック
│   └── style.ts            # スタイルユーティリティ
└── public/                 # 静的アセット
```

## カラーパレット（Tailwind トークン）

```
yuri-navy   #3D3470  見出し・ナビ
yuri-rose   #C4708C  CTA・アクセント
yuri-pink   #F5C5D5  カード背景・ホバー
yuri-lilac  #C9B8DD  タグ
yuri-teal   #A5C5D4  情報バッジ
yuri-gold   #D4B589  装飾
yuri-cream  #FAF6EE  ベース背景
yuri-ink    #2A2548  本文
yuri-muted  #6B6585  キャプション
yuri-edge   #E8E2D8  区切り線
```

詳細は `tailwind.config.ts` 参照。

## コンテンツ更新フロー

### 作品データの編集

`content/dramas.json` を直接編集します。各作品のスキーマ：

```typescript
{
  slug: string,            // URL用
  title_ja: string,
  year: number | null,
  production: string | null,
  episodes: number | null,
  status: "completed" | "airing" | "upcoming",
  age_rating: string | null,
  cast_pair: string | null,
  tags: {
    genre: string[],
    relationship: string[],
    tone: string[],
    pacing: string[],
    intimacy: string[],
    production_quality: string[],
    warnings: string[],
  },
  synopsis: string,
  review: {
    highlights: string[],
    recommend_for: string[],
    caution_for: string[],
    body_ja: string,        // レビュー本文
    reviewer: string,
  },
}
```

### GL診断の質問編集

`content/diagnostic/questions.json` を編集。

## 次のステップ

- [ ] レビュー本文 (`review.body_ja`) を各作品に書く
- [ ] 配信先情報（streaming）のデータ追加
- [ ] 画像素材の追加（カバー画像、ロゴ等）
- [ ] お問い合わせフォームの実装（Formspree / Resend）
- [ ] Vercel Analytics または Plausible 導入
- [ ] OGP画像の生成
- [ ] サイトマップ自動生成（next-sitemap）
- [ ] 構造化データ（TVSeries / Review）の埋め込み
- [ ] Vercel へのデプロイ + `yurithai.jp` 紐付け

## デプロイ

Vercel が最も簡単です：

1. GitHub にこのリポジトリを push
2. https://vercel.com で「Import Project」
3. ドメイン設定で `yurithai.jp` を追加
4. お名前.com の DNS 設定で Vercel の指示通りに A/CNAME レコード設定

## ライセンス

未定（運営者個人プロジェクト）
