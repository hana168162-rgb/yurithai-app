import type { StreamingLink } from "@/lib/types";
import { isRestrictedNote } from "@/lib/streaming";

// プラットフォームごとの表示色（yuri-* tokens 利用）
const PLATFORM_STYLE: Record<string, string> = {
  YouTube: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  Netflix: "bg-red-900/10 text-red-900 border-red-900/20 hover:bg-red-900/15",
  TELASA: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  iQIYI: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  RakutenTV: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  WeTV: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  Viu: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
};

const DEFAULT_STYLE =
  "bg-yuri-surface text-yuri-navy border-yuri-edge hover:bg-yuri-pink/50";

// 日本から直接視聴できない注記のスタイル（警告色）
const RESTRICTED_STYLE =
  "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100";

function styleFor(platform: string): string {
  return PLATFORM_STYLE[platform] ?? DEFAULT_STYLE;
}

// note が「日本から直接視聴できない」ことを示すか（判定は lib/streaming に一元化）
const isRestricted = isRestrictedNote;

export function WhereToWatch({
  streaming,
  fallbackNote,
}: {
  streaming: StreamingLink[] | undefined;
  fallbackNote?: string | null;
}) {
  if (!streaming || streaming.length === 0) {
    return (
      <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4 text-sm text-yuri-muted">
        配信先情報は準備中です。
        {fallbackNote && (
          <p className="mt-2 text-xs text-yuri-ink/70">{fallbackNote}</p>
        )}
      </div>
    );
  }

  const hasRestricted = streaming.some((s) => isRestricted(s.note));

  return (
    <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
      <div className="flex flex-wrap gap-2">
        {streaming.map((s, i) => {
          const hasUrl = s.url && s.url.length > 0;
          const restricted = isRestricted(s.note);
          const className = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
            restricted ? RESTRICTED_STYLE : styleFor(s.platform)
          }`;

          const content = (
            <>
              {restricted && <span aria-hidden>🔒</span>}
              <span>{s.platform}</span>
              {s.note && (
                <span className="text-[11px] opacity-80">（{s.note}）</span>
              )}
              {hasUrl && (
                <span aria-hidden className="text-[11px]">
                  ↗
                </span>
              )}
            </>
          );

          return hasUrl ? (
            <a
              key={`${s.platform}-${i}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          ) : (
            <span key={`${s.platform}-${i}`} className={className}>
              {content}
            </span>
          );
        })}
      </div>
      {hasRestricted && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 font-medium">
          <span aria-hidden>🔒</span>
          日本から直接視聴不可（タイ限定／VPN必要）
        </p>
      )}
      <p className="mt-2 text-[11px] text-yuri-muted">
        ※ リンク付きの配信先は公式ページへ遷移します。配信状況は変動する場合があります。
      </p>
    </div>
  );
}
