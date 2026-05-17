import { watching } from "@/lib/content";
import { WatchingCard } from "@/components/WatchingCard";
import { DramaListNav } from "@/components/DramaListNav";

export const metadata = {
  title: "放送中の作品 | YuriThai",
};

export default function AiringPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          放送中の作品
        </h1>
        <p className="text-sm text-yuri-muted">
          全{watching.length}作品 · 現在放送中・配信中のタイGL
        </p>
      </header>

      <DramaListNav current="airing" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {watching.map((d) => (
          <WatchingCard key={d.slug} drama={d} cover={d.cover_image} />
        ))}
      </div>
    </div>
  );
}
