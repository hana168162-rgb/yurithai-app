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
