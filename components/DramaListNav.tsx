import Link from "next/link";

type Current = "completed" | "airing" | "upcoming";

const TABS: { id: Current; label: string; href: string }[] = [
  { id: "completed", label: "完結", href: "/dramas" },
  { id: "airing", label: "放送中", href: "/dramas/airing" },
  { id: "upcoming", label: "公開予定", href: "/dramas/upcoming" },
];

export function DramaListNav({ current }: { current: Current }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {TABS.map((t) => {
        const active = t.id === current;
        return (
          <Link
            key={t.id}
            href={t.href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              active
                ? "bg-yuri-navy text-yuri-cream border-yuri-navy"
                : "bg-yuri-cream text-yuri-ink border-yuri-edge hover:border-yuri-rose"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
