import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getBlogPostBySlug,
  allBlogSlugs,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";
import { BlogReadNext } from "@/components/BlogReadNext";

const SITE_URL = "https://yurithai.jp";

export function generateStaticParams() {
  return allBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: "記事が見つかりません" };

  return {
    title: post.title,
    description: post.description,
    keywords: ["タイGL", "タイドラマ", ...post.tags],
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      siteName: "YuriThai",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function buildArticleJsonLd(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "YuriThai" },
    publisher: { "@type": "Organization", name: "YuriThai" },
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "ja",
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedBlogPosts(post.slug, 4);
  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ブログ", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-yuri-rose">
          ブログ
        </Link>
        <span className="mx-1.5">/</span>
        <span className="truncate">{post.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <p className="text-[11px] text-yuri-muted mb-2">
            {formatDate(post.date)}
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink leading-tight mb-3">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-sm text-yuri-ink/80 leading-relaxed mb-3">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] text-yuri-navy bg-yuri-pink/40 px-2 py-0.5 rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* カバー画像（cover_image が指定されていれば表示） */}
        {post.cover_image && (
          <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden border border-yuri-edge">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose-yuri text-[15px] md:text-base leading-relaxed text-yuri-ink/90"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.body_html }}
        />
      </article>

      <hr className="my-10 border-yuri-edge" />

      <BlogReadNext posts={relatedPosts} />
    </div>
  );
}
