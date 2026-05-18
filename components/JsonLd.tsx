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
      alternateName: a.name_ja,
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
    alternateName: actress.name_ja,
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
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YuriThai（ユリタイ）",
    alternateName: "ユリタイ",
    url: SITE_URL,
    description:
      "日本人のためのタイGLドラマ情報プラットフォーム。レビュー・配信先・女優情報を日本語で。",
    inLanguage: "ja",
    publisher: {
      "@type": "Organization",
      name: "YuriThai",
      url: SITE_URL,
    },
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
