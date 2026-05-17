// Card for upcoming dramas — no rating/status overlay

import type { UpcomingDrama } from "@/lib/types";
import { gradientForSlug } from "@/lib/style";

export function UpcomingCard({ drama }: { drama: UpcomingDrama }) {
  return (
    <div className="block bg-yuri-surface rounded-lg overflow-hidden border border-yuri-edge">
      <div
        className="relative aspect-[3/4] bg-cover bg-center"
        style={
          drama.cover_image
            ? { backgroundImage: `url(${drama.cover_image})` }
            : { background: gradientForSlug(drama.slug) }
        }
      >
        {drama.announced_for && (
          <div
            className="absolute bottom-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded text-yuri-cream"
            style={{ background: "rgba(165,197,212,0.92)" }}
          >
            {drama.announced_for}
          </div>
        )}
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
    </div>
  );
}
