// Style utilities

// Stable hash → gradient pair from brand palette
const GRADIENT_PALETTE = [
  ["#F5C5D5", "#C9B8DD"],
  ["#A5C5D4", "#C9B8DD"],
  ["#F5C5D5", "#D4B589"],
  ["#A5C5D4", "#F5C5D5"],
  ["#C9B8DD", "#D4B589"],
  ["#C9B8DD", "#C4708C"],
  ["#A5C5D4", "#C4708C"],
  ["#C9B8DD", "#3D3470"],
  ["#D4B589", "#A5C5D4"],
  ["#F5C5D5", "#A5C5D4"],
];

export function gradientForSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTE.length;
  const [from, to] = GRADIENT_PALETTE[idx];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

// Age rating → badge style
export function ageRatingStyle(rating: string | null): {
  bg: string;
  fg: string;
  label: string;
} | null {
  if (!rating) return null;
  const r = rating.trim();
  if (r === "G" || r.toLowerCase() === "all") {
    return { bg: "#EAF3DE", fg: "#27500A", label: r };
  }
  if (r.startsWith("13") || r.startsWith("15")) {
    return { bg: "#FAEEDA", fg: "#854F0B", label: r };
  }
  if (r.startsWith("16") || r.startsWith("18+")) {
    return { bg: "#FAECE7", fg: "#712B13", label: r };
  }
  if (r.toUpperCase().startsWith("R18") || r.includes("explicit")) {
    return { bg: "#FCEBEB", fg: "#791F1F", label: r };
  }
  return { bg: "#F1EFE8", fg: "#444441", label: r };
}

// 国籍文字列 → 国旗絵文字（複数ルーツは並記）
const NATIONALITY_FLAG_MAP: [string, string][] = [
  ["Hong Kong", "🇭🇰"],
  ["Thai", "🇹🇭"],
  ["British", "🇬🇧"],
  ["Danish", "🇩🇰"],
  ["American", "🇺🇸"],
  ["Canadian", "🇨🇦"],
  ["Taiwanese", "🇹🇼"],
  ["Italian", "🇮🇹"],
  ["Israeli", "🇮🇱"],
];

export function nationalityFlags(nationality: string | null): string {
  if (!nationality) return "";
  const flags: string[] = [];
  for (const [kw, flag] of NATIONALITY_FLAG_MAP) {
    if (nationality.includes(kw) && !flags.includes(flag)) flags.push(flag);
  }
  return flags.join("");
}

// 事務所名 → 安定した色のバッジスタイル（背景tint / 文字色）
const AGENCY_BADGE_PALETTE: { bg: string; fg: string }[] = [
  { bg: "rgba(245,197,213,0.30)", fg: "#8A3A52" }, // pink
  { bg: "rgba(165,197,212,0.30)", fg: "#2A5568" }, // teal
  { bg: "rgba(201,184,221,0.32)", fg: "#4A3A70" }, // lilac
  { bg: "rgba(212,181,137,0.30)", fg: "#6B4E1A" }, // gold
  { bg: "rgba(196,112,140,0.22)", fg: "#7A2E45" }, // rose
];

export function agencyBadgeStyle(agency: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < agency.length; i++) {
    hash = (hash << 5) - hash + agency.charCodeAt(i);
    hash |= 0;
  }
  return AGENCY_BADGE_PALETTE[Math.abs(hash) % AGENCY_BADGE_PALETTE.length];
}
