import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "YuriThai（ユリタイ）| 日本人のためのタイGLドラマ案内所",
  description:
    "推しの一作を、見つけよう。タイGLドラマのレビュー・配信先・女優情報を日本語でまとめたガイド。",
  metadataBase: new URL("https://yurithai.jp"),
  openGraph: {
    title: "YuriThai（ユリタイ）",
    description: "推しの一作を、見つけよう。",
    url: "https://yurithai.jp",
    siteName: "YuriThai",
    locale: "ja_JP",
    type: "website",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
