import { dramas, getRecentlyEndedWatching } from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import { WatchingCard } from "@/components/WatchingCard";
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
  // end_date を過ぎた watching 作品も「完結」一覧に含める
  const recentlyEnded = getRecentlyEndedWatching().sort((a, b) =>
    (b.end_date ?? "").localeCompare(a.end_date ?? "")
  );
  const total = sorted.length + recentlyEnded.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          完結作品
        </h1>
        <p className="text-sm text-yuri-muted">全{total}作品</p>
      </header>

      <DramaListNav current="completed" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {/* 最近完結した放送中作品（end_date 過ぎたもの）を先頭に */}
        {recentlyEnded.map((d) => (
          <WatchingCard
            key={d.slug}
            drama={d}
            cover={d.cover_image}
            statusOverride="completed"
          />
        ))}
        {sorted.map((d) => (
          <DramaCard key={d.slug} drama={d} />
        ))}
      </div>
    </div>
  );
}
