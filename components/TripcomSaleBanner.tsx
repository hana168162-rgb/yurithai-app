import { TRIPCOM_SALE, AFFILIATE_DISCLOSURE_SHORT } from "@/lib/affiliate";

/**
 * Trip.com セール（ホリデーディール）バナー。
 * 期間限定キャンペーンの訴求用。通常CTAより視覚的に強調されている。
 */
export function TripcomSaleBanner({ size = "normal" }: { size?: "normal" | "compact" }) {
  const isCompact = size === "compact";
  return (
    <a
      href={TRIPCOM_SALE.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={`group relative block overflow-hidden rounded-lg border border-yuri-rose/40 bg-gradient-to-r from-yuri-rose/15 via-yuri-cream to-yuri-teal/30 ${
        isCompact ? "p-3 md:p-4" : "p-4 md:p-5"
      } hover:border-yuri-rose hover:shadow-sm transition`}
    >
      <span
        className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-yuri-muted/15 text-yuri-muted tracking-wider"
        aria-label="アフィリエイト広告"
      >
        {AFFILIATE_DISCLOSURE_SHORT}
      </span>

      <div className={`flex ${isCompact ? "gap-3" : "gap-4"} items-center pr-12`}>
        <div
          className={`shrink-0 ${
            isCompact ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"
          } rounded-full bg-yuri-rose text-yuri-cream flex items-center justify-center font-bold`}
          aria-hidden
        >
          ％
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="inline-block text-[10px] font-bold tracking-wider text-yuri-rose bg-yuri-rose/15 rounded px-1.5 py-0.5">
              期間限定
            </span>
            <h3 className={`font-medium text-yuri-ink ${isCompact ? "text-sm" : "text-base md:text-lg"}`}>
              {TRIPCOM_SALE.cardTitle}
            </h3>
          </div>
          <p className={`text-yuri-ink/75 leading-relaxed mt-1 ${isCompact ? "text-xs" : "text-sm"}`}>
            {TRIPCOM_SALE.cardSubtitle}
          </p>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1 text-yuri-cream bg-yuri-navy rounded-full font-medium group-hover:opacity-90 ${
            isCompact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          } whitespace-nowrap hidden sm:inline-flex`}
        >
          {TRIPCOM_SALE.cta}
          <span aria-hidden>→</span>
        </span>
      </div>
    </a>
  );
}
