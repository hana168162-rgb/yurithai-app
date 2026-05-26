import Link from "next/link";
import type { Actress } from "@/lib/types";
import { nationalityFlags, agencyBadgeStyle } from "@/lib/style";

export function ActressProfile({ actress }: { actress: Actress }) {
  return (
    <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
      <div className="mb-3">
        <p className="text-[11px] text-yuri-muted leading-tight">
          {actress.name_ja}
        </p>
        <Link
          href={`/cast/${actress.id}`}
          className="text-base font-medium text-yuri-navy hover:text-yuri-rose leading-tight block"
        >
          {actress.name_en}
        </Link>
        <p className="text-xs text-yuri-muted mt-1">{actress.real_name}</p>
      </div>

      <dl className="text-[13px] leading-relaxed space-y-1.5 mb-3">
        {actress.birth_date && (
          <div className="flex">
            <dt className="w-14 md:w-20 text-yuri-muted shrink-0">生年月日</dt>
            <dd className="text-yuri-ink">
              {actress.birth_date}
              {actress.age !== null && (
                <span className="text-yuri-muted ml-2">（{actress.age}歳）</span>
              )}
            </dd>
          </div>
        )}
        {actress.nationality && (
          <div className="flex">
            <dt className="w-14 md:w-20 text-yuri-muted shrink-0">国籍</dt>
            <dd className="text-yuri-ink">
              {nationalityFlags(actress.nationality) && (
                <span className="mr-1" aria-hidden>
                  {nationalityFlags(actress.nationality)}
                </span>
              )}
              {actress.nationality}
            </dd>
          </div>
        )}
        {actress.height_cm && (
          <div className="flex">
            <dt className="w-14 md:w-20 text-yuri-muted shrink-0">身長</dt>
            <dd className="text-yuri-ink">{actress.height_cm}cm</dd>
          </div>
        )}
        {actress.agency && (
          <div className="flex">
            <dt className="w-14 md:w-20 text-yuri-muted shrink-0">所属</dt>
            <dd>
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: agencyBadgeStyle(actress.agency).bg,
                  color: agencyBadgeStyle(actress.agency).fg,
                }}
              >
                {actress.agency}
              </span>
            </dd>
          </div>
        )}
        {actress.filmography && actress.filmography.length > 0 && (
          <div className="pt-0.5">
            <dt className="text-yuri-muted mb-1">出演作品</dt>
            <dd className="flex flex-wrap gap-1">
              {actress.filmography.map((work) => (
                <span
                  key={work}
                  className="inline-block px-2 py-0.5 rounded-md bg-yuri-pink/30 text-yuri-navy text-[11px] leading-snug"
                >
                  {work}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {actress.instagram && (
        <a
          href={`https://instagram.com/${actress.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yuri-pink text-yuri-navy text-xs hover:opacity-80"
        >
          <span aria-hidden>📷</span>
          Instagram @{actress.instagram}
        </a>
      )}
    </div>
  );
}
