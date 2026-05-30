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

/**
 * 公開予定作品を「公開日が近い順」にソートして返す。
 * トップページと /dramas/upcoming で共通利用する。
 *   優先度 0: 具体的な公開日が判明（announced_for に "YYYY年MM月DD日"）→ 日付昇順
 *   優先度 1: 年/月のみ判明（"2026年内予定" 等）→ 文字列昇順
 *   優先度 2: 未発表 / pending → 末尾
 */
export function getUpcomingSortedByDate(): UpcomingDrama[] {
  const priority = (d: UpcomingDrama): [number, string] => {
    const a = d.announced_for || "";
    const m = a.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (m) {
      const [, y, mo, day] = m;
      return [0, `${y}-${mo.padStart(2, "0")}-${day.padStart(2, "0")}`];
    }
    if (d.pending || a === "未発表") return [2, a];
    return [1, a];
  };
  return [...upcoming].sort((a, b) => {
    const [pa, ka] = priority(a);
    const [pb, kb] = priority(b);
    if (pa !== pb) return pa - pb;
    return ka.localeCompare(kb);
  });
}
/**
 * birth_date から今日時点の満年齢を返す。形式エラー時は null。
 * JSON の age フィールドは経年で陳腐化するため、ビルド時に動的計算で上書きする。
 */
function calcAgeFromBirthDate(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < mo || (today.getMonth() + 1 === mo && today.getDate() < d)) {
    age -= 1;
  }
  return age;
}

export const actresses = (actressesData as unknown as Actress[]).map((a) => {
  const computed = calcAgeFromBirthDate(a.birth_date);
  return computed !== null ? { ...a, age: computed } : a;
});
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
  //    年表記などのサフィックスを除去した上で「完全一致」のみ採用する。
  //    例：filmography に "Us" がある女優を "The Secret of Us" にマッチさせない。
  const normalize = (t: string): string =>
    t.replace(/\s*\([^)]*\)\s*$/g, "").trim().toLowerCase();
  const fm = (actress.filmography ?? []).map(normalize);
  for (const w of allWorks) {
    if (seen.has(w.slug)) continue;
    const candidates = [w.title_ja, w.title_en]
      .filter(Boolean)
      .map((c) => normalize(c as string));
    if (fm.some((f) => candidates.includes(f))) {
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

// =============================================
//  トップページ「作品一覧」のローテーション
//  3日ごとに完結作品プールから決定論的にシャッフルし、N件を選ぶ。
//  ISR (revalidate=3600) と組み合わせると、3日窓を跨いだ最初の
//  再生成タイミングでラインナップが切り替わる。
// =============================================
const FEATURED_ROTATION_DAYS = 3;
const FEATURED_EPOCH_MS = Date.UTC(2026, 0, 1); // 2026-01-01 (UTC)

function featuredWindowIndex(): number {
  return Math.floor(
    (Date.now() - FEATURED_EPOCH_MS) /
      (FEATURED_ROTATION_DAYS * 24 * 60 * 60 * 1000)
  );
}

// 軽量な決定論的 RNG（Mulberry32）。
// 同じ seed なら毎回同じ乱数列を返すので、同じ窓内の再生成では結果が変わらない。
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 完結作品から、3日に1回シャッフルされる N 件を返す。
 * ピックアップが固定化せず、いろんな作品が回るようになる。
 */
export function getFeaturedCompletedDramas(limit = 6): Drama[] {
  // プールは完結作品全体。スラッグ順で安定ソートしてから seed シャッフル。
  const pool = [...getCompletedDramas()].sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );
  const rng = mulberry32(featuredWindowIndex() + 1);
  // Fisher-Yates shuffle（決定論的）
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, limit);
}

// =============================================
//  放送曜日ベースの「ピックアップ」優先ソート
// =============================================

/**
 * 日本語の曜日漢字 → 数値 (Sun=0, Mon=1, ..., Sat=6) マップ
 */
const DAY_OF_WEEK_JA: Record<string, number> = {
  日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6,
};

/**
 * note フィールドから「毎週X曜」を抽出して放送曜日を返す。
 * 見つからない場合は null。
 */
function getBroadcastDay(d: WatchingDrama): number | null {
  const note = d.note || "";
  const m = note.match(/毎週\s*(日|月|火|水|木|金|土)曜/);
  if (!m) return null;
  return DAY_OF_WEEK_JA[m[1]] ?? null;
}

/**
 * note フィールドから「HH:MM タイ時間」を抽出して放送開始時刻（タイ時間）を返す。
 * 見つからない場合は、その曜日のあいだ先頭をキープできるよう 23:59 を既定とする。
 */
function getBroadcastTime(d: WatchingDrama): { hour: number; minute: number } {
  const note = d.note || "";
  const m = note.match(/(\d{1,2}):(\d{2})\s*タイ時間/);
  if (m) {
    return { hour: Number(m[1]), minute: Number(m[2]) };
  }
  return { hour: 23, minute: 59 };
}

/**
 * 「次の放送が最も近い作品」を先頭にするためのソートキー。
 * = 現在（タイ時間）から次回放送までの「分数」。小さいほど先頭。
 *
 * 仕様（ユーザーリクエスト）:
 *   放送時刻を過ぎるまでは、その作品を常に先頭にキープする。
 *   例）金曜夜放送の Hometown Romance は、金曜の放送が終わるまで先頭。
 *       放送が過ぎてから、次に近い土曜夜放送の The Air が先頭に上がる。
 *
 * 放送曜日が抽出できない作品は末尾（大きな値）に。
 */
function pickupSortKey(d: WatchingDrama, now: BangkokNow): number {
  const bd = getBroadcastDay(d);
  if (bd === null) return Number.MAX_SAFE_INTEGER;
  const { hour, minute } = getBroadcastTime(d);

  const WEEK_MIN = 7 * 24 * 60;
  const nowMin = now.dow * 24 * 60 + now.hour * 60 + now.minute;
  const bcMin = bd * 24 * 60 + hour * 60 + minute;

  // 次回放送までの分数（1週間内に正規化）。
  // 0 は「ちょうど今が放送時刻」を意味し最優先。
  // 放送時刻を過ぎた直後は約1週間後の値になり、自動的に末尾側へ移動する。
  return ((bcMin - nowMin) % WEEK_MIN + WEEK_MIN) % WEEK_MIN;
}

interface BangkokNow {
  dow: number; // 0=Sun..6=Sat
  hour: number;
  minute: number;
}

/**
 * Asia/Bangkok タイムゾーンでの現在「曜日・時・分」を取得する。
 * watching の note にある放送日時はタイ時間基準なので、ソートもタイ時間で行う。
 */
function getBangkokNow(): BangkokNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const dowMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  // hour は 24時制。"24" になるケースを 0 に正規化。
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  return {
    dow: dowMap[get("weekday")] ?? 0,
    hour,
    minute: Number(get("minute")) || 0,
  };
}

/**
 * トップページの「ピックアップ」セクション用。
 * 放送中作品を「次回放送が近い順」に並べる。
 * 放送時刻を過ぎるまでは先頭をキープし、過ぎたら次に近い作品が先頭へ。
 * ビルド時の日時ベースなので、ISR (revalidate) と組み合わせて使う。
 */
export function getCurrentPickup(): WatchingDrama[] {
  const now = getBangkokNow();
  return [...getActiveWatching()]
    .sort((a, b) => pickupSortKey(a, now) - pickupSortKey(b, now))
    .slice(0, 4);
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
