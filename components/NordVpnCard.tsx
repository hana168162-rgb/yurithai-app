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

  if (isWide) {
    // /guide/vpn 本文 CTA 用（従来通り）
    return (
      <div className="relative overflow-hidden rounded-lg border border-yuri-edge bg-gradient-to-br from-yuri-cream to-yuri-pink/30 p-5 md:p-6 mt-4">
        <span
          className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yuri-muted/15 text-yuri-muted tracking-wider"
          aria-label="アフィリエイト広告"
        >
          {AFFILIATE_DISCLOSURE_SHORT}
        </span>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="shrink-0 w-16 h-16 rounded-md bg-yuri-navy text-yuri-cream flex items-center justify-center text-xl" aria-hidden>
            🌐
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-yuri-ink text-lg md:text-xl mb-2">{cardTitle}</h3>
            <p className="text-yuri-ink/80 leading-relaxed text-sm md:text-[15px] mb-3">{cardSubtitle}</p>
            <a
              href={NORDVPN.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-yuri-navy text-yuri-cream rounded-full font-medium px-5 py-2.5 text-sm hover:opacity-90"
            >
              {NORDVPN.cta}
              <span aria-hidden>→</span>
            </a>
            <p className="text-[11px] text-yuri-muted mt-3 leading-relaxed">{AFFILIATE_DISCLOSURE_LONG}</p>
            <p className="text-[10px] text-yuri-muted/80 mt-2 leading-relaxed">{NORD_TRADEMARK_ATTRIBUTION}</p>
          </div>
        </div>
      </div>
    );
  }

  // compact: 作品詳細「どこで見れる？」直下の視覚的アクションパネル
  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 border-yuri-rose/30 bg-gradient-to-br from-yuri-cream via-yuri-pink/40 to-yuri-rose/20 p-5 mt-4 shadow-sm"
    >
      {/* 広告ラベル */}
      <span
        className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/70 text-yuri-muted tracking-wider"
        aria-label="アフィリエイト広告"
      >
        {AFFILIATE_DISCLOSURE_SHORT}
      </span>

      {/* ヘッダー: 大きい丸アイコン + 太い見出し */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="shrink-0 w-14 h-14 rounded-full bg-yuri-navy text-yuri-cream flex items-center justify-center text-2xl shadow-sm"
          aria-hidden
        >
          🌐
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-base text-yuri-ink leading-tight">
            {cardTitle}
          </h3>
          <p className="text-[11px] text-yuri-muted mt-0.5 leading-tight">
            タイ・他国の配信を観るための選択肢
          </p>
        </div>
      </div>

      {/* 説明 */}
      <p className="text-sm text-yuri-ink/85 leading-relaxed mb-4">
        {cardSubtitle}
      </p>

      {/* 3ステップの簡易図解 */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] text-yuri-ink/85">
        <span className="px-2.5 py-1 rounded-full bg-white/70 border border-yuri-edge font-medium">① VPN 登録</span>
        <span aria-hidden className="text-yuri-rose">→</span>
        <span className="px-2.5 py-1 rounded-full bg-white/70 border border-yuri-edge font-medium">② タイに接続</span>
        <span aria-hidden className="text-yuri-rose">→</span>
        <span className="px-2.5 py-1 rounded-full bg-white/70 border border-yuri-edge font-medium">③ 視聴</span>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={NORDVPN.url}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-yuri-navy text-yuri-cream rounded-full font-semibold px-5 py-3 text-sm hover:opacity-90 shadow-sm"
        >
          {NORDVPN.cta}
          <span aria-hidden>→</span>
        </a>
        <Link
          href="/guide/vpn"
          className="text-sm text-yuri-rose hover:opacity-80 font-medium"
        >
          VPN とは？ →
        </Link>
      </div>
    </div>
  );
}
