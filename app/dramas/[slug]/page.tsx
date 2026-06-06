import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getAnyDramaBySlug,
  allDramaSlugs,
  extractPairName,
  getActressesForPair,
  getRelatedDramas,
  hasEnded,
  pilgrimageBlogSlugForDrama,
} from "@/lib/content";
import { gradientForSlug } from "@/lib/style";
import { AgeBadge } from "@/components/AgeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { TagBadge, TagPillDark } from "@/components/TagBadge";
import { YouTubeEmbed, getYouTubeId } from "@/components/YouTubeEmbed";
import { ActressProfile } from "@/components/ActressProfile";
import { WhereToWatch } from "@/components/WhereToWatch";
import { NordVpnCard } from "@/components/NordVpnCard";
import { analyzeStreamingAccess } from "@/lib/streaming";
import { shortPairName } from "@/lib/pair-name";
import { RelatedDramas } from "@/components/RelatedDramas";

// end_date を過ぎた作品を自動で「完結」表示にするため、1時間ごとに再生成
export const revalidate = 3600;
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
  if (!drama)
    return { title: "作品が見つかりません ｜ YuriThai（ユリタイ）" };

  const full = "tags" in drama && "review" in drama ? (drama as Drama) : null;
  const titleTh = "title_th" in drama ? drama.title_th : null;

  // SEO: タイトルに「タイGL」を前置きしてジャンル検索からの流入を狙う。
  // layout.tsx の template が "%s ｜ YuriThai（ユリタイ）" を付けるので、
  // ここでブランド名は持たない。最終出力例:
  // "Pluto（Pluto）｜配信先・キャスト・レビュー｜タイGLドラマ ｜ YuriThai（ユリタイ）"
  const title = `${drama.title_ja}（${drama.title_en}）｜配信先・キャスト・レビュー｜タイGLドラマ`;

  // description は冒頭で「タイGL」とブランド名を再露出させたうえで、
  // synopsis があればそれを後置し、最後にメタ情報（主演ペア）を必ず添える。
  const synopsisSnippet = full?.synopsis ? full.synopsis.slice(0, 110) : "";
  const castSuffix = drama.cast_pair ? `主演: ${drama.cast_pair}。` : "";
  const description =
    `タイGLドラマ「${drama.title_ja}」${
      drama.title_en ? `（${drama.title_en}）` : ""
    }の作品情報・あらすじ・配信先・出演ペア・レビューを日本語で。${castSuffix}${synopsisSnippet}`.slice(
      0,
      300,
    );

  const url = `${SITE_URL}/dramas/${drama.slug}`;
  // 動的OG画像（Edge生成） — 各作品ごとに固有のブランドカード
  const image = `${SITE_URL}/api/og/drama/${drama.slug}`;

  return {
    title,
    description,
    keywords: [
      "タイGL",
      "タイGLドラマ",
      "タイ百合",
      "タイ百合ドラマ",
      "タイドラマ",
      drama.title_ja,
      drama.title_en,
      ...(titleTh ? [titleTh] : []),
      ...(drama.cast_pair ? [drama.cast_pair] : []),
      ...(drama.production ? [drama.production] : []),
      "百合",
      "YuriThai",
      "ユリタイ",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${drama.title_ja}（${drama.title_en}）｜タイGLドラマ｜YuriThai`,
      description,
      url,
      siteName: "YuriThai（ユリタイ）",
      images: [{ url: image, width: 1200, height: 630, alt: drama.title_ja }],
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${drama.title_ja}｜タイGLドラマ｜YuriThai`,
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

  // 放送中作品（watching.json）は year を持たないため、start_date / end_date から
  // 「2026年4月24日〜6月12日」のような表示用文字列を組み立てる
  const airingPeriod: string | null = (() => {
    if (drama.status !== "airing") return null;
    const sd = "start_date" in drama ? drama.start_date : null;
    const ed = "end_date" in drama ? drama.end_date : null;
    const fmt = (s: string) => {
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return s;
      return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`;
    };
    if (sd && ed) return `${fmt(sd)}〜${fmt(ed).replace(/^\d+年/, "")}`;
    if (sd) return `${fmt(sd)}〜`;
    return null;
  })();

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

  // 日本から観られるか（VPN案内を「自然に」出し分けるための判定）
  const access = analyzeStreamingAccess(streamingLinks);

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

  // 状態セグメント（PCパンくず & 構造化データ用）
  const statusLabel =
    displayStatus === "airing"
      ? "放送中"
      : displayStatus === "upcoming"
        ? "公開予定"
        : "完結済み";
  const statusHref =
    displayStatus === "airing"
      ? "/dramas/airing"
      : displayStatus === "upcoming"
        ? "/dramas/upcoming"
        : "/dramas";

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ドラマ", url: `${SITE_URL}/dramas` },
    { name: statusLabel, url: `${SITE_URL}${statusHref}` },
    { name: drama.title_ja, url: `${SITE_URL}/dramas/${drama.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-10">
      <JsonLd data={tvSeriesData} />
      <JsonLd data={breadcrumbData} />
      {/* Breadcrumb
          モバイル: トップ / ドラマ / 作品名
          PC      : トップ / ドラマ / [放送中/完結済み/公開予定] / 作品名 */}
      <nav className="text-xs text-yuri-muted mb-4" aria-label="パンくず">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/dramas" className="hover:text-yuri-rose">
          ドラマ
        </Link>
        <span className="hidden md:inline">
          <span className="mx-1.5">/</span>
          <Link href={statusHref} className="hover:text-yuri-rose">
            {statusLabel}
          </Link>
        </span>
        <span className="mx-1.5">/</span>
        <span>{drama.title_ja}</span>
      </nav>

      <div className="flex flex-col">
        {/* 1. Hero — order-1 (mobile & PC same)
            モバイルはポスター（小）＋タイトルを横並びにして、あらすじを下に全幅で配置。
            縦長ポスターで初期表示が埋まらないようにして離脱を防ぐ。 */}
        <section className="order-1 mb-8">
          <div className="flex gap-4 md:gap-6">
          <div className="w-32 sm:w-40 md:w-56 aspect-[3/4] rounded-lg relative shrink-0 overflow-hidden">
            {drama.cover_image ? (
              <Image
                src={drama.cover_image}
                alt={drama.title_ja}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: gradientForSlug(drama.slug) }}
                aria-hidden
              />
            )}
            {ageRating && (
              <div className="absolute top-2 right-2 z-10">
                <AgeBadge rating={ageRating} />
              </div>
            )}
            <div className="absolute bottom-2 left-2 z-10">
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
          <div className="flex-1 min-w-0">
            {/* SEO: h1 直上に「タイGLドラマ」のラベルを小さく表示する。
                視覚的にはコンテキストを示すだけだが、
                検索結果のスニペット・H1 のクロール時にジャンル語と作品名が
                同じセクションに含まれる点で SEO シグナルとして効く。 */}
            <p className="text-[11px] tracking-wider text-yuri-muted mb-1">
              <Link
                href="/dramas"
                className="hover:text-yuri-rose uppercase"
              >
                タイGLドラマ
              </Link>
            </p>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl font-display font-semibold text-yuri-ink mb-1 leading-tight">
              {drama.title_ja}
            </h1>
            {titleTh && (
              <p className="text-[13px] md:text-sm text-yuri-muted mb-2">
                {titleTh}
              </p>
            )}
            <p className="text-[14px] md:text-sm text-yuri-ink/70 mb-4 leading-relaxed">
              {year ?? airingPeriod ?? upcoming?.announced_for ?? "公開時期 未定"}
              {drama.production && (
                <>
                  <span className="mx-1">·</span>
                  {drama.production}
                </>
              )}
              {displayEpisodes && (
                <>
                  <span className="mx-1">·</span>
                  {displayEpisodes}話
                </>
              )}
            </p>

            {drama.cast_pair && (
              <div className="text-[14px] md:text-sm">
                <span className="text-yuri-muted">出演ペア: </span>
                <strong className="text-yuri-ink font-semibold">
                  {shortPairName(drama.cast_pair)}
                </strong>
              </div>
            )}
          </div>
          </div>

          {synopsis && (
            <p className="mt-5 text-[15px] md:text-lg leading-[1.9] md:leading-relaxed text-yuri-ink/90 max-w-prose whitespace-pre-line">
              {synopsis}
            </p>
          )}
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
          {/*
            VPN案内は「この作品が日本から直接観られない配信先を含む」場合だけ
            文脈に沿って出す。日本でフツーに観られる作品には出さない（＝自然な誘導）。
          */}
          {access.hasRestricted && (
            <NordVpnCard
              variant="compact"
              title={
                access.vpnOnly
                  ? "この作品を日本から観るには"
                  : "タイ限定の配信先を観たいときは"
              }
              subtitle={
                access.vpnOnly
                  ? "この作品は、日本から直接観られる配信先が見つかりませんでした。タイ現地の配信サービスで観たい場合、VPN という選択肢があります（30日間返金保証あり ※詳細は公式サイト）。"
                  : "上の 🔒 マークの配信先はタイ限定です。日本で観られる配信先（YouTube・TELASA 等）が第一候補ですが、現地配信を観たい場合は VPN という方法もあります。"
              }
            />
          )}
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
                  <div className="text-sm leading-relaxed text-yuri-ink/85 mb-4 space-y-3">
                    {full.review.body_ja
                      .split(/\n{2,}/)
                      .map((para, i) => (
                        <p key={i} className="whitespace-pre-line">
                          {para}
                        </p>
                      ))}
                  </div>
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

        {/* 聖地巡礼ガイドへの導線 — mobile: order-9 / PC: order-9 */}
        <section className="order-9 mb-8">
          <h2 className="text-base font-medium text-yuri-navy mb-3">
            聖地巡礼ガイド
          </h2>
          {(() => {
            const pilSlug = pilgrimageBlogSlugForDrama(drama.slug);
            return (
              <div className="bg-yuri-pink/10 border border-yuri-pink/30 rounded-lg p-4">
                {pilSlug ? (
                  <>
                    <p className="text-sm text-yuri-ink/85 mb-2 leading-relaxed">
                      <strong className="font-medium">{drama.title_ja}</strong>{" "}
                      のロケ地・関連スポットや、バンコクで楽しむ推し活情報をまとめました。
                    </p>
                    <Link
                      href={`/blog/${pilSlug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-yuri-rose hover:opacity-80"
                    >
                      {drama.title_ja} の聖地巡礼ガイドを読む →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-yuri-ink/85 mb-2 leading-relaxed">
                      バンコクで楽しむタイGL推し活のガイドはこちら。
                    </p>
                    <Link
                      href="/blog/thai-gl-pilgrimage-guide"
                      className="inline-flex items-center gap-1 text-sm font-medium text-yuri-rose hover:opacity-80"
                    >
                      タイGL聖地巡礼ガイド（全作品共通） →
                    </Link>
                  </>
                )}
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
}
