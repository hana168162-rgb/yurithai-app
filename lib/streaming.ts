// Infer likely streaming platforms based on production company.
// TODO: replace with per-drama streaming data once collected.

export function inferStreamingPlatforms(
  production: string | null,
  note: string | null
): string[] {
  if (!production && !note) return [];
  const text = `${production ?? ""} ${note ?? ""}`.toLowerCase();
  const out: string[] = [];

  if (text.includes("idolfactory") || text.includes("idol factory")) {
    out.push("YouTube（IDOLFACTORY）");
    out.push("GagaOOLala");
  }
  if (text.includes("gmmtv")) {
    out.push("YouTube（GMMTV）");
    out.push("GMM 25");
    out.push("WeTV");
  }
  if (text.includes("channel 3") || text.includes("bec world") || text.includes("bec studio")) {
    out.push("CH3 Plus");
    out.push("Channel 3");
  }
  if (text.includes("netflix")) {
    out.push("Netflix");
  }
  if (text.includes("change2561")) {
    out.push("YouTube（CHANGE2561）");
    out.push("OneD");
  }
  if (text.includes("north star")) {
    out.push("YouTube（North Star）");
    out.push("iQIYI");
  }
  if (text.includes("motion minds")) {
    out.push("YouTube（Motion Minds）");
  }
  if (text.includes("s.nur") || text.includes("s.nur entertainment")) {
    out.push("YouTube（S.NUR Entertainment）");
  }
  if (text.includes("zense")) {
    out.push("WeTV");
    out.push("YouTube（Zense Entertainment）");
  }
  if (text.includes("velcurve")) {
    out.push("WeTV（アンカット）");
    out.push("Netflix");
  }
  if (text.includes("siamsi")) {
    out.push("iQIYI");
  }
  if (text.includes("ninestar")) {
    out.push("YouTube（NineStarStudios）");
  }
  if (text.includes("domundi")) {
    out.push("YouTube（Domundi）");
    out.push("GagaOOLala");
  }
  if (text.includes("u-next")) {
    out.push("U-NEXT");
  }
  if (text.includes("iqiyi")) {
    out.push("iQIYI");
  }
  if (text.includes("wetv")) {
    out.push("WeTV");
  }

  // Deduplicate while preserving order
  return Array.from(new Set(out));
}
