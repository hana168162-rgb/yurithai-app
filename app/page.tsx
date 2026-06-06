import Link from "next/link";
import {
  getCurrentPickup,
  getFeaturedCompletedDramas,
  getUpcomingSortedByDate,
  upcoming,
} from "@/lib/content";
import { DramaCard } from "@/components/DramaCard";
import { WatchingCard } from "@/components/WatchingCard";
import { UpcomingCard } from "@/components/UpcomingCard";
import { JsonLd, buildFaqJsonLd } from "@/components/JsonLd";

// 公開日が近い順（共通ヘルパー）
const upcomingSortedByDate = getUpcomingSortedByDate();

/**
 * ISR (Incremental Static Regeneration) で1時間ごとに再生成。
 * 「今日の放送曜日に応じた pickup のソート」が日々最新化される。
 */
export const revalidate = 3600;

const HOME_FAQ = [
  {
    question: "YuriThai（ユリタイ）とはどんなサイトですか？",
    answer:
      "YuriThai（ユリタイ／ゆりたい）は、タイGL（タイ百合ドラマ）を日本語でまとめたファン向け情報サイトです。作品レビュー・配信先・女優プロフィール・ペア解説・おすすめ診断・聖地巡礼・ファンミ情報を網羅しています。完結作品23本、放送中6本、公開予定12本以上、ブログ記事75本超を掲載中です。",
  },
  {
    question: "タイGLとは何ですか？",
    answer:
      "タイGL（タイ百合ドラマ）は、タイで制作される女性同士のロマンスを描いたドラマ・映画の総称です。2022年放送の「GAP: The Series」を起点に急成長し、現在では年間20〜30本ペースで新作が公開されるジャンルへと拡大しています。",
  },
  {
    question: "タイGLはどこで観られますか？",
    answer:
      "作品によりますが、TELASA・Netflix日本・iQIYI日本・YouTube公式チャンネル等で視聴できる作品があります。YuriThai（ユリタイ）の各作品ページの「どこで見れる？」セクションで、作品ごとの配信先を確認できます。",
  },
  {
    question: "タイGL初心者は何から観ればいいですか？",
    answer:
      "入門編としては、GAP（2022）、23.5（2023）、Pluto（2024）あたりが定番です。YuriThai（ユリタイ）の「おすすめ診断」を使えば、5問で自分に合う1作が見つかります。",
  },
  {
    question: "タイGLには日本語字幕がありますか？",
    answer:
      "日本配信されている作品は基本的に日本語字幕付きで観られます。YouTube公式配信については作品により英語字幕のみの場合もあるため、各作品ページの配信先情報をご確認ください。",
  },
  {
    question: "「ペア」とはなんですか？",
    answer:
      "タイGL（およびタイBL）の文脈では、複数作品にわたって主演する固定の俳優コンビをペアと呼びます。FreenBecky、LMSY、NamtanFilm、MilkLove などのシップネームが付き、ファンダムも独自に形成されます。",
  },
];

export default function HomePage() {
  const pickup = getCurrentPickup();
  const featured = getFeaturedCompletedDramas(6);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <JsonLd data={buildFaqJsonLd(HOME_FAQ)} />
      {/* Hero */}
      <section className="pt-4 pb-8 md:py-12 text-center">
        <div className="text-yuri-gold mb-2 text-sm">✦  ✦  ✦</div>
        <h1 className="font-display text-[26px] md:text-[34px] font-bold text-yuri-ink mb-6 tracking-tight leading-tight">
          タイGLを、日本で楽しむ。
        </h1>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 bg-yuri-navy text-yuri-cream px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
        >
          <span>✦</span>
          おすすめを診断する
          <span>→</span>
        </Link>
        <p className="mt-3">
          <Link
            href="/dramas"
            className="text-xs text-yuri-rose hover:underline"
          >
            まずは作品一覧を見る →
          </Link>
        </p>
      </section>

      {/* 今月のピックアップ */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-base font-medium text-yuri-navy">
              今月のピックアップ
            </h2>
            <p className="text-xs text-yuri-muted">現在放送中の話題作</p>
          </div>
          <Link
            href="/dramas/airing"
            className="text-xs text-yuri-rose"
          >
            放送中をすべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pickup.map((d, i) => (
            <div key={d.slug} className={i === 3 ? "md:hidden" : ""}>
              <WatchingCard drama={d} cover={d.cover_image} hideProduction />
            </div>
          ))}
        </div>
      </section>

      {/* 作品一覧 */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-base font-medium text-yuri-navy">作品一覧</h2>
            <p className="text-xs text-yuri-muted">完結作品から探す</p>
          </div>
          <Link href="/dramas" className="text-xs text-yuri-rose">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {featured.map((d) => (
            <DramaCard
              key={d.slug}
              drama={d}
              hideProduction
              hideYear
              hideTags
            />
          ))}
        </div>
      </section>

      {/* 公開予定 */}
      {upcoming.length > 0 && (
        <section className="mb-4">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="text-base font-medium text-yuri-navy">
                公開予定
              </h2>
              <p className="text-xs text-yuri-muted">
                全{upcoming.length}作品
              </p>
            </div>
            <Link
              href="/dramas/upcoming"
              className="text-xs text-yuri-rose"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {upcomingSortedByDate.slice(0, 4).map((d, i) => (
              <div key={d.slug} className={i === 3 ? "md:hidden" : ""}>
                <UpcomingCard drama={d} hideProduction />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ — SEO目的（FAQPage JSON-LD と対応） */}
      <section className="mb-12 mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-yuri-navy">
            タイGLについてよくある質問
          </h2>
        </div>
        <div className="space-y-3">
          {HOME_FAQ.map((qa, i) => (
            <details
              key={i}
              className="group bg-yuri-surface border border-yuri-edge rounded-md"
            >
              <summary className="cursor-pointer list-none flex items-start gap-3 px-4 py-3.5 md:py-3 text-[15px] md:text-sm font-medium text-yuri-ink hover:bg-yuri-cream/60">
                <span className="text-yuri-rose mt-0.5" aria-hidden>
                  Q.
                </span>
                <span className="flex-1 leading-snug">{qa.question}</span>
                <span
                  className="text-yuri-muted text-xs mt-1 group-open:rotate-180 transition-transform"
                  aria-hidden
                >
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-3.5 pt-1 text-[15px] md:text-sm text-yuri-ink/85 leading-[1.9] flex gap-3">
                <span className="text-yuri-rose font-medium" aria-hidden>
                  A.
                </span>
                <span>{qa.answer}</span>
              </div>
            </details>
          ))}
        </div>
        <p className="text-xs text-yuri-muted mt-4 text-right">
          <Link
            href="/guide/what-is-thai-gl"
            className="text-yuri-rose hover:opacity-80"
          >
            タイGLについてもっと知る →
          </Link>
        </p>
      </section>
    </div>
  );
}
