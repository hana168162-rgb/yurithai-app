"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/dramas", label: "ドラマ" },
  { href: "/cast", label: "ペア一覧" },
  { href: "/tags", label: "タグ" },
  { href: "/events", label: "イベント" },
  { href: "/blog", label: "ブログ" },
  { href: "/search", label: "検索" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ルート遷移したらドロワーを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ドロワーを開いている間は背面スクロールをロック
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header className="border-b border-yuri-edge bg-yuri-cream relative z-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* モバイル：ハンバーガー */}
        <button
          type="button"
          aria-label="メニューを開く"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col gap-[5px] p-2 -ml-2 text-yuri-ink"
        >
          <span className="block h-[2px] w-5 bg-current rounded" />
          <span className="block h-[2px] w-5 bg-current rounded" />
          <span className="block h-[2px] w-5 bg-current rounded" />
        </button>

        {/* ロゴ */}
        <Link
          href="/"
          className="text-2xl font-display font-medium tracking-tight md:mr-auto"
        >
          <span className="text-yuri-navy">Yuri</span>
          <span className="text-yuri-rose">Thai</span>
        </Link>

        {/* デスクトップ：横並びナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.filter((l) => l.label !== "検索").map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-yuri-ink hover:text-yuri-rose"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="検索"
            className="text-yuri-ink hover:text-yuri-rose"
          >
            <span aria-hidden>🔍</span>
          </Link>
          <Link
            href="/recommend"
            className="text-yuri-rose hover:opacity-80 flex items-center gap-1"
          >
            <span aria-hidden>✦</span>おすすめを探す
          </Link>
        </nav>

        {/* モバイル：右側に検索アイコンだけ残す */}
        <Link
          href="/search"
          aria-label="検索"
          className="md:hidden text-yuri-ink hover:text-yuri-rose p-2 -mr-2"
        >
          <span aria-hidden>🔍</span>
        </Link>
      </div>

      {/* サイドドロワー */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* オーバーレイ */}
        <div
          className="absolute inset-0 bg-yuri-ink/40"
          onClick={() => setOpen(false)}
        />
        {/* ドロワー本体 */}
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[80%] bg-yuri-cream shadow-xl transform transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="メインメニュー"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-yuri-edge">
            <Link
              href="/"
              className="text-xl font-display font-medium tracking-tight"
              onClick={() => setOpen(false)}
            >
              <span className="text-yuri-navy">Yuri</span>
              <span className="text-yuri-rose">Thai</span>
            </Link>
            <button
              type="button"
              aria-label="メニューを閉じる"
              onClick={() => setOpen(false)}
              className="text-yuri-muted text-2xl leading-none p-1"
            >
              ×
            </button>
          </div>
          <nav className="flex flex-col py-2 text-[15px]">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-5 py-3 text-yuri-ink hover:bg-yuri-edge/40 border-b border-yuri-edge/60"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/recommend"
              onClick={() => setOpen(false)}
              className="mx-5 mt-4 inline-flex items-center justify-center gap-1 bg-yuri-rose text-yuri-cream px-4 py-3 rounded-full text-sm font-medium hover:opacity-90"
            >
              <span aria-hidden>✦</span>おすすめを診断する
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}
