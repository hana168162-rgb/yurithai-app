import "./globals.css";
import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Zen_Maru_Gothic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { CampaignBanner } from "@/components/CampaignBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import {
  JsonLd,
  buildWebSiteJsonLd,
  buildOrganizationJsonLd,
} from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleAdSense } from "@/components/GoogleAdSense";

// next/font: ビルド時にフォントをセルフホストし、CSS変数で配信する。
// この方式だと「ブラウザがGoogle Fontsを取りに行くときのレイアウト崩れ（CLS）」を解消できる。
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plus-jakarta",
  preload: true,
});

// UI まわり（カード、ナビ、メタ情報など）の日本語標準ゴシック
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: false, // 日本語フォントは重いので preload は false
});

// ブログ本文用の明朝体（長文の可読性に優れた、上品な印象の日本語フォント）
const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-serif-jp",
  preload: false,
});

// 見出し用の丸ゴシック（やわらかく、現代の日本のブログ・雑誌で人気のスタイル）
const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-zen-maru-gothic",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    // 「YuriThai（ユリタイ）」を title 内に明示してブランド検索の取りこぼしを防ぐ。
    // template は子ページのタイトル + サイト名で完結する形に。
    default: "YuriThai（ユリタイ）｜タイGL（タイ百合ドラマ）情報サイト",
    template: "%s ｜ YuriThai（ユリタイ）",
  },
  description:
    "YuriThai（ユリタイ）は、タイGL（タイ百合ドラマ）を日本語でまとめた情報サイト。タイGLの作品レビュー・配信先・女優プロフィール・ペア解説・おすすめ診断・聖地巡礼・ファンミ情報まで網羅。完結作品23本、放送中6本、公開予定12本以上、ブログ75本超を掲載中。",
  keywords: [
    // 主要キーワード（ブランド + 一般語）
    "YuriThai",
    "ユリタイ",
    "ゆりたい",
    "タイGL",
    "タイ GL",
    "タイ百合",
    "タイ百合ドラマ",
    "タイGL ドラマ",
    "タイGL おすすめ",
    "タイGL 一覧",
    "タイGL 配信",
    "タイGL ランキング",
    "タイGL とは",
    "GL ドラマ",
    "百合",
    "Girls Love",
    "Thai GL",
    // ペア・スタジオ（指名検索からの流入）
    "GAP",
    "Pluto",
    "23.5",
    "The Loyal Pin",
    "FreenBecky",
    "LingOrm",
    "NamtanFilm",
    "MilkLove",
    "LMSY",
    "GMMTV",
    "IDOLFACTORY",
    "Idol Factory",
    "CHANGE2561",
  ],
  authors: [{ name: "YuriThai（ユリタイ）" }],
  creator: "YuriThai（ユリタイ）",
  publisher: "YuriThai（ユリタイ）",
  metadataBase: new URL("https://yurithai.jp"),
  alternates: { canonical: "https://yurithai.jp" },
  openGraph: {
    title: "YuriThai（ユリタイ）｜タイGL（タイ百合ドラマ）情報サイト",
    description:
      "YuriThai（ユリタイ）は、タイGL（タイ百合ドラマ）を日本語でまとめた情報サイト。作品・配信先・女優・ペア・診断・聖地巡礼まで。",
    url: "https://yurithai.jp",
    siteName: "YuriThai（ユリタイ）",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "YuriThai（ユリタイ）｜タイGL情報サイト",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YuriThai（ユリタイ）｜タイGL情報サイト",
    description:
      "タイGL（タイ百合ドラマ）を日本語で。作品・配信先・女優・ペア・診断まで。",
    images: ["/og-default.png"],
  },
  // カテゴリヒント（Google等の補助用）
  category: "Entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Search Console / Bing 等のサイト所有権確認用 meta タグ
  // Vercel の環境変数で設定する（コード変更なしで切り替え可能）
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${plusJakarta.variable} ${notoSansJp.variable} ${notoSerifJp.variable} ${zenMaruGothic.variable}`}
    >
      <head>
        {/* AdSenseクローラが <head> に直接設置された <script> を期待するため、
            ここで生のscriptタグを出力する（Next.jsの<Script>ラッパーは使わない）。 */}
        <GoogleAdSense />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* サイト全体: WebSite + Organization の構造化データを常時埋め込み、
            「YuriThai」「ユリタイ」「ゆりたい」の表記ゆれを統一エンティティに集約する。 */}
        <JsonLd data={buildWebSiteJsonLd()} />
        <JsonLd data={buildOrganizationJsonLd()} />
        <Header />
        <CampaignBanner />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}

