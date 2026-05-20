// GL diagnostic - matching logic
// 質問のタグから、出演作品のタグとのマッチ度を計算する。
//
// 改善版 (2026/05):
//   1. タグ表記揺れを吸収する alias マップを導入
//   2. クロスフィールド検索 — 質問カテゴリ以外のフィールドでも一致を探す
//   3. カテゴリ別 weight でスコアに重みづけ
//   4. マッチ理由を「カテゴリ別」に説明できる構造化メタデータを返す
//   5. 上位がスコア0になる場合のフォールバック表示

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
};

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

export function rankDramas(
  answers: Answers,
  questions: Question[],
  dramas: Drama[],
  limit = 5
): DramaScore[] {
  const userTagsByCategory = collectUserTags(answers, questions);

  const scored: DramaScore[] = dramas.map((d) => {
    let score = 0;
    const matchedSet = new Set<string>();
    const dramaTags = allDramaTags(d);

    for (const { category, tags: userTags } of userTagsByCategory) {
      const weight = CATEGORY_WEIGHT[category] ?? 1.0;
      const primary = PRIMARY_FIELD[category];

      for (const rawTag of userTags) {
        const variants = expand(rawTag);

        for (const v of variants) {
          // 主フィールドでの一致 → フルウェイト
          if (primary && (d.tags[primary] ?? []).includes(v)) {
            score += weight;
            matchedSet.add(v);
            break; // 同じユーザータグについては1回マッチで十分
          }
          // クロスフィールド一致 → ハーフウェイト（領域違いのため減点）
          const hit = dramaTags.find((dt) => dt.tag === v);
          if (hit) {
            score += weight * 0.5;
            matchedSet.add(v);
            break;
          }
        }
      }
    }

    return { drama: d, score, matched: Array.from(matchedSet) };
  });

  const positive = scored.filter((s) => s.score > 0);

  // 全員0スコアのケース：診断回答がドラマタグと全くマッチしなかった
  // この場合は「ユーザーが選んだジャンル相当」の作品を新しい順で返すフォールバック
  if (positive.length === 0) {
    const sorted = [...dramas].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    return sorted.slice(0, limit).map((d) => ({ drama: d, score: 0, matched: [] }));
  }

  return positive
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({
      ...s,
      // 表示用にスコアを整数化（小数だと見栄えが悪い）
      score: Math.round(s.score * 10) / 10,
    }));
}
