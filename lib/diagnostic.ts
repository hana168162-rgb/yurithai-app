// GL diagnostic - matching logic
// 質問のタグから、出演作品のタグとのマッチ度を計算する。
//
// 改善版 (2026/05):
//   1. タグ表記揺れを吸収する alias マップを導入
//   2. クロスフィールド検索 — 質問カテゴリ以外のフィールドでも一致を探す
//   3. カテゴリ別 weight でスコアに重みづけ
//   4. マッチ理由を「カテゴリ別」に説明できる構造化メタデータを返す
//   5. 上位がスコア0になる場合のフォールバック表示
//
// 強化版 (2026/11):
//   6. cast カテゴリ：cast_pair / production をスコア対象に
//   7. negative カテゴリ：一致した作品に大幅ペナルティ
//   8. 新作マイルドブースト（2025-2026 作品に +10%）
//   9. 多様性フィルター：Top5 が同じペア / 事務所に偏らないよう最大2作
//  10. セレンディピティ枠：Top5 の末尾1枠は上位20位以内から異系統を混ぜる

import type { Answers, Drama, Question } from "./types";

interface DramaScore {
  drama: Drama;
  score: number;
  matched: string[]; // 表示用に最大数件
}

/** 質問カテゴリ → ドラマタグの主フィールド（優先的にスコア加算） */
const PRIMARY_FIELD: Record<string, keyof Drama["tags"]> = {
  tone: "tone",
  relationship: "relationship",
  genre: "genre",
  intimacy: "intimacy",
  pacing: "pacing",
  production_quality: "production_quality",
};

/** カテゴリ別の重み（マッチ度に影響） */
const CATEGORY_WEIGHT: Record<string, number> = {
  tone: 1.5,
  intimacy: 1.5,
  genre: 1.2,
  relationship: 1.2,
  pacing: 0.8,
  production_quality: 0.6,
  cast: 1.8,       // ペア/事務所の好みは強い意思表示
  negative: 0,     // ペナルティは別途計算するためここでは0
};

/** negative カテゴリでヒットした場合のペナルティ（1タグあたり） */
const NEGATIVE_PENALTY = 3.0;

/** 新作ブースト対象の起点年 */
const FRESH_YEAR_THRESHOLD = 2025;
const FRESH_BOOST_MULTIPLIER = 1.10;

/** 多様性フィルター：同一 cast_pair / production の最大件数 */
const DIVERSITY_MAX_PER_GROUP = 2;

/**
 * ユーザー選択タグと、ドラマ側タグの表記揺れを吸収するための alias マップ。
 * キー: 質問オプションで使われるタグ
 * 値:   ドラマ側で同義とみなすタグ群（複数可）
 */
const TAG_ALIASES: Record<string, string[]> = {
  // genre 系
  "校園もの": ["校園", "校園GL"],
  "ファンタジー・SF": ["ファンタジー", "ファンタジック", "SF"],
  "オフィス・社会人": ["オフィスロマンス", "企業"],
  "業界もの": ["業界もの", "医療", "芸能", "建築", "ペーガント", "捜査もの", "刑務所もの"],
  "時代劇・ピリオド": ["時代劇"],
  "日常系": ["日常系", "ロマンス"],

  // relationship 系
  "先輩×後輩": ["先輩後輩", "恋する後輩"],
  "上司×部下": ["上司×部下", "同僚"],
  "再会もの": ["再会もの", "再起の恋", "元友人", "元恋人"],
  "幼馴染": ["幼馴染", "元同級生"],
  "ライバル→恋人": ["ライバル→恋人", "ライバル", "敵対から恋へ"],
  "三角関係": ["三角関係", "禁断の恋"],

  // tone 系（質問のtoneカテゴリでも、これらは実際にはpacingやrelationshipにあることが多い）
  "ほっこり": ["ほっこり"],
  "切ない": ["切ない"],
  "シリアス": ["シリアス", "重め", "ダーク"],
  "ドラマチック": ["ドラマチック", "メロドラマ"],
  "王道ロマンス": ["王道ロマンス", "ロマンチック"],
  "コメディタッチ": ["コメディ", "ロマンチックコメディ"],
  "山あり谷あり": ["山あり谷あり"],

  // intimacy 系
  "プラトニック": ["プラトニック", "ライトなスキンシップ"],
  "ライトなスキンシップ": ["ライトなスキンシップ"],
  "キス多め": ["キス多め"],
  "濃厚描写あり": ["濃厚描写あり", "情熱的"],
  "18+シーンあり": ["18+シーンあり", "情熱的", "濃厚描写あり"],

  // pacing 系
  "スロウバーン": ["スロウバーン"],
  "早展開": ["早展開"],
  "短編サクッと": ["早展開"],
};

/** alias マップを経由して、ユーザーのタグが「実質的に同じ」とみなすタグ集合を返す */
function expand(tag: string): string[] {
  const aliases = TAG_ALIASES[tag];
  if (aliases) return [tag, ...aliases];
  return [tag];
}

/** ドラマの全タグフィールドを横断してフラットなタグ集合を返す（クロスフィールド検索用） */
function allDramaTags(d: Drama): { tag: string; field: keyof Drama["tags"] }[] {
  const out: { tag: string; field: keyof Drama["tags"] }[] = [];
  const tags = d.tags ?? ({} as Drama["tags"]);
  for (const k of Object.keys(tags) as (keyof Drama["tags"])[]) {
    const arr = tags[k] ?? [];
    for (const t of arr) out.push({ tag: t, field: k });
  }
  return out;
}

export function collectUserTags(
  answers: Answers,
  questions: Question[]
): { category: string; tags: string[] }[] {
  const out: { category: string; tags: string[] }[] = [];
  for (const q of questions) {
    const picked = answers[q.id] ?? [];
    const tags: string[] = [];
    for (const optId of picked) {
      const opt = q.options.find((o) => o.id === optId);
      if (opt) tags.push(...opt.tags);
    }
    out.push({ category: q.category, tags });
  }
  return out;
}

/**
 * 初心者向け王道ラインのおすすめ作品（slug）。
 * 「こだわらない」が多いユーザー、または診断結果が0スコアになるユーザーに、
 * タイGLの代表作を順番に提示する。
 */
const BEGINNER_FALLBACK_SLUGS = [
  "gap",               // FreenBecky — タイGLの原点
  "23-5",              // MilkLove — 校園・ほっこり
  "the-secret-of-us",  // LingOrm — 大人のメロドラマ
  "pluto",             // NamtanFilm — 演技派の名作
  "affair",            // LMSY — 再会もの
  "us",                // EmiBonnie — 日常系
  "the-loyal-pin",     // FreenBecky — 時代劇GL
];

function pickBeginnerLineup(dramas: Drama[], limit: number): DramaScore[] {
  const bySlug = new Map(dramas.map((d) => [d.slug, d]));
  const picked: DramaScore[] = [];
  for (const slug of BEGINNER_FALLBACK_SLUGS) {
    const d = bySlug.get(slug);
    if (d) picked.push({ drama: d, score: 0, matched: ["王道ライン"] });
    if (picked.length >= limit) break;
  }
  // 万一足りなければ年代順で埋める
  if (picked.length < limit) {
    const used = new Set(picked.map((p) => p.drama.slug));
    const rest = [...dramas]
      .filter((d) => !used.has(d.slug))
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    for (const d of rest) {
      picked.push({ drama: d, score: 0, matched: [] });
      if (picked.length >= limit) break;
    }
  }
  return picked.slice(0, limit);
}

/** cast タグ（ペア名 or 制作会社名）とドラマの cast_pair / production を照合 */
function matchesCast(d: Drama, userTag: string): "pair" | "production" | null {
  const u = userTag.toLowerCase();
  if (d.cast_pair && d.cast_pair.toLowerCase().includes(u)) return "pair";
  if (d.production && d.production.toLowerCase().includes(u)) return "production";
  return null;
}

/** Top5 を同じペア・事務所に偏らせないよう調整 */
function applyDiversity(ranked: DramaScore[], limit: number): DramaScore[] {
  const picked: DramaScore[] = [];
  const pairCount = new Map<string, number>();
  const prodCount = new Map<string, number>();
  const overflow: DramaScore[] = [];

  for (const item of ranked) {
    const pairKey = item.drama.cast_pair || "__nopair__";
    const prodKey = item.drama.production || "__noprod__";
    const pc = pairCount.get(pairKey) ?? 0;
    const dc = prodCount.get(prodKey) ?? 0;
    if (pc >= DIVERSITY_MAX_PER_GROUP || dc >= DIVERSITY_MAX_PER_GROUP) {
      overflow.push(item);
      continue;
    }
    picked.push(item);
    pairCount.set(pairKey, pc + 1);
    prodCount.set(prodKey, dc + 1);
    if (picked.length >= limit) break;
  }

  // 多様性フィルターで埋まらなかった場合、オーバーフローから補充
  if (picked.length < limit) {
    for (const item of overflow) {
      picked.push(item);
      if (picked.length >= limit) break;
    }
  }
  return picked;
}

/** セレンディピティ：Top(limit) の最後の枠を、上位範囲から異系統の一作に差し替え */
function injectSerendipity(
  topPicks: DramaScore[],
  allScored: DramaScore[],
  limit: number
): DramaScore[] {
  if (topPicks.length < limit) return topPicks;

  // 上位範囲（limit*4 まで）から、Top1 と異なる tone/genre の作品を選ぶ
  const candidates = allScored.slice(limit, limit * 4);
  if (candidates.length === 0) return topPicks;

  const top1 = topPicks[0];
  const top1Tones = new Set((top1.drama.tags?.tone ?? []).map((t) => t));
  const top1Genres = new Set((top1.drama.tags?.genre ?? []).map((t) => t));
  const alreadyPicked = new Set(topPicks.map((p) => p.drama.slug));

  const different = candidates.filter((c) => {
    if (alreadyPicked.has(c.drama.slug)) return false;
    const cTones = c.drama.tags?.tone ?? [];
    const cGenres = c.drama.tags?.genre ?? [];
    const toneOverlap = cTones.some((t) => top1Tones.has(t));
    const genreOverlap = cGenres.some((g) => top1Genres.has(g));
    return !toneOverlap && !genreOverlap; // 両方違う系統
  });

  if (different.length === 0) return topPicks;

  // 決定論的に1つ選ぶ（時間依存性を避けるためランダムではなく上位順）
  const serendipity = different[0];
  const result = [...topPicks.slice(0, limit - 1), serendipity];
  return result;
}

export function rankDramas(
  answers: Answers,
  questions: Question[],
  dramas: Drama[],
  limit = 5
): DramaScore[] {
  const userTagsByCategory = collectUserTags(answers, questions);

  // negative カテゴリは別扱い
  const negativeTags = new Set<string>();
  for (const { category, tags } of userTagsByCategory) {
    if (category === "negative") {
      for (const t of tags) for (const v of expand(t)) negativeTags.add(v);
    }
  }

  // 「こだわらない」（タグなし）の質問数を数える（negative は除外）
  const nonNegativeCats = userTagsByCategory.filter((c) => c.category !== "negative");
  const totalQuestions = nonNegativeCats.length;
  const emptyAnswers = nonNegativeCats.filter((c) => c.tags.length === 0).length;

  // 質問の半数以上が「こだわらない」→ 初心者向け王道ライン
  if (totalQuestions > 0 && emptyAnswers / totalQuestions >= 0.5) {
    return pickBeginnerLineup(dramas, limit);
  }

  const scored: DramaScore[] = dramas.map((d) => {
    let score = 0;
    const matchedSet = new Set<string>();
    const dramaTags = allDramaTags(d);

    for (const { category, tags: userTags } of userTagsByCategory) {
      if (category === "negative") continue; // 後で一括ペナルティ
      const weight = CATEGORY_WEIGHT[category] ?? 1.0;
      const primary = PRIMARY_FIELD[category];

      for (const rawTag of userTags) {
        const variants = expand(rawTag);

        for (const v of variants) {
          // cast カテゴリ：cast_pair / production を直接チェック
          if (category === "cast") {
            const castHit = matchesCast(d, v);
            if (castHit === "pair") {
              score += weight; // ペア完全一致
              matchedSet.add(v);
              break;
            }
            if (castHit === "production") {
              score += weight * 0.7; // 事務所一致（ペアよりやや弱い）
              matchedSet.add(v);
              break;
            }
            continue; // cast ではタグ領域を見ない
          }

          // 通常カテゴリ：タグフィールドをチェック
          // 主フィールドでの一致 → フルウェイト
          if (primary && (d.tags[primary] ?? []).includes(v)) {
            score += weight;
            matchedSet.add(v);
            break;
          }
          // クロスフィールド一致 → ハーフウェイト
          const hit = dramaTags.find((dt) => dt.tag === v);
          if (hit) {
            score += weight * 0.5;
            matchedSet.add(v);
            break;
          }
        }
      }
    }

    // ペナルティ: negative タグが作品の任意フィールドに含まれていたら減点
    for (const neg of negativeTags) {
      const hit = dramaTags.find((dt) => dt.tag === neg);
      if (hit) {
        score -= NEGATIVE_PENALTY;
        matchedSet.add(`−${neg}`);
      }
    }

    // 新作マイルドブースト
    if (d.year && d.year >= FRESH_YEAR_THRESHOLD && score > 0) {
      score *= FRESH_BOOST_MULTIPLIER;
    }

    return { drama: d, score, matched: Array.from(matchedSet) };
  });

  const positive = scored.filter((s) => s.score > 0);

  // 全員0以下のケース：診断回答がドラマタグと全くマッチしなかった
  if (positive.length === 0) {
    return pickBeginnerLineup(dramas, limit);
  }

  const sorted = positive.sort((a, b) => b.score - a.score);

  // 多様性フィルター適用
  const diversified = applyDiversity(sorted, limit);

  // セレンディピティ枠を差し込む
  const withSerendipity = injectSerendipity(diversified, sorted, limit);

  return withSerendipity.map((s) => ({
    ...s,
    score: Math.round(s.score * 10) / 10,
  }));
}
