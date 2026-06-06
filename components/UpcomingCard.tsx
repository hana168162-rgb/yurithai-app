// Card for upcoming dramas — no rating/status overlay

import Link from "next/link";
import Image from "next/image";
import type { UpcomingDrama } from "@/lib/types";
import { gradientForSlug } from "@/lib/style";
import { shortPairName } from "@/lib/pair-name";

export function UpcomingCard({
  drama,
  hideProduction = false,
}: {
  drama: UpcomingDrama;
  /** トップページなど制作元を隠したい場合に true */
  hideProduction?: boolean;
}) {
  return (
    <Link
      href={`/dramas/${drama.slug}`}
      className="block bg-yuri-surface rounded-lg overflow-hidden border border-yuri-edge hover:border-yuri-rose/40 transition-colors"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {drama.cover_image ? (
          <Image
            src={drama.cover_image}
            alt={drama.title_ja}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: gradientForSlug(drama.slug) }}
            aria-hidden
          />
        )}
        {drama.announced_for && (
          <div
            className="absolute bottom-2 left-2 z-10 text-xs font-medium px-2 py-0.5 rounded text-yuri-cream"
            style={{ background: "rgba(165,197,212,0.92)" }}
          >
            {drama.announced_for}
          </div>
        )}
      </div>
      {/* スマホ最優先で読みやすさを底上げ。 */}
      <div className="p-3 md:p-2.5">
        <p className="text-[15px] md:text-sm font-semibold mb-0.5 leading-snug line-clamp-2">
          {drama.title_ja}
        </p>
        {drama.title_th && (
          <p className="text-[12px] md:text-xs text-yuri-muted mb-0.5 truncate">
            {drama.title_th}
          </p>
        )}
        {!hideProduction && (
          <p className="text-[13px] md:text-xs text-yuri-muted mb-1">
            {drama.production ?? "制作元未確認"}
          </p>
        )}
        {drama.cast_pair && (
          <p className="text-[13px] md:text-xs text-yuri-rose truncate">
            {shortPairName(drama.cast_pair)}
          </p>
        )}
      </div>
    </Link>
  );
}
