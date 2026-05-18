import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { CampaignBanner } from "@/components/CampaignBanner";
import { Footer } from "@/components/Footer";
import { JsonLd, buildWebSiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "YuriThai（ユリタイ）| 日本人のためのタイGLドラマ案内所",
    template: "%s | YuriThai",
  },
  description:
    "推しの一作を、見つけよう。タイGLドラマのレビュー・配信先・女優情報・診断機能を日本語でまとめたガイド。完結作品23本、放送中6本、公開予定12本以上を網羅。",
  keywords: [
    "タイGL",
    "タイドラマ",
    "百合",
    "Girls Love",
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
    title: "YuriThai（ユリタイ）| 日本人のためのタイGLドラマ案内所",
    description:
      "推しの一作を、見つけよう。タイGLドラマのレビュー・配信先・女優情報を日本語でまとめたガイド。",
    url: "https://yurithai.jp",
    siteName: "YuriThai",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "YuriThai（ユリタイ）| 日本人のためのタイGLドラマ案内所",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YuriThai（ユリタイ）",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <JsonLd data={buildWebSiteJsonLd()} />
        <Header />
        <CampaignBanner />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

