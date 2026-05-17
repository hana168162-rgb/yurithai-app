import { notFound } from "next/navigation";
import Link from "next/link";
import { dramas, getDramaBySlug } from "@/lib/content";
import { gradientForSlug } from "@/lib/style";
import { AgeBadge } from "@/components/AgeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { TagBadge, TagPillDark } from "@/components/TagBadge";
import { YouTubeEmbed, getYouTubeId } from "@/components/YouTubeEmbed";

export function generateStaticParams() {
  return dramas.map((d) => ({ slug: d.slug }));
}

export default function DramaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const drama = getDramaBySlug(params.slug);
  if (!drama) notFound();

  const tagSections: { label: string; tags: string[] }[] = [
    { label: "ジャンル", tags: drama.tags.genre },
    { label: "関係性", tags: drama.tags.relationship },
    { label: "トーン", tags: drama.tags.tone },
    { label: "ペース", tags: drama.tags.pacing },
    { label: "描写の濃さ", tags: drama.tags.intimacy },
    { label: "プロダクション", tags: drama.tags.production_quality },
  ];
  if (drama.tags.warnings.length > 0) {
    tagSections.push({ label: "注意点", tags: drama.tags.warnings });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4">
        <Link href="/" className="hover:text-yuri-rose">トップ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/dramas" className="hover:text-yuri-rose">ドラマ一覧</Link>
        <span className="mx-1.5">/</span>
        <span>{drama.title_ja}</span>
      </nav>

      {/* Hero */}
      <div className="flex gap-6 mb-8 flex-col md:flex-row">
        <div
          className="w-full md:w-56 aspect-[3/4] rounded-lg relative shrink-0 bg-cover bg-center overflow-hidden"
          style={
            drama.cover_image
              ? { backgroundImage: `url(${drama.cover_image})` }
              : { background: gradientForSlug(drama.slug) }
          }
        >
          <div className="absolute top-2 right-2">
            <AgeBadge rating={drama.age_rating} />
          </div>
          <div className="absolute bottom-2 left-2">
            <StatusBadge status={drama.status} episodes={drama.episodes} />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
            {drama.title_ja}
          </h1>
          <p className="text-sm text-yuri-muted mb-4">
            {drama.year ?? "—"}
            {drama.production && (
              <>
                <span className="mx-1">·</span>
                {drama.production}
              </>
            )}
            {drama.episodes && (
              <>
                <span className="mx-1">·</span>
                {drama.episodes}話
              </>
            )}
          </p>

          {drama.cast_pair && (
            <div className="mb-4 text-sm">
              <span className="text-yuri-muted">女優: </span>
              <span className="text-yuri-ink">{drama.cast_pair}</span>
            </div>
          )}

          {drama.synopsis && (
            <p className="text-sm leading-relaxed text-yuri-ink/80">
              {drama.synopsis}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <section className="mb-8">
        <h2 className="text-base font-medium text-yuri-navy mb-3">
          作品タグ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tagSections.map(
            (sec, i) =>
              sec.tags.length > 0 && (
                <div
                  key={sec.label}
                  className="bg-yuri-surface border border-yuri-edge rounded-lg p-3"
                >
                  <p className="text-[11px] text-yuri-muted mb-2 tracking-wider">
                    {sec.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.tags.map((t, j) => (
                      <TagBadge
                        key={t}
                        label={t}
                        idx={(i + j) % 5}
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>

      {/* Review */}
      {(drama.review.highlights.length > 0 ||
        drama.review.recommend_for.length > 0 ||
        drama.review.caution_for.length > 0 ||
        drama.review.body_ja) && (
        <section className="mb-8">
          <h2 className="text-base font-medium text-yuri-navy mb-3">
            管理者レビュー
          </h2>
          <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4 border-l-4 border-l-yuri-rose">
            {drama.review.body_ja ? (
              <p className="text-sm leading-relaxed text-yuri-ink/80 mb-4 whitespace-pre-line">
                {drama.review.body_ja}
              </p>
            ) : (
              <p className="text-xs text-yuri-muted italic mb-4">
                レビュー本文は準備中
              </p>
            )}

            {drama.review.highlights.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] text-yuri-muted mr-2">
                  ここが良かった
                </span>
                <span className="inline-flex flex-wrap gap-1 align-middle">
                  {drama.review.highlights.map((t) => (
                    <TagPillDark key={t} label={t} variant="navy" />
                  ))}
                </span>
              </div>
            )}
            {drama.review.recommend_for.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] text-yuri-muted mr-2">
                  こんな人におすすめ
                </span>
                <span className="inline-flex flex-wrap gap-1 align-middle">
                  {drama.review.recommend_for.map((t) => (
                    <TagPillDark key={t} label={t} variant="rose" />
                  ))}
                </span>
              </div>
            )}
            {drama.review.caution_for.length > 0 && (
              <div>
                <span className="text-[10px] text-yuri-muted mr-2">
                  こんな人は注意
                </span>
                <span className="inline-flex flex-wrap gap-1 align-middle">
                  {drama.review.caution_for.map((t) => (
                    <TagPillDark key={t} label={t} variant="navy" />
                  ))}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* YouTube teaser */}
      {getYouTubeId(drama.youtube_teaser) && (
        <section className="mb-8">
          <h2 className="text-base font-medium text-yuri-navy mb-3">
            ティザー映像
          </h2>
          <YouTubeEmbed src={drama.youtube_teaser} />
        </section>
      )}

      {/* Where to watch placeholder */}
      <section className="mb-8">
        <h2 className="text-base font-medium text-yuri-navy mb-3">
          どこで見れる？
        </h2>
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4 text-sm text-yuri-muted">
          配信先情報は準備中です。
          {drama.note && (
            <p className="mt-2 text-xs text-yuri-ink/70">{drama.note}</p>
          )}
        </div>
      </section>
    </div>
  );
}
