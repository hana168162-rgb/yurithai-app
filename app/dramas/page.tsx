import { dramas } from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import { DramaListNav } from "@/components/DramaListNav";

export const metadata = {
  title: "完結作品一覧 | YuriThai",
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
