import Link from "next/link";
import {
  NORDVPN,
  AFFILIATE_DISCLOSURE_SHORT,
  AFFILIATE_DISCLOSURE_LONG,
  NORD_TRADEMARK_ATTRIBUTION,
} from "@/lib/affiliate";

type Variant = "compact" | "wide";

/**
 * NordVPN アフィリエイト紹介カード。
 * - NordVPN 提供のロゴ・バナー画像は使用せず、当サイト独自のデザイン要素のみで構成
 *   （Nord Trademark Policy: 商標を自社商標と結合させたり、改変したりしない方針に準拠）
 * - 商標帰属表記・PR表記・rel="sponsored" を含む
 *
 * compact: 作品詳細の「どこで見れる？」下に挿入する小カード
 * wide:    /guide/vpn の本文 CTA 用
 *
 * title / subtitle を渡すと、その作品の状況に合わせた文言に差し替えられる
 * （例: 「この作品は日本から直接観られる配信先がありません」など）。
 */
export function NordVpnCard({
  variant = "compact",
  title,
  subtitle,
}: {
  variant?: Variant;
  title?: string;
  subtitle?: string;
}) {
  const isWide = variant === "wide";
  const cardTitle = title ?? NORDVPN.cardTitle;
  const cardSubtitle = subtitle ?? NORDVPN.cardSubtitle;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-yuri-edge bg-gradient-to-br from-yuri-cream to-yuri-pink/30 ${
        isWide ? "p-5 md:p-6" : "p-4"
      } mt-4`}
    >
      {/* 広告ラベル（景品表示法ステマ規制対応） */}
      <span
        className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yuri-muted/15 text-yuri-muted tracking-wider"
        aria-label="アフィリエイト広告"
      >
        {AFFILIATE_DISCLOSURE_SHORT}
      </span>

      <div className={`flex ${isWide ? "flex-col md:flex-row gap-5" : "gap-3"} items-start`}>
        {/* アイコン（NordVPN のロゴは使わず、汎用アイコンで代用） */}
        <div
          className={`shrink-0 ${
            isWide ? "w-16 h-16" : "w-11 h-11"
          } rounded-md bg-yuri-navy text-yuri-cream flex items-center justify-center text-xl`}
          aria-hidden
        >
          🌐
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-yuri-ink ${
              isWide ? "text-lg md:text-xl mb-2" : "text-sm mb-1"
            }`}
          >
            {cardTitle}
          </h3>
          <p
            className={`text-yuri-ink/80 leading-relaxed ${
              isWide ? "text-sm md:text-[15px]" : "text-xs"
            } mb-3`}
          >
            {cardSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={NORDVPN.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className={`inline-flex items-center gap-1.5 bg-yuri-navy text-yuri-cream rounded-full font-medium hover:opacity-90 ${
                isWide ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"
              }`}
            >
              {NORDVPN.cta}
              <span aria-hidden>→</span>
            </a>
            {!isWide && (
              <Link
                href="/guide/vpn"
                className="text-xs text-yuri-rose hover:opacity-80"
              >
                詳しく見る →
              </Link>
            )}
          </div>

          {isWide && (
            <>
              <p className="text-[11px] text-yuri-muted mt-3 leading-relaxed">
                {AFFILIATE_DISCLOSURE_LONG}
              </p>
              <p className="text-[10px] text-yuri-muted/80 mt-2 leading-relaxed">
                {NORD_TRADEMARK_ATTRIBUTION}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
