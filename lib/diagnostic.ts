// GL diagnostic - matching logic
// Compute drama match scores from user's answers

import type { Answers, Drama, Question } from "./types";

interface DramaScore {
  drama: Drama;
  score: number;
  matched: string[]; // tags that matched
}

const CATEGORY_TO_DRAMA_FIELD: Record<string, keyof Drama["tags"]> = {
  tone: "tone",
  relationship: "relationship",
  genre: "genre",
  intimacy: "intimacy",
  pacing: "pacing",
  production_quality: "production_quality",
};

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
    const matched: string[] = [];

    for (const { category, tags: userTags } of userTagsByCategory) {
      const field = CATEGORY_TO_DRAMA_FIELD[category];
      if (!field) continue;
      const dramaTags = d.tags[field] ?? [];

      for (const ut of userTags) {
        if (dramaTags.includes(ut)) {
          score += 1;
          matched.push(ut);
        }
      }
    }

    return { drama: d, score, matched };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
