import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "検索（作品・女優・タグ）",
  description:
    "タイGLドラマの作品名・女優名・主演ペア・タグから検索できる横断検索。FreenBecky、LingOrm など主要ペアやジャンルから一発で。",
  alternates: { canonical: "https://yurithai.jp/search" },
  robots: { index: false, follow: true }, // 検索結果ページはインデックス不要
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
