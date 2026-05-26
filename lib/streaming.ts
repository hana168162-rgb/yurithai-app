import type { StreamingLink } from "@/lib/types";

/**
 * 配信先の note が「日本から直接視聴できない（地理ブロック＝VPN等が必要）」ことを示すか。
 * WhereToWatch の 🔒 マーク表示と、作品詳細での VPN 案内出し分けで
 * 同じ判定を使うため、ここに一元化している。
 *
 * 注意: 「メンバーシップ（有料）」「メンバー限定」は YouTube 等の課金/加入であり、
 * 日本からでも視聴可能（地理ブロックではない）ため、ここでは制限扱いにしない。
 */
export const VPN_RESTRICTED_RE = /VPN|視聴不可|タイ限定|現地限定/;

export function isRestrictedNote(note?: string | null): boolean {
  if (!note) return false;
  return VPN_RESTRICTED_RE.test(note);
}

export type StreamingAccess = {
  /** 1件でも「日本から直接視聴できない」配信先があるか */
  hasRestricted: boolean;
  /** 1件でも日本から直接観られる配信先があるか */
  hasJpAccessible: boolean;
  /** 配信先がすべて視聴制限あり（＝実質 VPN等が無いと観られない） */
  vpnOnly: boolean;
};

/**
 * 配信先リストを「日本から観られるか」の観点で分類する。
 */
export function analyzeStreamingAccess(
  streaming: StreamingLink[] | null | undefined
): StreamingAccess {
  if (!streaming || streaming.length === 0) {
    return { hasRestricted: false, hasJpAccessible: false, vpnOnly: false };
  }
  let hasRestricted = false;
  let hasJpAccessible = false;
  for (const s of streaming) {
    if (isRestrictedNote(s.note)) hasRestricted = true;
    else hasJpAccessible = true;
  }
  return {
    hasRestricted,
    hasJpAccessible,
    vpnOnly: hasRestricted && !hasJpAccessible,
  };
}

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
