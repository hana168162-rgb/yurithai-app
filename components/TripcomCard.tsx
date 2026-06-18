import Link from "next/link";
import {
  TRIPCOM,
  TRIPCOM_TOP,
  TRIPCOM_GENERIC,
  AFFILIATE_DISCLOSURE_SHORT,
  AFFILIATE_DISCLOSURE_LONG,
} from "@/lib/affiliate";

type Variant = "compact" | "wide";
type LinkType = "package" | "top" | "generic";

/**
 * Trip.com アフィリリンクのカード。
 * compact: イベントページ等の挿入用
 * wide:    /guide/travel-to-thailand のCTA用
 * linkType:
 *   - "package" (default): 東京→バンコク パッケージ
 *   - "top": Trip.com トップページ（東京発以外のルート等を補足したい場面）
 *   - "generic": 汎用カード（出発地を指定しない、誰でも使えるコピー）
 */
export function TripcomCard({
  variant = "compact",
  linkType = "package",
}: {
  variant?: Variant;
  linkType?: LinkType;
}) {
  const isWide = variant === "wide";
  const cfg =
    linkType === "top"
      ? TRIPCOM_TOP
      : linkType === "generic"
        ? TRIPCOM_GENERIC
        : TRIPCOM;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-yuri-edge bg-gradient-to-br from-yuri-teal/40 to-yuri-cream ${
        isWide ? "p-5 md:p-6" : "p-2.5 sm:p-4"
      } mt-4`}
    >
      {/* 広告ラベル */}
      <span
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yuri-muted/15 text-yuri-muted tracking-wider"
        aria-label="アフィリエイト広告"
      >
        {AFFILIATE_DISCLOSURE_SHORT}
      </span>

      <div
        className={`flex items-center ${
          isWide ? "flex-col md:flex-row md:items-start gap-5" : "gap-2.5 sm:gap-3 sm:items-start"
        }`}
      >
        {/* アイコン（独自デザイン）モバイルは小さく */}
        <div
          className={`shrink-0 rounded-md bg-yuri-navy text-yuri-cream flex items-center justify-center ${
            isWide
              ? "w-16 h-16 text-xl"
              : "w-9 h-9 sm:w-11 sm:h-11 text-base sm:text-xl"
          }`}
          aria-hidden
        >
          {linkType === "top" ? "🌏" : "✈"}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-yuri-ink ${
              isWide ? "text-lg md:text-xl mb-2" : "text-[13px] sm:text-sm leading-snug mb-0 sm:mb-1"
            }`}
          >
            {cfg.cardTitle}
          </h3>
          {/* 説明文はモバイル非表示（縦幅を圧縮）。タブレット以上で1行、PCで2行まで。 */}
          <p
            className={`text-yuri-ink/80 leading-relaxed ${
              isWide
                ? "text-sm md:text-[15px] mb-3"
                : "hidden sm:block sm:text-xs sm:mb-3 line-clamp-2"
            }`}
          >
            {cfg.cardSubtitle}
          </p>

          <div
            className={`flex flex-wrap items-center gap-2 sm:gap-3 ${
              isWide ? "" : "mt-1.5 sm:mt-0"
            }`}
          >
            <a
              href={cfg.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className={`inline-flex items-center gap-1 bg-yuri-navy text-yuri-cream rounded-full font-medium hover:opacity-90 ${
                isWide
                  ? "px-5 py-2.5 text-sm"
                  : "px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-xs"
              }`}
            >
              {cfg.cta}
              <span aria-hidden>→</span>
            </a>
            {!isWide && (
              <Link
                href="/guide/travel-to-thailand"
                className="hidden sm:inline text-xs text-yuri-rose hover:opacity-80"
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
