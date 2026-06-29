import { getUpcomingSortedByDate, actresses } from "@/lib/content";
import { DramaListNav } from "@/components/DramaListNav";
import { DramaFilterBar } from "@/components/DramaFilterBar";

// 放送開始日が来た作品の取り扱いを反映するため、1時間ごとに再生成
export const revalidate = 3600;

export const metadata = {
  title: "公開予定のタイGLドラマ一覧｜まもなく配信開始の新作",
  description:
    "これから放送・配信予定のタイGL（タイ百合）ドラマ最新ラインナップを網羅。The Fire、Cranium、Moonshadow、Her、Ditto、Love's Echoes、Wish upon a star、Third Person、Hak Na My Boss など主要ペアの新作情報を日本語で。",
  keywords: [
    "タイGL",
    "タイGLドラマ",
    "タイGL 公開予定",
    "タイGL 新作",
    "タイGL 2026",
    "タイ百合 新作",
    "Cranium",
    "Her",
    "Ditto",
    "Moonshadow",
    "The Fire",
    "YuriThai",
    "ユリタイ",
  ],
  alternates: { canonical: "https://yurithai.jp/dramas/upcoming" },
  openGraph: {
    title: "公開予定のタイGLドラマ｜YuriThai",
    url: "https://yurithai.jp/dramas/upcoming",
    type: "website",
    siteName: "YuriThai（ユリタイ）",
  },
};

export default function UpcomingPage() {
  // 公開日が近い順（具体的日付 → 年/月のみ → 未発表/pending の順）
  const sortedUpcoming = getUpcomingSortedByDate();

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          公開予定のタイGLドラマ
        </h1>
        <p className="text-sm text-yuri-muted mt-1">
          これから配信開始のタイ百合ドラマ新作ラインナップ
        </p>
      </header>

      <DramaListNav current="upcoming" />

      {sortedUpcoming.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          まだ追加情報がありません
        </div>
      ) : (
        <DramaFilterBar
          dramas={sortedUpcoming}
          actresses={actresses}
          cardType="upcoming"
        />
      )}
    </div>
  );
}
