import Link from "next/link";
import Image from "next/image";
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
  "industry-feature": "業界特集",
  "studio-feature": "スタジオ特集",
  "drama-feature": "作品特集",
  pilgrimage: "聖地巡礼",
  review: "レビュー",
  news: "ニュース",
  "sns-update": "デイリー速報",
  other: "その他",
};

function formatDate(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** サムネ用：日付を月/日 + 曜日に分解（"6.18(水)" 形式） */
function dateBadgeParts(d: string): { md: string; weekday: string } | null {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return {
    md: `${date.getMonth() + 1}.${date.getDate()}`,
    weekday,
  };
}

/**
 * Manus 等で日次自動生成される速報記事の判定。
 * - category === "sns-update" を主に見る（最も信頼できる）
 * - 補助的に news-placeholder.jpg もチェック（既存記事の互換性）
 */
function isDailyUpdate(post: { category: string; cover_image: string | null }) {
  if (post.category === "sns-update") return true;
  if (post.cover_image === "/images/news-placeholder.jpg") return true;
  return false;
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-6 py-8 md:py-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          ブログ・特集記事
        </h1>
        <p className="text-[15px] md:text-sm text-yuri-ink/70">
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
              className="bg-yuri-surface border border-yuri-edge rounded-lg overflow-hidden hover:border-yuri-rose/40 transition-colors"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                {/* サムネ */}
                {post.cover_image && (
                  <div className="relative w-full sm:w-40 aspect-[16/9] sm:aspect-square shrink-0 bg-yuri-cream overflow-hidden">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                      loading="lazy"
                    />
                    {/* デイリー速報記事は、プレースホルダー画像の上に
                        日付を大きく重ねて1日ごとの識別性を上げる。 */}
                    {isDailyUpdate(post) &&
                      (() => {
                        const parts = dateBadgeParts(post.date);
                        if (!parts) return null;
                        return (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yuri-cream/40 via-transparent to-yuri-rose/15">
                            <div className="text-yuri-rose text-[10px] sm:text-[11px] font-medium tracking-[0.18em] mb-1">
                              DAILY
                            </div>
                            <div className="text-yuri-navy font-display font-bold leading-none text-[42px] sm:text-5xl">
                              {parts.md}
                            </div>
                            <div className="text-yuri-ink/70 text-xs sm:text-sm mt-1.5 font-medium">
                              （{parts.weekday}）
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                )}

                {/* 記事メタ + 本文プレビュー */}
                <div className="p-4 md:p-5 flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] md:text-[10px] font-medium bg-yuri-navy text-yuri-cream">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span className="text-[12px] md:text-xs text-yuri-muted">
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h2 className="text-[17px] md:text-lg font-medium text-yuri-navy mb-2 hover:text-yuri-rose leading-snug">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-[14px] md:text-sm text-yuri-ink/80 mb-3 leading-[1.85] line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[12px] md:text-[11px] text-yuri-muted bg-yuri-cream px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
