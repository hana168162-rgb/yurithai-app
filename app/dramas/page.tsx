import {
  dramas,
  actresses,
  getRecentlyEndedWatching,
} from "@/lib/content";
import { DramaListNav } from "@/components/DramaListNav";
import { DramaFilterBar } from "@/components/DramaFilterBar";

// end_date を過ぎた作品を自動で完結一覧に流し込むため、1時間ごとに再生成
export const revalidate = 3600;

export const metadata = {
  title: "タイGLドラマ完結作品一覧｜23作品の配信先・レビュー",
  description:
    "完結したタイGLドラマを一覧で網羅。GAP / The Loyal Pin / Pluto / 23.5 / The Secret of Us / Affair / Mate / Love Design / Harmony Secret / My Safe Zone など23作品の作品情報・配信先・レビュー・出演ペアを日本語で。タイGL初心者から既存ファンまで使えるタイ百合ドラマのリファレンス。",
  keywords: [
    "タイGL",
    "タイGLドラマ",
    "タイGL 一覧",
    "タイGL 完結",
    "タイ百合",
    "タイ百合ドラマ",
    "GAP",
    "Pluto",
    "23.5",
    "The Loyal Pin",
    "Affair",
    "YuriThai",
    "ユリタイ",
  ],
  alternates: { canonical: "https://yurithai.jp/dramas" },
  openGraph: {
    title:
      "タイGLドラマ完結作品一覧 ｜ YuriThai（ユリタイ）",
    url: "https://yurithai.jp/dramas",
    type: "website",
    siteName: "YuriThai（ユリタイ）",
  },
};

export default function DramasPage() {
  const sorted = [...dramas].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  // end_date を過ぎた watching 作品も「完結」一覧に含める
  const recentlyEnded = getRecentlyEndedWatching().sort((a, b) =>
    (b.end_date ?? "").localeCompare(a.end_date ?? "")
  );

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          タイGLドラマ完結作品
        </h1>
        <p className="text-sm text-yuri-muted mt-1">
          タイで制作された百合ドラマの完結作品23本を一覧で
        </p>
      </header>

      <DramaListNav current="completed" />

      <DramaFilterBar
        dramas={sorted}
        actresses={actresses}
        cardType="drama"
        recentlyEnded={recentlyEnded}
      />
    </div>
  );
}
