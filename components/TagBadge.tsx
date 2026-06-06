// Compact tag pill used on drama cards
// クリック可能: 該当タグの作品一覧ページに遷移

import Link from "next/link";
import { tagToSlug } from "@/lib/content";

const PALETTE_BG = ["#F5C5D5", "#C9B8DD", "#A5C5D4", "#D4B589", "#FAEEDA"];

export function TagBadge({
  label,
  idx = 0,
  size = "sm",
  linkable = true,
}: {
  label: string;
  idx?: number;
  size?: "sm" | "md";
  linkable?: boolean;
}) {
  const bg = PALETTE_BG[idx % PALETTE_BG.length];
  // モバイルでの可読性を優先: sm は text-[11px] に底上げ（md以上は従来通り）
  // size=md の場合は変えない（既存の詳細ページ用）
  const px =
    size === "md"
      ? "px-2.5 py-1 text-xs"
      : "px-2 py-0.5 text-[11px] md:text-[10px]";
  const className = `${px} rounded-full text-yuri-navy whitespace-nowrap`;

  if (linkable) {
    return (
      <Link
        href={`/tags/${tagToSlug(label)}`}
        className={`${className} hover:opacity-80 transition-opacity inline-block`}
        style={{ background: bg }}
      >
        {label}
      </Link>
    );
  }

  return (
    <span className={className} style={{ background: bg }}>
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
      className="px-2 py-0.5 rounded-full text-[11px] md:text-[10px] text-yuri-cream whitespace-nowrap"
      style={{ background: bg }}
    >
      {label}
    </span>
  );
}
