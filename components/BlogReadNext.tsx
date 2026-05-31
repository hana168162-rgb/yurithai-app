import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

/**
 * ブログ記事末尾の回遊導線。
 * 読み終えた読者を行き止まりにせず、(1)関連記事 (2)おすすめ診断 へ誘導して
 * 離脱を防ぐ。モバイルでタップしやすい縦並びカードで構成。
 */
export function BlogReadNext({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <div className="mt-12">
      {/* おすすめ診断 CTA（主要アクション） */}
      <Link
        href="/recommend"
        className="block rounded-xl border border-yuri-edge bg-gradient-to-br from-yuri-navy to-yuri-rose text-yuri-cream px-5 py-5 mb-8 hover:opacity-95 transition-opacity"
      >
        <p className="text-[11px] tracking-wider opacity-90 mb-1">✦ 5問でわかる</p>
        <p className="text-base font-medium leading-snug mb-1">
          あなたに合うタイGLは？
        </p>
        <p className="text-xs opacity-90 leading-relaxed">
          好みのトーン・関係性から、ぴったりの一作を診断します。
          <span className="inline-flex items-center gap-0.5 font-medium ml-0.5">
            診断してみる <span aria-hidden>→</span>
          </span>
        </p>
      </Link>

      {posts.length > 0 && (
        <section aria-labelledby="read-next-heading">
          <h2
            id="read-next-heading"
            className="text-base font-medium text-yuri-navy mb-3 flex items-center gap-1.5"
          >
            <span className="text-yuri-rose" aria-hidden>
              ❀
            </span>
            次に読む
          </h2>
          <ul className="space-y-2.5">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="flex gap-3 items-center rounded-lg border border-yuri-edge bg-yuri-surface p-2.5 hover:border-yuri-rose/40 transition-colors"
                >
                  <div className="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-yuri-pink/40">
                    {p.cover_image ? (
                      <Image
                        src={p.cover_image}
                        alt={p.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-yuri-rose/60 text-lg"
                        aria-hidden
                      >
                        ✦
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-yuri-ink leading-snug line-clamp-2">
                      {p.title}
                    </p>
                    {p.tags.length > 0 && (
                      <p className="text-[11px] text-yuri-muted mt-1 truncate">
                        #{p.tags.slice(0, 3).join("　#")}
                      </p>
                    )}
                  </div>
                  <span className="text-yuri-muted text-xs shrink-0" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <Link href="/blog" className="text-yuri-rose hover:underline">
          ← ブログ一覧
        </Link>
        <Link href="/dramas" className="text-yuri-rose hover:underline">
          作品一覧を見る →
        </Link>
      </div>
    </div>
  );
}
