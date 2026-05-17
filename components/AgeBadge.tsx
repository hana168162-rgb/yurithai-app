import { ageRatingStyle } from "@/lib/style";

export function AgeBadge({ rating }: { rating: string | null }) {
  const s = ageRatingStyle(rating);
  if (!s) return null;
  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
