// Compact tag pill used on drama cards

const PALETTE_BG = ["#F5C5D5", "#C9B8DD", "#A5C5D4", "#D4B589", "#FAEEDA"];

export function TagBadge({
  label,
  idx = 0,
  size = "sm",
}: {
  label: string;
  idx?: number;
  size?: "sm" | "md";
}) {
  const bg = PALETTE_BG[idx % PALETTE_BG.length];
  const px = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`${px} rounded-full text-yuri-navy whitespace-nowrap`}
      style={{ background: bg }}
    >
      {label}
    </span>
  );
}

// Dark variant — used on review cards (highlights / recommend_for)
export function TagPillDark({
  label,
  variant = "navy",
}: {
  label: string;
  variant?: "navy" | "rose";
}) {
  const bg = variant === "navy" ? "#3D3470" : "#C4708C";
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] text-yuri-cream whitespace-nowrap"
      style={{ background: bg }}
    >
      {label}
    </span>
  );
}
