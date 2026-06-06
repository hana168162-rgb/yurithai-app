"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * モバイル専用の下部固定ナビバー（md未満で表示）。
 * 75%がモバイル閲覧のため、「ホーム / ドラマ / 診断 / 検索」へ常時タップできる
 * 導線を画面下に固定し、回遊性を上げて離脱を防ぐ。
 * - 診断（おすすめ）はサイトの主要アクションなので中央でローズ強調。
 * - iPhoneのホームインジケータに被らないよう safe-area の余白を確保。
 */

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function FilmIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

const ITEMS = [
  { href: "/", label: "ホーム", match: (p: string) => p === "/", icon: HomeIcon },
  { href: "/dramas", label: "ドラマ", match: (p: string) => p.startsWith("/dramas"), icon: FilmIcon },
  { href: "/search", label: "検索", match: (p: string) => p.startsWith("/search"), icon: SearchIcon },
] as const;

export function MobileBottomBar() {
  const pathname = usePathname() || "/";
  const recommendActive = pathname.startsWith("/recommend");

  return (
    <nav
      aria-label="モバイル用ナビゲーション"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-yuri-edge bg-yuri-cream/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around">
        {/* ホーム */}
        <Link
          href={ITEMS[0].href}
          aria-current={ITEMS[0].match(pathname) ? "page" : undefined}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 ${
            ITEMS[0].match(pathname) ? "text-yuri-rose" : "text-yuri-muted"
          }`}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-[11px] leading-none">ホーム</span>
        </Link>

        {/* ドラマ */}
        <Link
          href={ITEMS[1].href}
          aria-current={ITEMS[1].match(pathname) ? "page" : undefined}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 ${
            ITEMS[1].match(pathname) ? "text-yuri-rose" : "text-yuri-muted"
          }`}
        >
          <FilmIcon className="w-6 h-6" />
          <span className="text-[11px] leading-none">ドラマ</span>
        </Link>

        {/* おすすめ診断（主要アクション・中央で強調） */}
        <Link
          href="/recommend"
          aria-current={recommendActive ? "page" : undefined}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
        >
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full text-lg shadow-sm transition-colors ${
              recommendActive
                ? "bg-yuri-rose text-yuri-cream"
                : "bg-yuri-rose/90 text-yuri-cream"
            }`}
            aria-hidden
          >
            ✦
          </span>
          <span
            className={`text-[11px] leading-none font-medium ${
              recommendActive ? "text-yuri-rose" : "text-yuri-navy"
            }`}
          >
            診断
          </span>
        </Link>

        {/* 検索 */}
        <Link
          href={ITEMS[2].href}
          aria-current={ITEMS[2].match(pathname) ? "page" : undefined}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 ${
            ITEMS[2].match(pathname) ? "text-yuri-rose" : "text-yuri-muted"
          }`}
        >
          <SearchIcon className="w-6 h-6" />
          <span className="text-[11px] leading-none">検索</span>
        </Link>
      </div>
    </nav>
  );
}
