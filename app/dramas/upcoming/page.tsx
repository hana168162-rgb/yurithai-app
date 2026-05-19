import { upcoming, actresses } from "@/lib/content";
import { DramaListNav } from "@/components/DramaListNav";
import { DramaFilterBar } from "@/components/DramaFilterBar";

export const metadata = {
  title: "公開予定のタイGLドラマ一覧",
  description:
    "2026年以降に放送・配信予定のタイGLドラマ最新ラインナップ。Cranium、Moonshadow、Her、Ditto、Love's Echoes、Wish upon a star など主要ペアの新作情報を日本語で。",
  alternates: { canonical: "https://yurithai.jp/dramas/upcoming" },
  openGraph: {
    title: "公開予定のタイGLドラマ一覧 | YuriThai",
    url: "https://yurithai.jp/dramas/upcoming",
    type: "website",
  },
};

export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          公開予定
        </h1>
      </header>

      <DramaListNav current="upcoming" />

      {upcoming.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          まだ追加情報がありません
        </div>
      ) : (
        <DramaFilterBar
          dramas={upcoming}
          actresses={actresses}
          cardType="upcoming"
        />
      )}
    </div>
  );
}
