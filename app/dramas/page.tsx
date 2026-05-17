import { dramas } from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";

export const metadata = {
  title: "ドラマ一覧 | YuriThai",
};

export default function DramasPage() {
  // Sort by year descending, status (airing first), then title
  const sorted = [...dramas].sort((a, b) => {
    if (a.status === "airing" && b.status !== "airing") return -1;
    if (b.status === "airing" && a.status !== "airing") return 1;
    return (b.year ?? 0) - (a.year ?? 0);
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          ドラマ一覧
        </h1>
        <p className="text-sm text-yuri-muted">全{sorted.length}作品</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {sorted.map((d) => (
          <DramaCard key={d.slug} drama={d} />
        ))}
      </div>
    </div>
  );
}
