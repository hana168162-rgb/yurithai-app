import Link from "next/link";
import type { Actress } from "@/lib/types";

export function ActressProfile({ actress }: { actress: Actress }) {
  return (
    <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
      <div className="mb-3">
        <Link
          href={`/cast/${actress.id}`}
          className="text-sm font-medium text-yuri-navy hover:text-yuri-rose"
        >
          {actress.name_ja}
        </Link>
        <p className="text-xs text-yuri-muted">{actress.real_name}</p>
      </div>

      <dl className="text-xs space-y-1 mb-3">
        {actress.birth_date && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">生年月日</dt>
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
            <dt className="w-20 text-yuri-muted shrink-0">国籍</dt>
            <dd className="text-yuri-ink">{actress.nationality}</dd>
          </div>
        )}
        {actress.height_cm && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">身長</dt>
            <dd className="text-yuri-ink">{actress.height_cm}cm</dd>
          </div>
        )}
        {actress.agency && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">所属</dt>
            <dd className="text-yuri-ink">{actress.agency}</dd>
          </div>
        )}
        {actress.filmography && actress.filmography.length > 0 && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">出演作品</dt>
            <dd className="text-yuri-ink">{actress.filmography.join(" / ")}</dd>
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
