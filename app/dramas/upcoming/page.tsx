import Link from "next/link";
import { upcoming } from "@/lib/content";
import { UpcomingCard } from "@/components/UpcomingCard";

export const metadata = {
  title: "今後の公開予定 | YuriThai",
};

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="text-xs text-yuri-muted mb-3">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/dramas" className="hover:text-yuri-rose">
          ドラマ
        </Link>
        <span className="mx-1.5">/</span>
        <span>今後公開予定</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          今後公開予定
        </h1>
        <p className="text-sm text-yuri-muted">
          全{upcoming.length}作品 · 公開が発表されているタイGL
        </p>
      </header>

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

      <div className="mt-12 text-center space-x-3">
        <Link
          href="/dramas/airing"
          className="inline-block bg-yuri-cream border border-yuri-edge text-yuri-ink px-5 py-2.5 rounded-full text-sm hover:border-yuri-rose"
        >
          放送中を見る →
        </Link>
        <Link
          href="/dramas"
          className="inline-block bg-yuri-cream border border-yuri-edge text-yuri-ink px-5 py-2.5 rounded-full text-sm hover:border-yuri-rose"
        >
          完結作品を見る →
        </Link>
      </div>
    </div>
  );
}
