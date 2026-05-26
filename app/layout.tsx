import "./globals.css";
import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Noto_Sans_JP,
  Quicksand,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { CampaignBanner } from "@/components/CampaignBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { JsonLd, buildWebSiteJsonLd } from "@/components/JsonLd";
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

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: false, // 日本語フォントは重いので preload は false
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-quicksand",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "YuriThai・タイGLドラマ",
    template: "%s | YuriThai",
  },
  description:
    "推しの一作を、見つけよう。タイGLドラマのレビュー・配信先・女優情報・診断機能を日本語でまとめたガイド。完結作品23本、放送中6本、公開予定12本以上を網羅。",
  keywords: [
    "タイGL",
    "タイドラマ",
    "百合",
    "Girls Love",
    "YuriThai",
    "ユリタイ",
    "ゆりたい",
    "GAP",
    "Pluto",
    "FreenBecky",
    "LingOrm",
    "GMMTV",
    "Idol Factory",
  ],
  authors: [{ name: "YuriThai" }],
  metadataBase: new URL("https://yurithai.jp"),
  alternates: { canonical: "https://yurithai.jp" },
  openGraph: {
    title: "YuriThai・タイGLドラマ",
    description:
      "推しの一作を、見つけよう。タイGLドラマのレビュー・配信先・女優情報を日本語でまとめたガイド。",
    url: "https://yurithai.jp",
    siteName: "YuriThai",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "YuriThai・タイGLドラマ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YuriThai・タイGLドラマ",
    description: "推しの一作を、見つけよう。",
    images: ["/og-default.png"],
  },
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
      className={`${plusJakarta.variable} ${notoSansJp.variable} ${quicksand.variable}`}
    >
      <head>
        {/* AdSenseクローラが <head> に直接設置された <script> を期待するため、
            ここで生のscriptタグを出力する（Next.jsの<Script>ラッパーは使わない）。 */}
        <GoogleAdSense />
      </head>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={buildWebSiteJsonLd()} />
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

