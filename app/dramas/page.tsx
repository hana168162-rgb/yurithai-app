import { dramas } from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import { DramaListNav } from "@/components/DramaListNav";

export const metadata = {
  title: "完結作品一覧（タイGLドラマ）",
  description:
    "完結したタイGLドラマを一覧で。GAP / The Loyal Pin / Pluto / 23.5 / The Secret of Us / Affair / Mate / Love Design / Harmony Secret / My Safe Zone など23作品の作品情報・配信先・レビュー・出演ペアを日本語で。",
  alternates: { canonical: "https://yurithai.jp/dramas" },
  openGraph: {
    title: "完結作品一覧（タイGLドラマ） | YuriThai",
    url: "https://yurithai.jp/dramas",
    type: "website",
  },
};

export default function DramasPage() {
  const sorted = [...dramas].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          完結作品
        </h1>
        <p className="text-sm text-yuri-muted">全{sorted.length}作品</p>
      </header>

      <DramaListNav current="completed" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {sorted.map((d) => (
          <DramaCard key={d.slug} drama={d} />
        ))}
      </div>
    </div>
  );
}
