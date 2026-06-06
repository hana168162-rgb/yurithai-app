import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getActressById,
  allActressIds,
  getDramasForActress,
} from "@/lib/content";
import { JsonLd, buildPersonJsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";
import { gradientForSlug, nationalityFlags, agencyBadgeStyle } from "@/lib/style";

// 出演作品のステータスを最新化するため、1時間ごとに再生成
export const revalidate = 3600;

const SITE_URL = "https://yurithai.jp";

export function generateStaticParams() {
  return allActressIds().map((id) => ({ id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const actress = getActressById(params.id);
  if (!actress)
    return { title: "女優が見つかりません ｜ YuriThai（ユリタイ）" };

  const displayName = `${actress.name_en}（${actress.name_ja}）`;

  // SEO: タイトル先頭に「タイGL女優」を付けて、ジャンル + 個人名の組み合わせで
  // 「タイGL 女優 ◯◯」「タイGL ペア ◯◯」などの検索にヒットしやすくする。
  const title = `タイGL女優 ${displayName}｜${actress.real_name} プロフィール・出演作品 ｜ YuriThai（ユリタイ）`;

  const desc_parts = [
    `タイGL女優 ${displayName}（${actress.real_name}）`,
    actress.agency ? `所属: ${actress.agency}` : "",
    actress.nationality ? `国籍: ${actress.nationality}` : "",
    actress.birth_date ? `生年月日: ${actress.birth_date}` : "",
    "の詳細プロフィール・出演タイGLドラマ一覧を日本語で。",
  ].filter(Boolean);
  const description = desc_parts.join(" / ");

  return {
    title,
    description,
    keywords: [
      "タイGL",
      "タイGL女優",
      "タイGL ペア",
      "タイ女優",
      "タイドラマ 女優",
      "タイ百合",
      actress.name_en,
      actress.name_ja,
      actress.real_name,
      ...(actress.agency ? [actress.agency] : []),
      "YuriThai",
      "ユリタイ",
    ],
    alternates: { canonical: `${SITE_URL}/cast/${actress.id}` },
    openGraph: {
      title: `タイGL女優 ${displayName}｜YuriThai（ユリタイ）`,
      description,
      url: `${SITE_URL}/cast/${actress.id}`,
      siteName: "YuriThai（ユリタイ）",
      type: "profile",
      images: [
        {
          url: `${SITE_URL}/api/og/actress/${actress.id}`,
          width: 1200,
          height: 630,
          alt: `タイGL女優 ${displayName}（${actress.real_name}）`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `タイGL女優 ${displayName} ｜ YuriThai`,
      description,
      images: [`${SITE_URL}/api/og/actress/${actress.id}`],
    },
  };
}

export default function ActressDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const actress = getActressById(params.id);
  if (!actress) notFound();

  const dramaList = getDramasForActress(actress.id);
  const dramaTitles = dramaList.map((d) => d.title_ja);

  const personJsonLd = buildPersonJsonLd(actress, dramaTitles);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "女優", url: `${SITE_URL}/cast` },
    { name: actress.name_en, url: `${SITE_URL}/cast/${actress.id}` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/cast" className="hover:text-yuri-rose">
          女優
        </Link>
        <span className="mx-1.5">/</span>
        <span>{actress.name_en}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8 bg-yuri-cream border border-yuri-edge rounded-lg p-6">
        {/* SEO: 「タイGL女優」の eyebrow ラベル。h1 直上に置くことで
            ジャンル + 個人名が同じ <header> に揃い、検索インデックスに有利。 */}
        <p className="text-[11px] tracking-wider text-yuri-muted mb-1 uppercase">
          <Link href="/cast" className="hover:text-yuri-rose">
            タイGL女優
          </Link>
        </p>
        <p className="text-sm text-yuri-muted mb-0.5 leading-tight">
          {actress.name_ja}
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-yuri-ink mb-1 leading-tight">
          {actress.name_en}
        </h1>
        <p className="text-base text-yuri-muted mb-4">{actress.real_name}</p>

        <dl className="text-base grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
          {actress.birth_date && (
            <div className="flex">
              <dt className="w-20 text-yuri-muted shrink-0">生年月日</dt>
              <dd className="text-yuri-ink">
                {actress.birth_date}
                {actress.age !== null && (
                  <span className="text-yuri-muted ml-2">
                    （{actress.age}歳）
                  </span>
                )}
              </dd>
            </div>
          )}
          {actress.nationality && (
            <div className="flex">
              <dt className="w-20 text-yuri-muted shrink-0">国籍</dt>
              <dd className="text-yuri-ink">
                {nationalityFlags(actress.nationality) && (
                  <span className="mr-1" aria-hidden>
                    {nationalityFlags(actress.nationality)}
                  </span>
                )}
                {actress.nationality}
              </dd>
            </div>
          )}
          {actress.height_cm && (
            <div className="flex">
              <dt className="w-20 text-yuri-muted shrink-0">身長</dt>
              <dd className="text-yuri-ink">{actress.height_cm}cm</dd>
            </div>
          )}
          {actress.agency && (
            <div className="flex">
              <dt className="w-20 text-yuri-muted shrink-0">所属</dt>
              <dd>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: agencyBadgeStyle(actress.agency).bg,
                    color: agencyBadgeStyle(actress.agency).fg,
                  }}
                >
                  {actress.agency}
                </span>
              </dd>
            </div>
          )}
        </dl>

        {actress.instagram && (
          <a
            href={`https://instagram.com/${actress.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-yuri-pink text-yuri-navy text-sm hover:opacity-80"
          >
            <span aria-hidden>📷</span>
            Instagram @{actress.instagram}
          </a>
        )}
      </header>

      {/* 出演作品 */}
      <section>
        <h2 className="text-lg font-medium text-yuri-navy mb-3">
          出演作品（{dramaList.length}作品）
        </h2>
        {dramaList.length === 0 ? (
          <p className="text-sm text-yuri-muted bg-yuri-surface border border-yuri-edge rounded-lg p-4">
            出演作品の登録はまだありません。
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dramaList.map(({ drama }) => (
              <Link
                key={drama.slug}
                href={`/dramas/${drama.slug}`}
                className="block bg-yuri-surface rounded-lg overflow-hidden border border-yuri-edge hover:border-yuri-rose/40 transition-colors"
              >
                <div
                  className="aspect-[3/4] bg-cover bg-center"
                  style={
                    drama.cover_image
                      ? { backgroundImage: `url(${drama.cover_image})` }
                      : { background: gradientForSlug(drama.slug) }
                  }
                />
                <div className="p-2.5">
                  <p className="text-sm font-medium truncate">
                    {drama.title_ja}
                  </p>
                  <p className="text-[11px] text-yuri-muted mt-0.5">
                    {drama.status === "airing"
                      ? "放送中"
                      : drama.status === "upcoming"
                      ? "公開予定"
                      : "完結"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 補足 */}
      <p className="mt-8 text-[11px] text-yuri-muted">
        ※ プロフィール情報は thaiglhub.com など公開情報をもとに整理しています。
      </p>
    </div>
  );
}
