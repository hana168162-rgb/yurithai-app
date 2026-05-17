// YuriThai TypeScript types

export type DramaStatus = "completed" | "airing" | "upcoming" | "unknown";

export interface DramaTags {
  genre: string[];
  relationship: string[];
  tone: string[];
  pacing: string[];
  intimacy: string[];
  production_quality: string[];
  warnings: string[];
}

export interface DramaReview {
  highlights: string[];
  recommend_for: string[];
  caution_for: string[];
  body_ja: string;
  reviewer: string;
}

export interface Drama {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string;
  year: number | null;
  production: string | null;
  episodes: number | null;
  status: DramaStatus;
  age_rating: string | null;
  cast_pair: string | null;
  tags: DramaTags;
  synopsis: string;
  review: DramaReview;
  confidence: string;
  note: string;
  cover_gradient: string | null;
  cover_image: string | null;       // 例: "/images/dramas/gap.jpg"
  cover_credit: string | null;      // 出典明記用 例: "© IDOLFACTORY @idolfactoryth"
  instagram_post: string | null;    // 詳細ページ埋め込み用
  youtube_teaser: string | null;    // 例: "https://www.youtube.com/watch?v=XXXX" or ID "XXXX"
}

export interface WatchingDrama {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string;
  production: string | null;
  cast_pair: string | null;
  status: DramaStatus;
  note: string;
  cover_image: string | null;
  cover_credit: string | null;
}

export interface UpcomingDrama {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string;
  title_th: string | null;
  production: string | null;
  cast_pair: string | null;
  status: "upcoming";
  announced_for: string | null;     // 例: "2026年内予定", "未発表"
  note: string;
  cover_image: string | null;
  cover_credit: string | null;
  youtube_teaser: string | null;
}

export interface Company {
  name: string;
  description: string;
  talents_works: string;
}

export type Taxonomy = {
  [K in keyof DramaTags]: string[];
};

export type QuestionCategory =
  | "tone"
  | "relationship"
  | "genre"
  | "intimacy"
  | "pacing"
  | "production_quality";

export interface QuestionOption {
  id: string;
  label_ja: string;
  tags: string[];
}

export interface Question {
  id: string;
  order: number;
  question_ja: string;
  category: QuestionCategory;
  type: "single" | "multi";
  options: QuestionOption[];
}

export interface QuestionsFile {
  questions: Question[];
}

export type Answers = Record<string, string[]>; // questionId -> optionIds

export interface ActressSocial {
  instagram: string | null;
  x: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface Actress {
  id: string;
  name_ja: string;
  name_en: string;
  agency: string | null;
  height_cm: number | null;
  birthplace: string | null;
  mixed_heritage: string | null;
  social: ActressSocial;
}
