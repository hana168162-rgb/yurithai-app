import Link from "next/link";
import type { Drama } from "@/lib/types";
import { gradientForSlug } from "@/lib/style";
import { AgeBadge } from "./AgeBadge";
import { StatusBadge } from "./StatusBadge";
import { TagBadge } from "./TagBadge";

// Pick representative tags for card preview:
// 1 from genre + 1 from tone + 1 from (relationship or intimacy)
function selectCardTags(d: Drama): string[] {
  const out: string[] = [];
  if (d.tags.genre[0]) out.push(d.tags.genre[0]);
  if (d.tags.tone[0]) out.push(d.tags.tone[0]);
  if (d.tags.relationship[0]) out.push(d.tags.relationship[0]);
  else if (d.tags.intimacy[0]) out.push(d.tags.intimacy[0]);
  else if (d.tags.pacing[0]) out.push(d.tags.pacing[0]);
  return out.slice(0, 3);
}

export function DramaCard({ drama }: { drama: Drama }) {
  const tags = selectCardTags(drama);
  return (
    <Link
      href={`/dramas/${drama.slug}`}
      className="block bg-yuri-surface rounded-lg overflow-hidden border border-yuri-edge hover:border-yuri-rose/40 transition-colors"
    >
      <div
        className="relative aspect-[3/4] bg-cover bg-center"
        style={
          drama.cover_image
            ? { backgroundImage: `url(${drama.cover_image})` }
            : { background: gradientForSlug(drama.slug) }
        }
      >
        <div className="absolute top-1.5 right-1.5">
          <AgeBadge rating={drama.age_rating} />
        </div>
        <div className="absolute bottom-2 left-2">
          <StatusBadge status={drama.status} episodes={drama.episodes} />
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium mb-0.5 truncate">{drama.title_ja}</p>
        <p className="text-[10px] text-yuri-muted mb-2">
          {drama.year ?? "—"}
          {drama.production ? ` · ${drama.production.split(" × ")[0]}` : ""}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t, i) => (
              <TagBadge key={t} label={t} idx={i} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
