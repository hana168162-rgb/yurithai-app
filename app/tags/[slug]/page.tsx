import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  allTagSlugs,
  slugToTag,
  getDramasByTag,
  getCategoryForTag,
  TAG_CATEGORY_LABELS,
} from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";

const SITE_URL = "https://yurithai.jp";

// 静的生成のセーフリスト。ビルド時に主要タグを事前生成しておく。
export function generateStaticParams() {
  return allTagSlugs().map((slug) => ({ slug }));
}

// generateStaticParams に含まれない slug が来ても、
// ランタイムで動的に生成して 200 を返す（404 防止）。
export const dynamicParams = true;
// 念のため revalidate も指定（1日キャッシュ）
export const revalidate = 86400;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tag = slugToTag(params.slug);
  const cat = getCategoryForTag(tag);
  const dramas = getDramasByTag(tag);

  if (dramas.length === 0) {
    return { title: `「${tag}」のタイGLドラマ` };
  }

  const categoryLabel = cat ? TAG_CATEGORY_LABELS[cat] : "";
  const title = `「${tag}」のタイGLドラマ一覧（${dramas.length}作品）`;
  const description = `${categoryLabel ? `[${categoryLabel}] ` : ""}「${tag}」タグのタイGLドラマ全${dramas.length}作品を一覧で。${dramas.slice(0, 5).map((d) => d.title_ja).join(" / ")}${dramas.length > 5 ? " など" : ""}を日本語で紹介。`;

  return {
    title,
    description,
    keywords: ["タイGL", "タイドラマ", tag, categoryLabel, "百合"].filter(
      Boolean
    ),
    alternates: { canonical: `${SITE_URL}/tags/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tags/${params.slug}`,
      type: "website",
      siteName: "YuriThai",
    },
  };
}

export default function TagDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tag = slugToTag(params.slug);
  const dramas = getDramasByTag(tag);

  if (dramas.length === 0) notFound();

  const cat = getCategoryForTag(tag);
  const categoryLabel = cat ? TAG_CATEGORY_LABELS[cat] : "";

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "タグ", url: `${SITE_URL}/tags` },
    { name: tag, url: `${SITE_URL}/tags/${params.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
      <JsonLd data={breadcrumbData} />

      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/tags" className="hover:text-yuri-rose">
          タグ
        </Link>
        <span className="mx-1.5">/</span>
        <span>{tag}</span>
      </nav>

      <header className="mb-6">
        {categoryLabel && (
          <p className="text-[11px] text-yuri-muted tracking-wider mb-1">
            {categoryLabel}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          {tag}
        </h1>
        <p className="text-sm text-yuri-muted">{dramas.length}作品</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {dramas
          .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
          .map((d) => (
            <DramaCard key={d.slug} drama={d} />
          ))}
      </div>
    </div>
  );
}
