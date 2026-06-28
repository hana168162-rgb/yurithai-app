import Link from "next/link";
import Image from "next/image";
import type { Drama } from "@/lib/types";
import { gradientForSlug } from "@/lib/style";
import { AgeBadge } from "./AgeBadge";
import { StatusBadge } from "./StatusBadge";
import { TagBadge } from "./TagBadge";
import { shortPairName } from "@/lib/pair-name";

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

/**
 * カード内のペア表示。
 * - 通常（1〜3ペア）: 1 行で表示
 * - 4 ペア以上の群像劇: モバイルでは半分ずつ 2 行に折り返し、デスクトップでは 1 行
 */
function PairLine({ castPair }: { castPair: string }) {
  const name = shortPairName(castPair);
  const parts = name.split(" × ");
  if (parts.length >= 4) {
    const mid = Math.ceil(parts.length / 2);
    const top = parts.slice(0, mid).join(" × ");
    const bottom = parts.slice(mid).join(" × ");
    return (
      <p className="text-[13px] md:text-xs text-yuri-rose mb-2 leading-snug">
        {/* モバイル: 2 行表示 */}
        <span className="sm:hidden">
          <span className="block truncate">{top}</span>
          <span className="block truncate">{bottom}</span>
        </span>
        {/* sm 以上: 1 行表示 */}
        <span className="hidden sm:inline truncate">{name}</span>
      </p>
    );
  }
  return (
    <p className="text-[13px] md:text-xs text-yuri-rose mb-2 truncate">{name}</p>
  );
}

export function DramaCard({
  drama,
  hideProduction = false,
  hideYear = false,
  hideTags = false,
}: {
  drama: Drama;
  /** トップページなど制作元を隠したい場合に true */
  hideProduction?: boolean;
  /** 公開年を隠したい場合に true */
  hideYear?: boolean;
  /** 代表タグを隠したい場合に true */
  hideTags?: boolean;
}) {
  const tags = selectCardTags(drama);
  // 年・制作元の連結ライン。両方非表示なら <p> ごと出さない
  const metaParts: string[] = [];
  if (!hideYear) metaParts.push(String(drama.year ?? "—"));
  if (!hideProduction && drama.production)
    metaParts.push(drama.production.split(" × ")[0]);
  const metaLine = metaParts.join(" · ");
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
        <div className="absolute top-1.5 right-1.5 z-10">
          <AgeBadge rating={drama.age_rating} />
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <StatusBadge status={drama.status} episodes={drama.episodes} />
        </div>
      </div>
      {/* スマホ最優先で読みやすさを底上げ：
          - 余白 p-2.5 → p-3
          - タイトル text-sm(14) → text-[15px]、truncate → line-clamp-2 で2行まで折り返し
          - サブテキスト text-xs(12) → text-[13px]、muted のコントラスト改善 */}
      <div className="p-3 md:p-2.5">
        <p className="text-[15px] md:text-sm font-semibold mb-0.5 leading-snug line-clamp-2">
          {drama.title_ja}
        </p>
        {drama.title_th && (
          <p className="text-[12px] md:text-xs text-yuri-muted mb-0.5 truncate">
            {drama.title_th}
          </p>
        )}
        {metaLine && (
          <p className="text-[13px] md:text-xs text-yuri-muted mb-1">
            {metaLine}
          </p>
        )}
        {drama.cast_pair && <PairLine castPair={drama.cast_pair} />}
        {!hideTags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t, i) => (
              <TagBadge key={t} label={t} idx={i} linkable={false} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
