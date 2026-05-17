import type { Actress } from "@/lib/types";

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const SOCIAL_PREFIXES: Record<string, string> = {
  instagram: "https://instagram.com/",
  x: "https://x.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
};

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

      <div className="flex flex-wrap gap-1.5 text-[10px]">
        {Object.entries(actress.social).map(([key, value]) => {
          if (!value) return null;
          const label = SOCIAL_LABELS[key] ?? key;
          const url = `${SOCIAL_PREFIXES[key] ?? ""}${value}`;
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-full bg-yuri-pink text-yuri-navy hover:opacity-80"
            >
              {label} @{value}
            </a>
          );
        })}
      </div>
    </div>
  );
}
