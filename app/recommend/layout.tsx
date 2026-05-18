import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GL診断（あなたに合うタイGLを見つけよう）",
  description:
    "簡単な質問に答えるだけで、あなたの好みに合うタイGLドラマを診断。ジャンル・トーン・関係性・描写の濃さなどから最適な1本をレコメンド。",
  alternates: { canonical: "https://yurithai.jp/recommend" },
  openGraph: {
    title: "GL診断（あなたに合うタイGLを見つけよう）| YuriThai",
    description:
      "簡単な質問に答えるだけで、あなたの好みに合うタイGLドラマを診断。",
    url: "https://yurithai.jp/recommend",
    type: "website",
  },
};

export default function RecommendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
