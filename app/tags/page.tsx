import Link from "next/link";
import type { Metadata } from "next";
import {
  allTags,
  TAG_CATEGORY_LABELS,
  tagToSlug,
  type TagCategoryKey,
  type TagSummary,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "タグから探す（タイGLドラマ）",
  description:
    "ジャンル・関係性・トーン・ペース・描写・プロダクション別にタイGLドラマを探す。「オフィスもの」「ライバル→恋人」「シリアス」「スロウバーン」「ケミがすごい」など全タグから絞り込み検索。",
  alternates: { canonical: "https://yurithai.jp/tags" },
  openGraph: {
    title: "タグから探す（タイGLドラマ） | YuriThai",
    url: "https://yurithai.jp/tags",
    type: "website",
  },
};

export default function TagsPage() {
  const tagSummaries = allTags();

  // カテゴリ別グループ化
  const grouped = new Map<TagCategoryKey, TagSummary[]>();
  for (const t of tagSummaries) {
    if (!grouped.has(t.category)) grouped.set(t.category, []);
    grouped.get(t.category)!.push(t);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          タグから探す
        </h1>
        <p className="text-sm text-yuri-muted">
          ジャンル・関係性・トーンなど {tagSummaries.length} のタグから絞り込み
        </p>
      </header>

      <div className="space-y-6">
        {(Object.keys(TAG_CATEGORY_LABELS) as TagCategoryKey[]).map((cat) => {
          const tags = grouped.get(cat) ?? [];
          if (tags.length === 0) return null;
          return (
            <section
              key={cat}
              className="bg-yuri-cream border border-yuri-edge rounded-lg p-5"
            >
              <h2 className="text-sm font-medium text-yuri-muted tracking-wider mb-3">
                {TAG_CATEGORY_LABELS[cat]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tags/${tagToSlug(t.tag)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yuri-pink/40 hover:bg-yuri-pink/70 border border-yuri-edge text-yuri-navy text-xs transition-colors"
                  >
                    <span>{t.tag}</span>
                    <span className="text-[10px] text-yuri-muted">
                      ({t.count})
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
