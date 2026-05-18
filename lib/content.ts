// Content loader - reads JSON files at build time

import dramasData from "@/content/dramas.json";
import watchingData from "@/content/watching.json";
import upcomingData from "@/content/upcoming.json";
import actressesData from "@/content/actresses.json";
import pairsData from "@/content/pairs.json";
import companiesData from "@/content/companies.json";
import taxonomyData from "@/content/taxonomy.json";
import questionsData from "@/content/diagnostic/questions.json";
import type {
  Drama,
  WatchingDrama,
  UpcomingDrama,
  AnyDrama,
  Actress,
  Company,
  Taxonomy,
  QuestionsFile,
} from "./types";

export const dramas = dramasData as unknown as Drama[];
export const watching = watchingData as unknown as WatchingDrama[];
export const upcoming = upcomingData as unknown as UpcomingDrama[];
export const actresses = actressesData as unknown as Actress[];
export const companies = companiesData as unknown as Company[];
export const taxonomy = taxonomyData as unknown as Taxonomy;
export const questionsFile = questionsData as unknown as QuestionsFile;

export function getActressById(id: string): Actress | undefined {
  return actresses.find((a) => a.id === id);
}

export function allActressIds(): string[] {
  return actresses.map((a) => a.id);
}

/**
 * 女優IDから出演作品（dramas + watching + upcoming）を返す
 * 1) pairs.json で女優が紐付くペアを取得
 * 2) そのペアが含まれる作品 + 個別 filmography に含まれる作品名で逆引き
 */
export function getDramasForActress(
  actressId: string
): { drama: AnyDrama; title_ja: string }[] {
  const actress = getActressById(actressId);
  if (!actress) return [];

  // この女優が含まれるペア名を全て取得
  const myPairs = Object.entries(pairsData as Record<string, string[]>)
    .filter(([, ids]) => ids.includes(actressId))
    .map(([name]) => name);

  const allWorks = [...dramas, ...watching, ...upcoming];
  const result: { drama: AnyDrama; title_ja: string }[] = [];
  const seen = new Set<string>();

  // 1) ペア名で逆引き
  for (const w of allWorks) {
    const cp = w.cast_pair ?? "";
    if (myPairs.some((p) => cp.includes(p))) {
      if (!seen.has(w.slug)) {
        seen.add(w.slug);
        result.push({ drama: w, title_ja: w.title_ja });
      }
    }
  }

  // 2) filmography のタイトル文字列で逆引き（補完用）
  const fm = actress.filmography ?? [];
  for (const w of allWorks) {
    if (seen.has(w.slug)) continue;
    const candidate = [w.title_ja, w.title_en].filter(Boolean) as string[];
    if (fm.some((f) => candidate.some((c) => c.includes(f) || f.includes(c)))) {
      seen.add(w.slug);
      result.push({ drama: w, title_ja: w.title_ja });
    }
  }

  return result;
}

export const pairs = pairsData as Record<string, string[]>;

export function getActressesForPair(shipName: string): Actress[] {
  const ids = pairs[shipName] ?? [];
  return ids
    .map((id) => getActressById(id))
    .filter((a): a is Actress => Boolean(a));
}

export function getDramaBySlug(slug: string): Drama | undefined {
  return dramas.find((d) => d.slug === slug);
}

export function getAnyDramaBySlug(slug: string): AnyDrama | undefined {
  return (
    dramas.find((d) => d.slug === slug) ??
    watching.find((d) => d.slug === slug) ??
    upcoming.find((d) => d.slug === slug)
  );
}

export function allDramaSlugs(): string[] {
  return [
    ...dramas.map((d) => d.slug),
    ...watching.map((d) => d.slug),
    ...upcoming.map((d) => d.slug),
  ];
}

// Extract pair short name like "FreenBecky" from cast_pair string
export function extractPairName(castPair: string | null): string | null {
  if (!castPair) return null;
  const m = castPair.match(/（([^）]+)）/);
  return m ? m[1] : null;
}

export function getAiringDramas(): Drama[] {
  return dramas.filter((d) => d.status === "airing");
}

export function getCompletedDramas(): Drama[] {
  return dramas.filter((d) => d.status === "completed");
}

// Take up to N completed dramas as featured (use most recent year first)
export function getFeaturedCompletedDramas(limit = 6): Drama[] {
  return [...getCompletedDramas()]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, limit);
}

// Watching list serves as homepage "currently airing pickup"
export function getCurrentPickup(): WatchingDrama[] {
  return watching.slice(0, 4);
}

// =============================================
//  Tag-related helpers
// =============================================

export type TagCategoryKey =
  | "genre"
  | "relationship"
  | "tone"
  | "pacing"
  | "intimacy"
  | "production_quality"
  | "warnings";

export const TAG_CATEGORY_LABELS: Record<TagCategoryKey, string> = {
  genre: "ジャンル",
  relationship: "関係性",
  tone: "トーン",
  pacing: "ペース",
  intimacy: "描写の濃さ",
  production_quality: "プロダクション",
  warnings: "注意点",
};

export interface TagSummary {
  tag: string;
  category: TagCategoryKey;
  count: number;
}

/**
 * 全タグを集計（カテゴリ別 / 件数付き）
 */
export function allTags(): TagSummary[] {
  const map = new Map<string, TagSummary>();

  for (const d of dramas) {
    if (!d.tags) continue;
    for (const cat of Object.keys(TAG_CATEGORY_LABELS) as TagCategoryKey[]) {
      const tagsInCat = (d.tags as Record<string, string[]>)[cat] ?? [];
      for (const t of tagsInCat) {
        const key = `${cat}::${t}`;
        if (!map.has(key)) {
          map.set(key, { tag: t, category: cat, count: 0 });
        }
        map.get(key)!.count += 1;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

/**
 * 指定タグを含む完結作品を返す
 */
export function getDramasByTag(tag: string): Drama[] {
  return dramas.filter((d) => {
    if (!d.tags) return false;
    return Object.values(d.tags).some(
      (arr) => Array.isArray(arr) && arr.includes(tag)
    );
  });
}

/**
 * タグからカテゴリを推定（最初に見つかったもの）
 */
export function getCategoryForTag(tag: string): TagCategoryKey | null {
  for (const cat of Object.keys(TAG_CATEGORY_LABELS) as TagCategoryKey[]) {
    if (dramas.some((d) => (d.tags as Record<string, string[]>)[cat]?.includes(tag))) {
      return cat;
    }
  }
  return null;
}

/**
 * タグから URL safe slug を生成（日本語そのまま encoded）
 */
export function tagToSlug(tag: string): string {
  return encodeURIComponent(tag);
}

export function slugToTag(slug: string): string {
  return decodeURIComponent(slug);
}

/**
 * sitemap で全タグの URL を出力するためのリスト
 */
export function allTagSlugs(): string[] {
  return allTags().map((t) => tagToSlug(t.tag));
}
