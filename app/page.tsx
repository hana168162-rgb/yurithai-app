import Link from "next/link";
import {
  getCurrentPickup,
  getFeaturedCompletedDramas,
  upcoming,
} from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import { WatchingCard } from "@/components/WatchingCard";
import { UpcomingCard } from "@/components/UpcomingCard";

export default function HomePage() {
  const pickup = getCurrentPickup();
  const featured = getFeaturedCompletedDramas(6);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="text-yuri-gold mb-2 text-sm">✦  ✦  ✦</div>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-yuri-ink mb-8">
          推しの一作を、見つけよう。
        </h1>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 bg-yuri-navy text-yuri-cream px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
        >
          <span>✦</span>
          おすすめを診断する
          <span>→</span>
        </Link>
      </section>

      {/* 今月のピックアップ */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-base font-medium text-yuri-navy">
              今月のピックアップ
            </h2>
            <p className="text-xs text-yuri-muted">現在放送中の話題作</p>
          </div>
          <Link
            href="/dramas/airing"
            className="text-xs text-yuri-rose"
          >
            放送中をすべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pickup.map((d, i) => (
            <div key={d.slug} className={i === 3 ? "md:hidden" : ""}>
              <WatchingCard drama={d} cover={d.cover_image} />
            </div>
          ))}
        </div>
      </section>

      {/* 作品一覧 */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-base font-medium text-yuri-navy">作品一覧</h2>
            <p className="text-xs text-yuri-muted">完結作品から探す</p>
          </div>
          <Link href="/dramas" className="text-xs text-yuri-rose">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {featured.map((d) => (
            <DramaCard key={d.slug} drama={d} />
          ))}
        </div>
      </section>

      {/* 今後公開予定 */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="text-base font-medium text-yuri-navy">
                今後公開予定
              </h2>
              <p className="text-xs text-yuri-muted">
                公開が発表されている作品
              </p>
            </div>
            <Link
              href="/dramas/upcoming"
              className="text-xs text-yuri-rose"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {upcoming.slice(0, 4).map((d, i) => (
              <div key={d.slug} className={i === 3 ? "md:hidden" : ""}>
                <UpcomingCard drama={d} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
