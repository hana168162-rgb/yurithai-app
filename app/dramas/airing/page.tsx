import { getActiveWatching, actresses } from "@/lib/content";
import { DramaListNav } from "@/components/DramaListNav";
import { DramaFilterBar } from "@/components/DramaFilterBar";

// end_date を過ぎた作品を自動完結扱いにするため、1時間ごとに再生成
export const revalidate = 3600;

export const metadata = {
  title: "放送中・配信中のタイGLドラマ一覧｜最新作の視聴ガイド",
  description:
    "現在タイで放送中・配信中のタイGL（タイ百合）ドラマ最新作を一覧で。Fulfill、Chasing Love、Rental Love Lab、The Air、Hometown Romance、Love beyond Dreams など放送中作品の配信先・キャスト・あらすじを日本語で。",
  keywords: [
    "タイGL",
    "タイGLドラマ",
    "タイGL 放送中",
    "タイGL 配信",
    "タイGL 最新",
    "タイ百合 ドラマ",
    "Fulfill",
    "Chasing Love",
    "The Air",
    "YuriThai",
    "ユリタイ",
  ],
  alternates: { canonical: "https://yurithai.jp/dramas/airing" },
  openGraph: {
    title: "放送中・配信中のタイGLドラマ ｜ YuriThai（ユリタイ）",
    url: "https://yurithai.jp/dramas/airing",
    type: "website",
    siteName: "YuriThai（ユリタイ）",
  },
};

export default function AiringPage() {
  const active = getActiveWatching();
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          放送中のタイGLドラマ
        </h1>
        <p className="text-sm text-yuri-muted mt-1">
          現在配信・放送中のタイ百合ドラマ最新作を、配信先付きで
        </p>
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
