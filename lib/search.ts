// シンプルなクライアントサイド検索インデックス
// dataset が小さい（数百件）ので全件スキャンで十分

import { dramas, watching, upcoming, actresses } from "./content";
import type { AnyDrama, Actress } from "./types";
import aliasesData from "@/content/search-aliases.json";

type AliasMap = Record<string, string[]>;
type AliasesFile = {
  pairs: AliasMap;
  actresses: AliasMap;
  dramas: AliasMap;
};
const ALIASES = aliasesData as unknown as AliasesFile;

export type SearchResultType = "drama" | "actress" | "tag";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  matchText: string;
}

function normalize(s: string | null | undefined): string {
  if (!s) return "";
  return s.toLowerCase().normalize("NFKC");
}

/** cast_pair 文字列からペア名（"FreenBecky" 等）を抽出 */
function extractPairKey(castPair: string | null | undefined): string | null {
  if (!castPair) return null;
  // 例: "Sarocha Chankimha × Becky Armstrong（FreenBecky）"
  const m = castPair.match(/[（(]([A-Za-z]+)[）)]/);
  if (m) return m[1];
  // 例: "FreenBecky" 単独
  const trimmed = castPair.trim();
  if (/^[A-Za-z]+$/.test(trimmed)) return trimmed;
  return null;
}

function aliasesForPair(castPair: string | null | undefined): string[] {
  const key = extractPairKey(castPair);
  if (!key) return [];
  return ALIASES.pairs[key] ?? [];
}

function aliasesForDrama(slug: string): string[] {
  return ALIASES.dramas[slug] ?? [];
}

function aliasesForActress(id: string): string[] {
  return ALIASES.actresses[id] ?? [];
}

function dramaToText(d: AnyDrama): string {
  const parts: (string | null | undefined)[] = [
    d.title_ja,
    d.title_en,
    "title_th" in d ? d.title_th : null,
    d.production,
    d.cast_pair,
    "note" in d ? d.note : null,
  ];
  // tags
  if ("tags" in d && d.tags) {
    for (const arr of Object.values(d.tags)) {
      if (Array.isArray(arr)) parts.push(arr.join(" "));
    }
  }
  // エイリアス（作品スラッグ・主演ペア由来）
  parts.push(...aliasesForDrama(d.slug));
  parts.push(...aliasesForPair(d.cast_pair));
  return normalize(parts.filter(Boolean).join(" | "));
}

function actressToText(a: Actress): string {
  const parts: (string | null | undefined)[] = [
    a.name_ja,
    a.real_name,
    a.agency,
    a.instagram,
    a.filmography?.join(" "),
  ];
  parts.push(...aliasesForActress(a.id));
  return normalize(parts.filter(Boolean).join(" | "));
}

export function searchAll(query: string): SearchResult[] {
  const q = normalize(query);
  if (!q || q.length < 1) return [];

  const results: SearchResult[] = [];

  // ドラマ全件
  const allDramas = [...dramas, ...watching, ...upcoming];
  for (const d of allDramas) {
    const text = dramaToText(d);
    if (text.includes(q)) {
      const status =
        d.status === "airing"
          ? "放送中"
          : d.status === "upcoming"
          ? "公開予定"
          : "完結";
      results.push({
        type: "drama",
        title: d.title_ja,
        subtitle: `${status} · ${d.production ?? ""}${d.cast_pair ? ` · ${d.cast_pair}` : ""}`,
        href: `/dramas/${d.slug}`,
        matchText: text,
      });
    }
  }

  // 女優全件
  for (const a of actresses) {
    const text = actressToText(a);
    if (text.includes(q)) {
      results.push({
        type: "actress",
        title: a.name_ja,
        subtitle: `${a.real_name}${a.agency ? ` · ${a.agency}` : ""}`,
        href: `/cast/${a.id}`,
        matchText: text,
      });
    }
  }

  // ジャンル相当のタグも検索対象に
  const seenTags = new Set<string>();
  for (const d of dramas) {
    if (!d.tags) continue;
    for (const tagArr of Object.values(d.tags)) {
      if (!Array.isArray(tagArr)) continue;
      for (const t of tagArr) {
        if (seenTags.has(t)) continue;
        if (normalize(t).includes(q)) {
          seenTags.add(t);
          results.push({
            type: "tag",
            title: t,
            subtitle: "タグ別検索",
            href: `/tags/${encodeURIComponent(t)}`,
            matchText: t,
          });
        }
      }
    }
  }

  return results;
}
