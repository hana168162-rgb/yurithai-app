import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAnyDramaBySlug,
  allDramaSlugs,
  extractPairName,
  getActressesForPair,
  getRelatedDramas,
  hasEnded,
} from "@/lib/content";
import { gradientForSlug } from "@/lib/style";
import { AgeBadge } from "@/components/AgeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { TagBadge, TagPillDark } from "@/components/TagBadge";
import { YouTubeEmbed, getYouTubeId } from "@/components/YouTubeEmbed";
import { ActressProfile } from "@/components/ActressProfile";
import { WhereToWatch } from "@/components/WhereToWatch";
import { RelatedDramas } from "@/components/RelatedDramas";
import {
  JsonLd,
  buildTVSeriesJsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";
import type {
  Drama,
  UpcomingDrama,
  AnyDrama,
} from "@/lib/types";

const SITE_URL = "https://yurithai.jp";

export function generateStaticParams() {
  return allDramaSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const drama = getAnyDramaBySlug(params.slug);
  if (!drama) return { title: "作品が見つかりません | YuriThai" };

  const full = "tags" in drama && "review" in drama ? (drama as Drama) : null;
  const titleTh = "title_th" in drama ? drama.title_th : null;

  const title = `${drama.title_ja}（${drama.title_en}）| YuriThai`;
  const description = full?.synopsis
    ? full.synopsis.slice(0, 150)
    : `タイGLドラマ「${drama.title_ja}」の作品情報、出演ペア、配信先、レビュー、関連動画を日本語でまとめたガイド。${drama.cast_pair ? `主演: ${drama.cast_pair}` : ""}`;

  const url = `${SITE_URL}/dramas/${drama.slug}`;
  // 動的OG画像（Edge生成） — 各作品ごとに固有のブランドカード
  const image = `${SITE_URL}/api/og/drama/${drama.slug}`;

  return {
    title,
    description,
    keywords: [
      "タイGL",
      "タイドラマ",
      drama.title_ja,
      drama.title_en,
      ...(titleTh ? [titleTh] : []),
      ...(drama.production ? [drama.production] : []),
      "百合",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${drama.title_ja}（${drama.title_en}）`,
      description,
      url,
      siteName: "YuriThai",
      images: [{ url: image, width: 1200, height: 630, alt: drama.title_ja }],
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: drama.title_ja,
      description,
      images: [image],
    },
  };
}

function asFullDrama(d: AnyDrama): Drama | null {
  return "tags" in d && "review" in d ? (d as Drama) : null;
}

function asUpcoming(d: AnyDrama): UpcomingDrama | null {
  return d.status === "upcoming" ? (d as UpcomingDrama) : null;
}

export default function DramaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const drama = getAnyDramaBySlug(params.slug);
  if (!drama) notFound();

  const full = asFullDrama(drama);
  const upcoming = asUpcoming(drama);

  const titleTh = upcoming?.title_th ?? null;
  const youtubeTeaser =
    "youtube_teaser" in drama ? drama.youtube_teaser : null;
  const note = "note" in drama ? drama.note : "";
  const synopsis = full?.synopsis ?? "";

  const year = full?.year ?? null;
  const episodes = full?.episodes ?? null;
  const ageRating = full?.age_rating ?? null;

  const tagSections = full
    ? [
        { label: "ジャンル", tags: full.tags.genre },
        { label: "関係性", tags: full.tags.relationship },
        { label: "トーン", tags: full.tags.tone },
        { label: "ペース", tags: full.tags.pacing },
        { label: "描写の濃さ", tags: full.tags.intimacy },
        { label: "プロダクション", tags: full.tags.production_quality },
        ...(full.tags.warnings && full.tags.warnings.length > 0
          ? [{ label: "注意点", tags: full.tags.warnings }]
          : []),
      ].filter((s) => s.tags && s.tags.length > 0)
    : [];

  const pairName = extractPairName(drama.cast_pair);
  const actressList = pairName ? getActressesForPair(pairName) : [];

  const streamingLinks =
    "streaming" in drama && drama.streaming && drama.streaming.length > 0
      ? drama.streaming
      : undefined;

  const relatedGroups = getRelatedDramas(drama, 4);

  // end_date 過ぎた watching は表示上「完結」扱い
  const displayStatus =
    drama.status === "airing" &&
    "end_date" in drama &&
    hasEnded(drama as import("@/lib/types").WatchingDrama)
      ? "completed"
      : drama.status;
  const displayEpisodes =
    "episodes" in drama && typeof drama.episodes === "number"
      ? drama.episodes
      : episodes;

  // 構造化データ
  const tvSeriesData = buildTVSeriesJsonLd({ drama, actresses: actressList });
  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ドラマ", url: `${SITE_URL}/dramas` },
    { name: drama.title_ja, url: `${SITE_URL}/dramas/${drama.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <JsonLd data={tvSeriesData} />
      <JsonLd data={breadcrumbData} />
      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/dramas" className="hover:text-yuri-rose">
          ドラマ
        </Link>
        <span className="mx-1.5">/</span>
        <span>{drama.title_ja}</span>
      </nav>

      <div className="flex flex-col">
        {/* 1. Hero — order-1 (mobile & PC same) */}
        <section className="order-1 flex gap-6 mb-8 flex-col md:flex-row">
          <div
            className="w-full md:w-56 aspect-[3/4] rounded-lg relative shrink-0 bg-cover bg-center overflow-hidden"
            style={
              drama.cover_image
                ? { backgroundImage: `url(${drama.cover_image})` }
                : { background: gradientForSlug(drama.slug) }
            }
          >
            {ageRating && (
              <div className="absolute top-2 right-2">
                <AgeBadge rating={ageRating} />
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              {drama.status === "upcoming" ? (
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded text-yuri-cream"
                  style={{ background: "rgba(165,197,212,0.92)" }}
                >
                  {upcoming?.announced_for ?? "公開予定"}
                </span>
              ) : (
                <StatusBadge
                  status={displayStatus}
                  episodes={displayEpisodes}
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
              {drama.title_ja}
            </h1>
            {titleTh && (
              <p className="text-sm text-yuri-muted mb-2">{titleTh}</p>
            )}
            <p className="text-sm text-yuri-muted mb-4">
              {year ?? "未発表"}
              {drama.production && (
                <>
                  <span className="mx-1">·</span>
                  {drama.production}
                </>
              )}
              {episodes && (
                <>
                  <span className="mx-1">·</span>
                  {episodes}話
                </>
              )}
            </p>

            {drama.cast_pair && (
              <div className="mb-4 text-sm">
                <span className="text-yuri-muted">出演ペア: </span>
                <span className="text-yuri-ink">{drama.cast_pair}</span>
              </div>
            )}

            {synopsis && (
              <p className="text-sm leading-relaxed text-yuri-ink/80">
                {synopsis}
              </p>
            )}
          </div>
        </section>

        {/* 2. Teaser — order-2 (mobile & PC same) */}
        <section className="order-2 mb-8">
          <h2 className="text-base font-medium text-yuri-navy mb-3">
            予告
          </h2>
          {getYouTubeId(youtubeTeaser) ? (
            <YouTubeEmbed src={youtubeTeaser} />
          ) : (
            <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4 text-sm text-yuri-muted">
              予告は準備中です。
            </div>
          )}
        </section>

        {/* 3. Where-to-watch — mobile: order-3 / PC: order-6 */}
        <section className="order-3 md:order-6 mb-8">
          <h2 className="text-base font-medium text-yuri-navy mb-3">
            どこで見れる？
          </h2>
          <WhereToWatch streaming={streamingLinks} fallbackNote={null} />
        </section>

        {/* 制作・放送情報 — mobile: order-7 / PC: order-7 (一番下) */}
        {note && (
          <section className="order-7 md:order-7 mb-8">
            <h2 className="text-base font-medium text-yuri-navy mb-3">
              制作・放送情報
            </h2>
            <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
              <div className="flex flex-wrap gap-1.5">
                {note
                  .split("/")
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
                  .map((item, i) => (
                    <span
                      key={`${item}-${i}`}
                      className="inline-flex items-center px-2.5 py-1 rounded bg-yuri-cream border border-yuri-edge text-yuri-ink text-xs"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Tags — mobile: order-4 / PC: order-3 */}
        {tagSections.length > 0 && (
          <section className="order-4 md:order-3 mb-8">
            <h2 className="text-base font-medium text-yuri-navy mb-3">
              作品タグ
            </h2>
            {/* PC: 2-col card grid (kept). Mobile: compact rows */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {tagSections.map((sec, i) => (
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
              ))}
            </div>
            <div className="md:hidden bg-yuri-surface border border-yuri-edge rounded-lg p-3 space-y-2">
              {tagSections.map((sec, i) => (
                <div
                  key={sec.label}
                  className="flex items-start gap-2 text-xs"
                >
                  <span className="w-20 shrink-0 text-yuri-muted pt-1">
                    {sec.label}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sec.tags.map((t, j) => (
                      <TagBadge key={t} label={t} idx={(i + j) % 5} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Review — mobile: order-5 / PC: order-4 */}
        {full?.review &&
          (full.review.highlights.length > 0 ||
            full.review.recommend_for.length > 0 ||
            full.review.caution_for.length > 0 ||
            full.review.body_ja) && (
            <section className="order-5 md:order-4 mb-8">
              <h2 className="text-base font-medium text-yuri-navy mb-3">
                管理者レビュー
              </h2>
              <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-4 border-l-4 border-l-yuri-rose">
                {full.review.body_ja ? (
                  <p className="text-sm leading-relaxed text-yuri-ink/80 mb-4 whitespace-pre-line">
                    {full.review.body_ja}
                  </p>
                ) : (
                  <p className="text-xs text-yuri-muted italic mb-4">
                    レビュー本文は準備中
                  </p>
                )}

                {full.review.highlights.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] text-yuri-muted mr-2">
                      ここが良かった
                    </span>
                    <span className="inline-flex flex-wrap gap-1 align-middle">
                      {full.review.highlights.map((t) => (
                        <TagPillDark key={t} label={t} variant="navy" />
                      ))}
                    </span>
                  </div>
                )}
                {full.review.recommend_for.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] text-yuri-muted mr-2">
                      こんな人におすすめ
                    </span>
                    <span className="inline-flex flex-wrap gap-1 align-middle">
                      {full.review.recommend_for.map((t) => (
                        <TagPillDark key={t} label={t} variant="rose" />
                      ))}
                    </span>
                  </div>
                )}
                {full.review.caution_for.length > 0 && (
                  <div>
                    <span className="text-[10px] text-yuri-muted mr-2">
                      こんな人は注意
                    </span>
                    <span className="inline-flex flex-wrap gap-1 align-middle">
                      {full.review.caution_for.map((t) => (
                        <TagPillDark key={t} label={t} variant="navy" />
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* 6. Actress profiles — mobile: order-6 / PC: order-5 */}
        {actressList.length > 0 && (
          <section className="order-6 md:order-5 mb-8">
            <h2 className="text-base font-medium text-yuri-navy mb-3">
              出演女優
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actressList.map((a) => (
                <ActressProfile key={a.id} actress={a} />
              ))}
            </div>
          </section>
        )}

        {/* 関連作品 — mobile: order-8 / PC: order-8 */}
        {relatedGroups.length > 0 && (
          <section className="order-8 md:order-8 mb-8">
            <h2 className="text-base font-medium text-yuri-navy mb-3">
              関連作品
            </h2>
            <RelatedDramas groups={relatedGroups} />
          </section>
        )}
      </div>
    </div>
  );
}
