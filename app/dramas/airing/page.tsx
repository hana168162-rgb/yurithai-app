import { getActiveWatching, actresses } from "@/lib/content";
import { DramaListNav } from "@/components/DramaListNav";
import { DramaFilterBar } from "@/components/DramaFilterBar";

export const metadata = {
  title: "現在放送中・配信中のタイGLドラマ一覧",
  description:
    "現在タイで放送中・配信中のGLドラマ最新作を一覧で。Fulfill、Hometown Romance、Love beyond Dreams など最新情報を日本語で。",
  alternates: { canonical: "https://yurithai.jp/dramas/airing" },
  openGraph: {
    title: "現在放送中・配信中のタイGLドラマ一覧 | YuriThai",
    url: "https://yurithai.jp/dramas/airing",
    type: "website",
  },
};

export default function AiringPage() {
  const active = getActiveWatching();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          放送中の作品
        </h1>
      </header>

      <DramaListNav current="airing" />

      <DramaFilterBar
        dramas={active}
        actresses={actresses}
        cardType="watching"
      />
    </div>
  );
}
