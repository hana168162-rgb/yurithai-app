import Link from "next/link";
import type { RelatedGroup } from "@/lib/content";
import { gradientForSlug } from "@/lib/style";

export function RelatedDramas({ groups }: { groups: RelatedGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section
          key={g.label}
          className="bg-yuri-surface border border-yuri-edge rounded-lg p-4"
        >
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-medium text-yuri-navy">{g.label}</h3>
            {g.reason && (
              <p className="text-[10px] text-yuri-muted truncate ml-2">
                {g.reason}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {g.dramas.map((d) => (
              <Link
                key={d.slug}
                href={`/dramas/${d.slug}`}
                className="block bg-yuri-cream rounded overflow-hidden border border-yuri-edge hover:border-yuri-rose/40 transition-colors"
              >
                <div
                  className="aspect-[3/4] bg-cover bg-center"
                  style={
                    d.cover_image
                      ? { backgroundImage: `url(${d.cover_image})` }
                      : { background: gradientForSlug(d.slug) }
                  }
                />
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{d.title_ja}</p>
                  <p className="text-[10px] text-yuri-muted mt-0.5">
                    {d.status === "airing"
                      ? "放送中"
                      : d.status === "upcoming"
                      ? "公開予定"
                      : "完結"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
