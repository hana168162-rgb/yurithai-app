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

export interface StreamingLink {
  platform: string;          // "YouTube" | "Netflix" | "TELASA" | "iQIYI" | "RakutenTV" | "WeTV" | "Viu" など
  url: string;               // 公式作品ページ or YouTube 1話のURL
  note?: string | null;      // 例: "VPN必要", "1話のみ無料", "字幕あり" など
}

export interface Drama {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string;
  title_th: string | null;
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
  streaming?: StreamingLink[];      // 配信先（日本から視聴可能なものを優先）
}

export interface WatchingDrama {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string;
  title_th: string | null;
  production: string | null;
  cast_pair: string | null;
  status: DramaStatus;
  note: string;
  cover_image: string | null;
  cover_credit: string | null;
  youtube_teaser: string | null;
  streaming?: StreamingLink[];      // 配信先
  end_date?: string | null;         // 最終話放送日（"YYYY-MM-DD"）。これを過ぎたら自動的に完結扱いに
  episodes?: number | null;          // 全話数（StatusBadge "N話完結" 表示用）
}

export type AnyDrama = Drama | WatchingDrama | UpcomingDrama;

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
  streaming?: StreamingLink[];      // 配信先（決定後）
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

export interface Actress {
  id: string;
  name_ja: string;
  real_name: string;            // 本名（例：Sarocha "Freen" Chankimha）
  birth_date: string | null;    // 生年月日（例：1998-08-08）
  age: number | null;            // 年齢
  nationality: string | null;   // 国籍（例：Thai, Thai-British）
  height_cm: number | null;     // 身長 cm
  filmography: string[];        // 出演作品
  agency: string | null;        // 所属
  instagram: string | null;
  notes?: string | null;        // 補足情報（例：元BNK48、ハーフ、特技 等）
}

// =============================================
//  Events
// =============================================
export type EventCategory =
  | "fan-meeting"  // ファンミーティング
  | "concert"      // コンサート・ライブ
  | "premiere"     // プレミア・上映会
  | "press"        // 記者会見・プレス発表
  | "release"      // リリースイベント
  | "fashion"      // ファッションイベント
  | "other";       // その他

export interface GLEvent {
  id: string;                  // ユニークID（slug風）
  title: string;               // 例: "FreenBecky Fan Meeting in Tokyo"
  title_th?: string | null;    // タイ語タイトル
  date: string;                // 開始日 "YYYY-MM-DD"
  end_date?: string | null;    // 複数日の場合の終了日
  time?: string | null;        // 例: "18:00" / "13:00 / 18:00（2回公演）"
  venue?: string | null;       // 会場名
  city?: string | null;        // 都市
  country?: string | null;     // "日本" / "タイ" 等
  category: EventCategory;
  pair?: string | null;        // pairs.json のキー（例: "FreenBecky"）
  agency?: string | null;      // 主催/関連事務所
  description?: string | null;
  link?: string | null;        // 公式URL
  cover_image?: string | null;
}
