import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "ブログ・特集記事",
  description:
    "タイGLドラマの入門ガイド、ペア特集、新作レビュー、視聴ガイド。タイGLをもっと楽しむためのコンテンツ。",
  alternates: { canonical: "https://yurithai.jp/blog" },
  openGraph: {
    title: "ブログ・特集記事 | YuriThai",
    description: "タイGLを深く楽しむための記事",
    url: "https://yurithai.jp/blog",
    type: "website",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  guide: "入門ガイド",
  "pair-feature": "ペア特集",
  "annual-feature": "年間特集",
  review: "レビュー",
  news: "ニュース",
  other: "その他",
};

function formatDate(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          ブログ・特集記事
        </h1>
        <p className="text-sm text-yuri-muted">
          タイGLをもっと楽しむためのガイド・特集
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          記事を準備中です。
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-yuri-surface border border-yuri-edge rounded-lg p-5 hover:border-yuri-rose/40 transition-colors"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yuri-navy text-yuri-cream">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  <span className="text-[11px] text-yuri-muted">
                    {formatDate(post.date)}
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-medium text-yuri-navy mb-2 hover:text-yuri-rose">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-yuri-ink/80 mb-3 leading-relaxed">
                    {post.description}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-yuri-muted bg-yuri-cream px-1.5 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
