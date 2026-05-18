// Card for "currently watching" pickup — minimal info (no tags yet)

import Link from "next/link";
import type { WatchingDrama } from "@/lib/types";
import { gradientForSlug } from "@/lib/style";
import { StatusBadge } from "./StatusBadge";

export function WatchingCard({
  drama,
  cover,
}: {
  drama: WatchingDrama;
  cover?: string | null;
}) {
  return (
    <Link
      href={`/dramas/${drama.slug}`}
      className="block bg-yuri-surface rounded-lg overflow-hidden border border-yuri-edge hover:border-yuri-rose/40 transition-colors"
    >
      <div
        className="relative aspect-[3/4] bg-cover bg-center"
        style={
          cover
            ? { backgroundImage: `url(${cover})` }
            : { background: gradientForSlug(drama.slug) }
        }
      >
        <div className="absolute bottom-2 left-2">
          <StatusBadge status="airing" />
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium mb-0.5 truncate">{drama.title_ja}</p>
        {drama.title_th && (
          <p className="text-[10px] text-yuri-muted/80 mb-0.5 truncate">
            {drama.title_th}
          </p>
        )}
        <p className="text-[10px] text-yuri-muted mb-1">
          {drama.production ?? "制作元未確認"}
        </p>
        {drama.cast_pair && (
          <p className="text-[10px] text-yuri-rose/90 truncate">
            {drama.cast_pair.split("（")[1]?.replace("）", "") ??
              drama.cast_pair}
          </p>
        )}
      </div>
    </Link>
  );
}
