import Link from "next/link";
import type { Metadata } from "next";
import { TripcomCard } from "@/components/TripcomCard";
import { AFFILIATE_DISCLOSURE_LONG } from "@/lib/affiliate";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";

const SITE_URL = "https://yurithai.jp";

export const metadata: Metadata = {
  title: "タイGLファンのためのバンコク旅行ガイド｜推し活＆聖地巡礼の完全マニュアル",
  description:
    "タイGLのファンミーティングや聖地巡礼でバンコクへ行く方向けに、航空券＋ホテルの手配方法、現地でのおすすめスポット、推し活の楽しみ方を網羅したガイド。",
  keywords: [
    "タイGL バンコク",
    "推し活 バンコク",
    "タイGL 聖地巡礼",
    "ファンミーティング バンコク",
    "Trip.com",
    "東京 バンコク 航空券",
    "推し活 旅行",
  ],
  alternates: { canonical: `${SITE_URL}/guide/travel-to-thailand` },
  openGraph: {
    title: "タイGLファンのためのバンコク旅行ガイド",
    description:
      "推し活・聖地巡礼でバンコクへ行く方向けの、航空券＋ホテル手配と現地での楽しみ方ガイド。",
    url: `${SITE_URL}/guide/travel-to-thailand`,
    siteName: "YuriThai",
    locale: "ja_JP",
    type: "article",
  },
};

export default function TravelGuidePage() {
  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ガイド", url: `${SITE_URL}/guide/travel-to-thailand` },
    { name: "バンコク旅行ガイド", url: `${SITE_URL}/guide/travel-to-thailand` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-6 py-10">
      <JsonLd data={breadcrumbData} />

      <nav className="text-xs text-yuri-muted mb-4" aria-label="パンくず">
        <Link href="/" className="hover:text-yuri-rose">トップ</Link>
        <span className="mx-1.5">/</span>
        <span>ガイド</span>
        <span className="mx-1.5">/</span>
        <span>バンコク旅行</span>
      </nav>

      {/* 冒頭のPR表示 */}
      <div className="bg-yuri-rose/10 border border-yuri-rose/30 rounded-md px-4 py-3 mb-6 text-xs text-yuri-ink/85 leading-relaxed">
        <strong className="font-medium text-yuri-rose">広告（PR）を含みます。</strong>{" "}
        本ページには Trip.com のアフィリエイトリンクが含まれます。
        リンク経由でご予約いただくと、YuriThai に紹介報酬が支払われる場合があります。
      </div>

      <h1 className="text-2xl md:text-3xl font-medium text-yuri-ink mb-3 leading-tight">
        タイGLファンのためのバンコク旅行ガイド — 推し活・聖地巡礼の完全マニュアル
      </h1>
      <p className="text-sm text-yuri-muted mb-8">最終更新: 2026年5月 · YuriThai 編集部</p>

      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        タイGLにハマると、いつかは行きたくなるのが**バンコク**。
        FreenBecky・LMSY・NamtanFilm・EmiBonnie といった推しのペアが
        ファンミーティングを開催したり、撮影地として登場するロケ地があったり——
        バンコクは**タイGLファンにとって聖地**そのもの。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        本ガイドでは、**東京〜バンコクの航空券・ホテル手配の方法**、
        **現地で訪れたいスポット**、**推し活を楽しむためのコツ**を整理しています。
        初めてのバンコク旅行から、リピーター向けの深掘り情報まで網羅。
      </p>

      <div className="bg-yuri-surface border border-yuri-edge rounded-md p-4 mb-8 text-sm">
        <p className="font-medium text-yuri-navy mb-2">目次</p>
        <ol className="list-decimal pl-5 space-y-1 text-yuri-ink/85">
          <li><a href="#why" className="hover:text-yuri-rose underline">なぜバンコクへ行くのか</a></li>
          <li><a href="#booking" className="hover:text-yuri-rose underline">航空券＋ホテルの手配</a></li>
          <li><a href="#timing" className="hover:text-yuri-rose underline">いつ行くべきか</a></li>
          <li><a href="#spots" className="hover:text-yuri-rose underline">タイGLファン向けスポット</a></li>
          <li><a href="#tips" className="hover:text-yuri-rose underline">推し活を楽しむコツ</a></li>
          <li><a href="#faq" className="hover:text-yuri-rose underline">よくある質問</a></li>
        </ol>
      </div>

      <h2 id="why" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        1. なぜバンコクへ行くのか
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイGLの**主要スタジオ・ファンミ会場のほぼすべて**がバンコクに集中しています。
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">ファンミーティング</strong>：FreenBecky・LMSY・NamtanFilm 等の主要ペアが年複数回開催</li>
        <li><strong className="font-medium">プレミア・試写会</strong>：新作ドラマの公開記念イベント</li>
        <li><strong className="font-medium">聖地巡礼</strong>：ドラマのロケ地、推しが訪れたカフェ、撮影スタジオ周辺</li>
        <li><strong className="font-medium">グッズ購入</strong>：タイGL公式グッズは現地で買うのが最も安価</li>
        <li><strong className="font-medium">タイ文化の体験</strong>：ドラマで観た光景を実際に味わえる</li>
      </ul>

      <h2 id="booking" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        2. 航空券＋ホテルの手配
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        東京（成田・羽田）からバンコク（スワンナプーム・ドンムアン）への直行便は
        **タイ航空（TG）、ANA、JAL、ZIPAIR、エアアジア** などが運行しています。
        所要時間は約**6〜7時間**。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        個別予約も可能ですが、**航空券＋ホテルのパッケージ**を使うと、
        ばらばらに予約するより**1人あたり1〜3万円安くなる**ケースが多くなります。
        とくに3泊以上の滞在では、パッケージの方がコストパフォーマンスが高い傾向。
      </p>

      {/* メインCTA */}
      <TripcomCard variant="wide" />

      <h3 className="text-base font-medium text-yuri-navy mt-8 mb-2">どこを基準にホテルを選ぶか</h3>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">スクンビット周辺</strong>：BTS（高架鉄道）でアクセスしやすく、観光・買物の中心地</li>
        <li><strong className="font-medium">サイアム・チットロム</strong>：百貨店密集地。ファンミーティング会場（Siam Pic-Ganesha、Centerpoint Studio 等）に近い</li>
        <li><strong className="font-medium">サパーンタクシン</strong>：チャオプラヤー川沿いで観光気分を味わいたい人向け</li>
      </ul>

      <h2 id="timing" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        3. いつ行くべきか
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        ファンミ参加が主目的なら、**開催日に合わせるのが鉄則**。
        ペアのSNSや YuriThai の[イベントカレンダー](/events) で告知をチェック。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        ファンミ以外で旅行するなら:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">11〜2月（乾季）</strong>：気候が最も快適。ベストシーズンだが料金高め</li>
        <li><strong className="font-medium">3〜5月（暑季）</strong>：最高気温が35℃以上に。料金は手頃</li>
        <li><strong className="font-medium">6〜10月（雨季）</strong>：スコール（短時間の激しい雨）あり。最も料金が安いシーズン</li>
      </ul>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        日本の祝日に合わせて行くと、現地のイベント・観光も賑わうので、
        **GW・お盆・年末年始** がオススメ（ただし最も高い時期）。
      </p>

      <h2 id="spots" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        4. タイGLファン向けスポット
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        ファンミ以外でも楽しめる、タイGLゆかりのスポット:
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">サイアム・パラゴン / Siam Paragon</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        バンコク最大級の百貨店。タイ俳優・アイドルのキャンペーン会場としてよく使われる。
        グッズショップやファッションブランドのコラボ商品が並ぶこともあります。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">セントラルワールド / CentralWorld</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        サイアムエリアの大型ショッピングモール。映画館もあり、
        タイのGLドラマ・映画の上映が見られることも。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">エンポリアム / EmQuartier</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        スクンビット地区のラグジュアリーモール。
        タイGL女優がブランドキャンペーンで登場することも。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">アイコンサイアム / IconSiam</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        チャオプラヤー川沿いの巨大複合施設。タイの文化・グルメ・ショッピングをまとめて楽しめる。
        観光と推し活を両立したい人向け。
      </p>

      <h2 id="tips" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        5. 推し活を楽しむコツ
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">事前にチケット確保</strong>：人気ペアのファンミは数分で完売。SNSのチケット販売情報をフォロー</li>
        <li><strong className="font-medium">タイ語が分からなくても大丈夫</strong>：ファンミは英語MC対応の事例多数。最低限「Sawatdee（こんにちは）」「Khob Khun（ありがとう）」を覚えておくと吉</li>
        <li><strong className="font-medium">推しの誕生日・記念日に合わせる</strong>：誕生日カフェ（ぬいぐるみ・写真撮影スペース付き）が街に登場することも</li>
        <li><strong className="font-medium">現地ファンと交流</strong>：タイ・国際ファンも多く参加するため、SNSで事前にコンタクトできると楽しい</li>
        <li><strong className="font-medium">推しグッズ予算は多めに</strong>：現地でしか買えない限定グッズ・公式チェキ・写真集等が大量</li>
      </ul>

      <h2 id="faq" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        6. よくある質問
      </h2>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. ファンミの予算はどれくらい必要？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        ファンミチケット：2,000〜10,000バーツ（8,500〜45,000円）程度。
        プレミア席はさらに高額。航空券＋ホテル＋現地費を合わせて、**3泊で総額10〜20万円**を目安に。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. クレジットカードは使えますか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        大半のホテル・百貨店で使えます。ただし**屋台や個人商店では現金のみ**のため、
        現地ATMでバーツを引き出せるカードを持っていくのがおすすめ。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. ビザは必要？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        日本国籍の方は**30日以内の観光ならビザ不要**（2026年5月時点）。
        パスポート残存期間が6か月以上必要。最新情報は外務省サイトでご確認ください。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. タイ語が話せなくても大丈夫？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        観光地・百貨店・ホテルでは英語が通じます。
        Google翻訳のオフライン版を入れておくと、屋台等でも安心。
      </p>

      {/* 締めCTA — パッケージ */}
      <div className="mt-10 mb-2">
        <TripcomCard variant="wide" />
      </div>

      {/* 補助CTA — 汎用検索（東京以外の出発地・他都市・他日程の人向け） */}
      <div className="mt-4 mb-2">
        <TripcomCard variant="wide" linkType="top" />
      </div>

      <hr className="my-10 border-yuri-edge" />

      <p className="text-xs text-yuri-muted leading-relaxed">
        {AFFILIATE_DISCLOSURE_LONG}
      </p>

      <h2 className="text-lg font-medium text-yuri-navy mb-3 mt-10">
        次に読むなら
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-8">
        <li><Link href="/events" className="text-yuri-rose hover:opacity-80 underline">タイGLイベントカレンダー</Link>（最新のファンミ情報）</li>
        <li><Link href="/blog/thai-gl-global-expansion" className="text-yuri-rose hover:opacity-80 underline">タイGLとグローバル展開</Link></li>
        <li><Link href="/blog/freenbecky-history" className="text-yuri-rose hover:opacity-80 underline">FreenBeckyの歴史</Link></li>
        <li><Link href="/guide/what-is-thai-gl" className="text-yuri-rose hover:opacity-80 underline">タイGLとは — 完全ガイド</Link></li>
      </ul>
    </div>
  );
}
