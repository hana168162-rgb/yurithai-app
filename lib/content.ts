// Content loader - reads JSON files at build time

import dramasData from "@/content/dramas.json";
import watchingData from "@/content/watching.json";
import upcomingData from "@/content/upcoming.json";
import actressesData from "@/content/actresses.json";
import pairsData from "@/content/pairs.json";
import companiesData from "@/content/companies.json";
import taxonomyData from "@/content/taxonomy.json";
import questionsData from "@/content/diagnostic/questions.json";
import eventsData from "@/content/events.json";
import type {
  Drama,
  WatchingDrama,
  UpcomingDrama,
  AnyDrama,
  Actress,
  Company,
  Taxonomy,
  QuestionsFile,
  GLEvent,
} from "./types";

export const dramas = dramasData as unknown as Drama[];
export const watching = watchingData as unknown as WatchingDrama[];

// `pending: true` の作品は一覧上で末尾にまわす。
// 公式が放送日程・キャストをペンディング扱いの作品が、確定作品より上に出てしまうのを防ぐ。
const upcomingRaw = upcomingData as unknown as UpcomingDrama[];
export const upcoming: UpcomingDrama[] = [
  ...upcomingRaw.filter((d) => !d.pending),
  ...upcomingRaw.filter((d) => d.pending),
];
export const actresses = actressesData as unknown as Actress[];
export const companies = companiesData as unknown as Company[];
export const taxonomy = taxonomyData as unknown as Taxonomy;
export const questionsFile = questionsData as unknown as QuestionsFile;
export const events = eventsData as unknown as GLEvent[];

// =============================================
//  Event helpers
// =============================================

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  "fan-meeting": "ファンミ",
  concert: "コンサート",
  premiere: "プレミア",
  press: "プレス",
  release: "リリース",
  fashion: "ファッション",
  other: "その他",
};

/**
 * 未来イベント（本日以降）/ 過去イベントを分けて返す
 */
export function getUpcomingEvents(): GLEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(): GLEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 全イベントから絞り込み用のオプションを抽出
 */
export function getEventFilterOptions() {
  const pairs = new Set<string>();
  const agencies = new Set<string>();
  for (const e of events) {
    if (e.pair) pairs.add(e.pair);
    if (e.agency) agencies.add(e.agency);
  }
  return {
    pairs: Array.from(pairs).sort(),
    agencies: Array.from(agencies).sort(),
  };
}

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
  return getActiveWatching().slice(0, 4);
}

// =============================================
//  end_date によるステータス判定
// =============================================

/**
 * end_date が過去（または本日含む過去）かどうか
 * end_date が無い場合は false（放送中扱い）
 */
export function hasEnded(d: WatchingDrama): boolean {
  if (!d.end_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(d.end_date);
  if (Number.isNaN(endDate.getTime())) return false;
  return endDate < today;
}

/**
 * 放送中の watching 作品（end_date 未到来 or 不明）
 */
export function getActiveWatching(): WatchingDrama[] {
  return watching.filter((d) => !hasEnded(d));
}

/**
 * 既に最終話放送日が過ぎた watching 作品（自動完結扱い）
 */
export function getRecentlyEndedWatching(): WatchingDrama[] {
  return watching.filter((d) => hasEnded(d));
}

// =============================================
//  Related dramas
// =============================================

export interface RelatedGroup {
  label: string;
  reason: string;
  dramas: AnyDrama[];
}

/**
 * 関連作品を3つのグループで返す
 * 1) 同じペア（cast_pair に含まれるペア名で逆引き）
 * 2) 同じ制作会社/シリーズ
 * 3) 同じジャンルの作品（フォールバック）
 */
export function getRelatedDramas(current: AnyDrama, limit = 4): RelatedGroup[] {
  const all = [...dramas, ...watching, ...upcoming].filter(
    (d) => d.slug !== current.slug
  );
  const groups: RelatedGroup[] = [];
  const used = new Set<string>([current.slug]);

  // 1) 同じペア
  const currentPair = extractPairName(current.cast_pair);
  const pairsObj = pairsData as Record<string, string[]>;
  const knownPairs = Object.keys(pairsObj);
  const currentPairNames = currentPair
    ? [currentPair]
    : knownPairs.filter((p) =>
        (current.cast_pair ?? "").includes(p)
      );

  if (currentPairNames.length > 0) {
    const samePair = all.filter((d) =>
      currentPairNames.some((p) => (d.cast_pair ?? "").includes(p))
    );
    if (samePair.length > 0) {
      groups.push({
        label: "同じペアの他作品",
        reason: currentPairNames.join(" / "),
        dramas: samePair.slice(0, limit),
      });
      samePair.forEach((d) => used.add(d.slug));
    }
  }

  // 2) 同じ制作会社（部分一致）
  if (current.production) {
    const studios = current.production.split(/\s*[×x]\s*|\s*\/\s*/);
    const sameStudio = all.filter((d) => {
      if (used.has(d.slug)) return false;
      if (!d.production) return false;
      return studios.some((s) => s && d.production!.includes(s));
    });
    if (sameStudio.length > 0) {
      groups.push({
        label: "同じ制作・シリーズ",
        reason: current.production,
        dramas: sameStudio.slice(0, limit),
      });
      sameStudio.forEach((d) => used.add(d.slug));
    }
  }

  // 3) 同じジャンル（完結作品のみ）
  const currentFull =
    "tags" in current && "review" in current ? (current as Drama) : null;
  if (currentFull && currentFull.tags) {
    const myGenres = currentFull.tags.genre ?? [];
    const myTones = currentFull.tags.tone ?? [];
    const sameGenre = dramas.filter((d) => {
      if (used.has(d.slug)) return false;
      const gs = d.tags?.genre ?? [];
      const ts = d.tags?.tone ?? [];
      return (
        myGenres.some((g) => gs.includes(g)) ||
        myTones.some((t) => ts.includes(t))
      );
    });
    if (sameGenre.length > 0) {
      groups.push({
        label: "似た雰囲気の作品",
        reason: [...myGenres.slice(0, 1), ...myTones.slice(0, 1)].join(" / "),
        dramas: sameGenre.slice(0, limit),
      });
    }
  }

  return groups;
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
      const tagsInCat = d.tags[cat] ?? [];
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
    if (dramas.some((d) => d.tags?.[cat]?.includes(tag))) {
      return cat;
    }
  }
  return null;
}

/**
 * タグから URL safe slug を生成（日本語そのまま encoded）
 * 長すぎる場合（>120バイト）は短縮 + ハッシュで衝突回避
 */
const SLUG_BYTE_LIMIT = 120;

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

/**
 * タグをURLスラッグに変換。
 * Next.js App Router では params.slug が URL エンコード形のまま渡るケースがあるため、
 * tagToSlug は encodeURIComponent 済みの値を返し、ルートと整合させる。
 *
 * 長すぎる場合（>120バイト）はファイルシステム制限回避のためハッシュ化。
 */
export function tagToSlug(tag: string): string {
  const enc = encodeURIComponent(tag);
  if (enc.length <= SLUG_BYTE_LIMIT) return enc;
  return `_h_${simpleHash(tag)}`;
}

/**
 * slug → tag への逆変換。
 * params.slug が URL エンコードされて来ても、URL デコード済みでも、両方対応する。
 */
export function slugToTag(slug: string): string {
  // ハッシュ形式の場合は全タグから逆引き
  if (slug.startsWith("_h_")) {
    for (const t of allTags()) {
      if (tagToSlug(t.tag) === slug) return t.tag;
    }
    return slug; // 該当なし
  }
  // %xx を含むかで分岐
  try {
    return decodeURIComponent(slug);
  } catch {
    // 不正なエスケープシーケンスがある場合はそのまま返す
    return slug;
  }
}

/**
 * sitemap で全タグの URL を出力するためのリスト
 * 同じタグが複数カテゴリに存在する可能性があるため Set で重複排除
 */
export function allTagSlugs(): string[] {
  const set = new Set<string>();
  for (const t of allTags()) {
    set.add(tagToSlug(t.tag));
  }
  return Array.from(set);
}

/**
 * 作品ごとの聖地巡礼ブログ記事スラッグ。
 * 作品詳細ページからこのマップを参照し、該当記事がなければ一般ガイドへフォールバック。
 */
const PILGRIMAGE_BLOG_SLUGS: Record<string, string> = {
  gap: "pilgrimage-gap",
  "the-loyal-pin": "pilgrimage-the-loyal-pin",
  pluto: "pilgrimage-pluto",
  "23-5": "pilgrimage-23-5",
  affair: "pilgrimage-affair",
  us: "pilgrimage-us",
  "dangerous-queen": "pilgrimage-dangerous-queen",
  "poisonous-love": "pilgrimage-poisonous-love",
};

export function pilgrimageBlogSlugForDrama(slug: string): string | null {
  return PILGRIMAGE_BLOG_SLUGS[slug] ?? null;
}
