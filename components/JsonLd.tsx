// JSON-LD 構造化データ用コンポーネント
// 検索エンジン向けの作品情報を埋め込む

import type { AnyDrama, Drama, Actress } from "@/lib/types";

const SITE_URL = "https://yurithai.jp";

interface TVSeriesData {
  drama: AnyDrama;
  actresses: Actress[];
}

/**
 * TVSeries / TVMiniSeries Schema を生成
 * @see https://schema.org/TVSeries
 */
export function buildTVSeriesJsonLd({ drama, actresses }: TVSeriesData) {
  const fullDrama =
    "tags" in drama && "review" in drama ? (drama as Drama) : null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: drama.title_ja,
    alternateName: [drama.title_en, drama.title_th].filter(Boolean),
    url: `${SITE_URL}/dramas/${drama.slug}`,
    inLanguage: "th",
    countryOfOrigin: { "@type": "Country", name: "Thailand" },
    genre: ["GL", "百合", "タイドラマ"],
  };

  if (fullDrama?.synopsis) {
    data.description = fullDrama.synopsis;
  }
  if (drama.production) {
    data.productionCompany = {
      "@type": "Organization",
      name: drama.production,
    };
  }
  if (fullDrama?.year) {
    data.datePublished = `${fullDrama.year}-01-01`;
  }
  if (fullDrama?.episodes) {
    data.numberOfEpisodes = fullDrama.episodes;
  }
  if (drama.cover_image) {
    data.image = `${SITE_URL}${drama.cover_image}`;
  }
  if (actresses.length > 0) {
    data.actor = actresses.map((a) => ({
      "@type": "Person",
      name: a.real_name,
      alternateName: [a.name_en, a.name_ja],
      url: a.instagram
        ? `https://instagram.com/${a.instagram}`
        : undefined,
    }));
  }

  return data;
}

/**
 * Person Schema を生成（女優個別ページ用）
 * @see https://schema.org/Person
 */
export function buildPersonJsonLd(actress: Actress, dramaTitles: string[]) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: actress.real_name,
    alternateName: [actress.name_en, actress.name_ja],
    url: `${SITE_URL}/cast/${actress.id}`,
    jobTitle: "Actress",
  };
  if (actress.birth_date) {
    data.birthDate = actress.birth_date;
  }
  if (actress.nationality) {
    data.nationality = { "@type": "Country", name: actress.nationality };
  }
  if (actress.height_cm) {
    data.height = {
      "@type": "QuantitativeValue",
      value: actress.height_cm,
      unitCode: "CMT",
    };
  }
  if (actress.agency) {
    data.affiliation = { "@type": "Organization", name: actress.agency };
  }
  if (actress.instagram) {
    data.sameAs = [`https://instagram.com/${actress.instagram}`];
  }
  if (dramaTitles.length > 0) {
    data.performerIn = dramaTitles.map((t) => ({
      "@type": "TVSeries",
      name: t,
    }));
  }
  return data;
}

/**
 * BreadcrumbList Schema
 */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * WebSite Schema（トップページ用）
 * - alternateName で「ユリタイ」「ゆりたい」「タイGL情報サイト」を併記
 * - potentialAction（SearchAction）で Google のサイトリンク検索ボックス対応
 * - publisher を Organization として明示
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YuriThai（ユリタイ）",
    alternateName: [
      "ユリタイ",
      "ゆりたい",
      "YuriThai",
      "タイGL情報サイト",
      "タイGLドラマガイド",
    ],
    url: SITE_URL,
    description:
      "YuriThai（ユリタイ）は、タイGL（タイ百合ドラマ）を日本語でまとめた情報サイト。タイGLの作品レビュー・配信先・女優・ペア・診断・聖地巡礼を網羅。",
    inLanguage: "ja",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "YuriThai",
      alternateName: ["ユリタイ", "ゆりたい"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Organization Schema
 * 「ユリタイ」「ゆりたい」のブランド名表記ゆれを検索エンジンに正確に伝える。
 * Knowledge Graph に運営エンティティとして登録されることを狙う。
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "YuriThai",
    alternateName: ["ユリタイ", "ゆりたい", "YuriThai（ユリタイ）"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-default.png`,
      width: 1200,
      height: 630,
    },
    description:
      "タイGL（タイ百合ドラマ）を日本語でまとめた情報メディア「YuriThai（ユリタイ）」の運営組織。",
    sameAs: [],
  };
}

/**
 * FAQPage Schema — トップページなどのFAQ用
 */
export function buildFaqJsonLd(
  items: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

/**
 * <script type="application/ld+json"> として埋め込むコンポーネント
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
