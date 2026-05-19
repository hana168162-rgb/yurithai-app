import Link from "next/link";
import {
  TRIPCOM,
  AFFILIATE_DISCLOSURE_SHORT,
  AFFILIATE_DISCLOSURE_LONG,
} from "@/lib/affiliate";

type Variant = "compact" | "wide";

/**
 * Trip.com（東京→バンコク パッケージ）アフィリリンクのカード。
 * compact: イベントページ等の挿入用
 * wide:    /guide/travel-to-thailand のCTA用
 */
export function TripcomCard({ variant = "compact" }: { variant?: Variant }) {
  const isWide = variant === "wide";

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-yuri-edge bg-gradient-to-br from-yuri-teal/40 to-yuri-cream ${
        isWide ? "p-5 md:p-6" : "p-4"
      } mt-4`}
    >
      {/* 広告ラベル */}
      <span
        className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yuri-muted/15 text-yuri-muted tracking-wider"
        aria-label="アフィリエイト広告"
      >
        {AFFILIATE_DISCLOSURE_SHORT}
      </span>

      <div className={`flex ${isWide ? "flex-col md:flex-row gap-5" : "gap-3"} items-start`}>
        {/* アイコン（独自デザイン） */}
        <div
          className={`shrink-0 ${
            isWide ? "w-16 h-16" : "w-11 h-11"
          } rounded-md bg-yuri-navy text-yuri-cream flex items-center justify-center text-xl`}
          aria-hidden
        >
          ✈
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-yuri-ink ${
              isWide ? "text-lg md:text-xl mb-2" : "text-sm mb-1"
            }`}
          >
            {TRIPCOM.cardTitle}
          </h3>
          <p
            className={`text-yuri-ink/80 leading-relaxed ${
              isWide ? "text-sm md:text-[15px]" : "text-xs"
            } mb-3`}
          >
            {TRIPCOM.cardSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={TRIPCOM.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className={`inline-flex items-center gap-1.5 bg-yuri-navy text-yuri-cream rounded-full font-medium hover:opacity-90 ${
                isWide ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"
              }`}
            >
              {TRIPCOM.cta}
              <span aria-hidden>→</span>
            </a>
            {!isWide && (
              <Link
                href="/guide/travel-to-thailand"
                className="text-xs text-yuri-rose hover:opacity-80"
              >
                バンコク旅行ガイドを見る →
              </Link>
            )}
          </div>

          {isWide && (
            <p className="text-[11px] text-yuri-muted mt-3 leading-relaxed">
              {AFFILIATE_DISCLOSURE_LONG}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
