import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-yuri-edge bg-yuri-cream">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-display font-medium tracking-tight"
        >
          <span className="text-yuri-navy">Yuri</span>
          <span className="text-yuri-rose">Thai</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/dramas" className="text-yuri-ink hover:text-yuri-rose">
            ドラマ
          </Link>
          <Link href="/cast" className="text-yuri-ink hover:text-yuri-rose">
            女優
          </Link>
          <Link
            href="/recommend"
            className="text-yuri-rose hover:opacity-80 flex items-center gap-1"
          >
            <span aria-hidden>✦</span>おすすめを探す
          </Link>
        </nav>
      </div>
    </header>
  );
}
