import { upcoming } from "@/lib/content";
import { UpcomingCard } from "@/components/UpcomingCard";
import { DramaListNav } from "@/components/DramaListNav";

export const metadata = {
  title: "今後の公開予定 | YuriThai",
};

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          今後公開予定
        </h1>
        <p className="text-sm text-yuri-muted">
          全{upcoming.length}作品 · 公開が発表されているタイGL
        </p>
      </header>

      <DramaListNav current="upcoming" />

      {upcoming.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          まだ追加情報がありません
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {upcoming.map((d) => (
            <UpcomingCard key={d.slug} drama={d} />
          ))}
        </div>
      )}
    </div>
  );
}
