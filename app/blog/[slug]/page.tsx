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
    <div className="mx-auto max-w-[680px] px-5 md:px-6 py-10 md:py-14">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4 break-words">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-yuri-rose">
          ブログ
        </Link>
        <span className="mx-1.5">/</span>
        <span>{post.title}</span>
      </nav>

      <article>
        <header className="mb-10 md:mb-12">
          <p className="text-[13px] md:text-xs text-yuri-muted mb-3 tracking-wider">
            {formatDate(post.date)}
          </p>
          <h1 className="text-[26px] md:text-[34px] font-display font-bold text-yuri-ink leading-[1.45] mb-4">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-[15px] md:text-base text-yuri-ink/80 leading-[1.9] mb-4">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-[12px] md:text-[11px] text-yuri-navy bg-yuri-pink/40 px-2.5 py-1 rounded-full"
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
            {/* デイリー速報記事: 日付を中央に大きく表示して識別性アップ */}
            {(post.category === "sns-update" ||
              post.cover_image === "/images/news-placeholder.jpg") &&
              (() => {
                const date = new Date(post.date);
                if (Number.isNaN(date.getTime())) return null;
                const weekday = ["日", "月", "火", "水", "木", "金", "土"][
                  date.getDay()
                ];
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yuri-cream/40 via-transparent to-yuri-rose/15">
                    <div className="text-yuri-rose text-sm md:text-base font-medium tracking-[0.2em] mb-2">
                      DAILY UPDATE
                    </div>
                    <div className="text-yuri-navy font-display font-bold leading-none text-6xl md:text-8xl">
                      {date.getMonth() + 1}.{date.getDate()}
                    </div>
                    <div className="text-yuri-ink/70 text-base md:text-lg mt-3 font-medium">
                      {date.getFullYear()}年 ({weekday})
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        <div
          className="prose-yuri"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.body_html }}
        />
      </article>

      <hr className="my-14 border-yuri-edge" />

      <BlogReadNext posts={relatedPosts} />
    </div>
  );
}
