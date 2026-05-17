import type { Actress } from "@/lib/types";

export function ActressProfile({ actress }: { actress: Actress }) {
  return (
    <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-yuri-navy">{actress.name_ja}</p>
        <p className="text-xs text-yuri-muted">{actress.name_en}</p>
      </div>

      <dl className="text-xs space-y-1 mb-3">
        {actress.agency && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">所属</dt>
            <dd className="text-yuri-ink">{actress.agency}</dd>
          </div>
        )}
        {actress.height_cm && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">身長</dt>
            <dd className="text-yuri-ink">{actress.height_cm}cm</dd>
          </div>
        )}
        {actress.birthplace && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">出身</dt>
            <dd className="text-yuri-ink">{actress.birthplace}</dd>
          </div>
        )}
        {actress.mixed_heritage && (
          <div className="flex">
            <dt className="w-20 text-yuri-muted shrink-0">ルーツ</dt>
            <dd className="text-yuri-ink">{actress.mixed_heritage}</dd>
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
