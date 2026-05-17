import Link from "next/link";
import { watching } from "@/lib/content";
import { WatchingCard } from "@/components/WatchingCard";

export const metadata = {
  title: "放送中の作品 | YuriThai",
};

export default function AiringPage() {
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
        <span>放送中</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          放送中の作品
        </h1>
        <p className="text-sm text-yuri-muted">
          全{watching.length}作品 · 現在放送中・配信中のタイGL
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {watching.map((d) => (
          <WatchingCard key={d.slug} drama={d} cover={d.cover_image} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/dramas"
          className="inline-block bg-yuri-cream border border-yuri-edge text-yuri-ink px-5 py-2.5 rounded-full text-sm hover:border-yuri-rose"
        >
          完結作品も見る →
        </Link>
      </div>
    </div>
  );
}
