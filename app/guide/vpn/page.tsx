import Link from "next/link";
import type { Metadata } from "next";
import {
  NordVpnBanner,
  NordVpnBannerResponsive,
} from "@/components/NordVpnBanner";
import {
  NORDVPN,
  AFFILIATE_DISCLOSURE_LONG,
  NORD_TRADEMARK_ATTRIBUTION,
} from "@/lib/affiliate";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";

const SITE_URL = "https://yurithai.jp";

export const metadata: Metadata = {
  title: "VPNとタイGL — 海外配信サービスを知るためのガイド | YuriThai",
  description:
    "タイGLドラマは iQIYI（タイ）・AIS Play など現地サービスで先行配信されることがあります。VPNサービスの仕組み、選び方、注意点を整理した一般ガイド。広告（PR）を含みます。",
  keywords: [
    "タイGL",
    "VPN",
    "iQIYI",
    "AIS Play",
    "NordVPN",
    "タイドラマ 海外配信",
    "ジオ制限",
  ],
  alternates: { canonical: `${SITE_URL}/guide/vpn` },
  openGraph: {
    title: "VPNとタイGL — 海外配信サービスを知るためのガイド",
    description:
      "タイGLの海外配信を取り巻く状況と、VPNサービスの基本を整理した一般ガイド。広告を含みます。",
    url: `${SITE_URL}/guide/vpn`,
    siteName: "YuriThai",
    locale: "ja_JP",
    type: "article",
  },
};

export default function VpnGuidePage() {
  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ガイド", url: `${SITE_URL}/guide/vpn` },
    { name: "VPNとタイGL", url: `${SITE_URL}/guide/vpn` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-6 py-10">
      <JsonLd data={breadcrumbData} />

      {/* Breadcrumb */}
      <nav className="text-xs text-yuri-muted mb-4" aria-label="パンくず">
        <Link href="/" className="hover:text-yuri-rose">
          トップ
        </Link>
        <span className="mx-1.5">/</span>
        <span>ガイド</span>
        <span className="mx-1.5">/</span>
        <span>VPN</span>
      </nav>

      {/* 冒頭の広告表示（景表法のステマ規制対応） */}
      <div className="bg-yuri-rose/10 border border-yuri-rose/30 rounded-md px-4 py-3 mb-6 text-xs text-yuri-ink/85 leading-relaxed">
        <strong className="font-medium text-yuri-rose">広告（PR）を含みます。</strong>{" "}
        本ページは NordVPN® のアフィリエイトリンクを含みます。
        リンク経由でご加入いただくと、YuriThai に紹介報酬が支払われる場合があります。
      </div>

      <h1 className="text-2xl md:text-3xl font-medium text-yuri-ink mb-3 leading-tight">
        VPNとタイGL — 海外配信サービスを知るためのガイド
      </h1>
      <p className="text-sm text-yuri-muted mb-8">
        最終更新: 2026年5月 · YuriThai 編集部
      </p>

      {/* リード */}
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        タイGLドラマの新作は、日本の主要配信サービス（TELASA・U-NEXT 等）で観られるとは限らず、
        <strong className="font-medium">iQIYI（タイ）</strong>・
        <strong className="font-medium">AIS Play</strong>・
        <strong className="font-medium">TrueID</strong>{" "}
        といった現地の配信プラットフォームで先行公開されることがあります。
        このページでは、こうした海外配信サービスを取り巻く状況と、
        VPN（Virtual Private Network）という技術の基本、そして実際に検討する際の注意点を整理します。
      </p>

      {/* 目次 */}
      <div className="bg-yuri-surface border border-yuri-edge rounded-md p-4 mb-8 text-sm">
        <p className="font-medium text-yuri-navy mb-2">目次</p>
        <ol className="list-decimal pl-5 space-y-1 text-yuri-ink/85">
          <li><a href="#why" className="hover:text-yuri-rose underline">海外配信の現状と「ジオ制限」</a></li>
          <li><a href="#vpn-basics" className="hover:text-yuri-rose underline">VPNとは何か</a></li>
          <li><a href="#pick" className="hover:text-yuri-rose underline">VPNサービスを選ぶときに見る項目</a></li>
          <li><a href="#nordvpn" className="hover:text-yuri-rose underline">NordVPN®について（広告）</a></li>
          <li><a href="#cautions" className="hover:text-yuri-rose underline">利用時の注意点</a></li>
          <li><a href="#faq" className="hover:text-yuri-rose underline">よくある質問</a></li>
        </ol>
      </div>

      {/* 1. なぜ */}
      <h2 id="why" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        1. 海外配信の現状と「ジオ制限」
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        多くの動画配信サービスは、配信権の取り決めにより
        「特定の国・地域からのアクセスのみ視聴可能」とする<strong className="font-medium">ジオ制限（地域制限）</strong>
        を設定しています。日本から iQIYI のタイ版にアクセスすると、
        作品によっては「お住まいの地域では視聴できません」と表示される場合があるのは、このためです。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        これは違法な仕組みではなく、各サービスの事業判断・契約上の制限です。
        日本市場向けに正式配信されている作品は、TELASA・U-NEXT・Netflix・iQIYI日本などで観られるものもあるため、
        まずは日本国内で正式配信されていないか確認することをおすすめします。
      </p>

      {/* 2. VPN基本 */}
      <h2 id="vpn-basics" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        2. VPNとは何か
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        VPN（Virtual Private Network）は、インターネット通信を暗号化し、
        VPN事業者のサーバーを経由して接続する技術の総称です。
        本来の用途は、公衆Wi-Fiでの通信保護や、企業内ネットワークへの安全なリモート接続といった
        <strong className="font-medium">セキュリティ・プライバシー目的</strong>です。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        副次的に、選んだサーバーの所在国のIPアドレス経由で通信することになるため、
        「海外サイトを現地と同じ表示で閲覧できる」ケースが生じます。
        ただし、各配信サービスは利用規約で「他地域からのアクセスを禁止」「VPN使用を禁止」と定めていることがあり、
        ご自身でご利用前に必ず規約を確認してください。
      </p>

      {/* 3. 選び方 */}
      <h2 id="pick" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        3. VPNサービスを選ぶときに見る項目
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">サーバーの所在国</strong> — 接続したい国（タイなど）にサーバーがあるか。</li>
        <li><strong className="font-medium">通信速度</strong> — 動画視聴では実効速度が体感に直結します。</li>
        <li><strong className="font-medium">対応プラットフォーム</strong> — スマホ・PC・Fire TV など利用環境に対応しているか。</li>
        <li><strong className="font-medium">ノーログポリシー</strong> — 通信ログを保存しない方針を明示し、独立監査を受けているか。</li>
        <li><strong className="font-medium">返金保証</strong> — 自分の回線環境で試してから判断できる仕組みがあると安心。</li>
      </ul>

      {/* 4. NordVPN（広告） */}
      <h2 id="nordvpn" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        4. NordVPN®について（広告）
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        NordVPN®は、Nord Security（リトアニア発のサイバーセキュリティ企業）が提供する VPN サービスです。
        YuriThai では NordVPN のアフィリエイトプログラムに参加しており、
        本セクション以下のリンクは広告（PR）です。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        以下は、NordVPN 公式が公表している主な特徴です（最新情報は公式サイトをご確認ください）。
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        <li>110か国以上にサーバーを展開（タイを含む）</li>
        <li>独自の NordLynx プロトコルを提供</li>
        <li>Windows / macOS / Linux / iOS / Android / Fire TV など複数プラットフォームに対応</li>
        <li>30日間返金保証を公表</li>
        <li>ノーログポリシーについて第三者監査を受けたとアナウンス</li>
      </ul>

      {/* メインCTA — 「国境のないインターネット」バナー（タイGL文脈に最も合う） */}
      <div className="my-4">
        <NordVpnBannerResponsive
          mobileBanner="borderless_1200x628"
          desktopBanner="borderless_1200x628"
          priority
        />
      </div>

      {/* 5. 注意 */}
      <h2 id="cautions" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        5. 利用時の注意点
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>各配信サービスの<strong className="font-medium">利用規約・現地法令</strong>を必ずご自身で確認してください。VPN利用や地域外アクセスを禁止しているサービスでは規約違反となる可能性があります。</li>
        <li>VPNは通信経路を選ぶ技術であり、<strong className="font-medium">海賊版コンテンツの視聴を推奨するものではありません</strong>。必ず正規の配信サービスをご利用ください。</li>
        <li>無料VPNは一般に速度・サーバー数・セキュリティ面で有料VPNに及ばないことが多いとされます。</li>
        <li>勤務先支給のPCやネット回線では、社内のセキュリティ規程を確認してから利用してください。</li>
        <li>本ページに記載のサービス内容・条件・キャンペーンは執筆時点のものであり、最新情報は必ずリンク先の公式サイトでご確認ください。</li>
      </ul>

      {/* 中段バナー — セキュリティ訴求 */}
      <div className="my-8">
        <NordVpnBannerResponsive
          mobileBanner="cybersec_1200x628"
          desktopBanner="cybersec_1500x300"
        />
      </div>

      {/* 6. FAQ */}
      <h2 id="faq" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        6. よくある質問
      </h2>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. 日本国内でVPNを使うこと自体は合法ですか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        日本国内でVPN技術を使うこと自体は、現行法上違法ではないとされています。
        ただし、特定のサービスの規約に違反する形での利用は、
        当該サービスの規約違反やアカウント停止等につながる可能性があります。
        個別ケースの判断は弁護士等の専門家にご相談ください。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. VPN を使うと回線速度はどう変化しますか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        通信が暗号化され、別経路を通る関係で、一般に多少の速度低下が発生します。
        どの程度の影響があるかは、ご利用の回線環境・接続先サーバー・時間帯によって大きく変わります。
        多くの有料VPNには返金保証があるため、まずは保証期間内で実際に試して判断するのが現実的です。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. iQIYI Thailand の登録はどうすれば？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        登録方法・対応決済手段は iQIYI 側の仕様変更が多いため、
        最新情報は iQIYI 公式のヘルプセンターで直接ご確認ください。
      </p>

      {/* 最終 CTA — 「国境のないインターネット」で締める */}
      <div className="mt-10 mb-2">
        <NordVpnBannerResponsive
          mobileBanner="borderless_1200x628"
          desktopBanner="borderless_1500x300"
        />
      </div>

      {/* 末尾の disclosure ブロック */}
      <hr className="my-10 border-yuri-edge" />

      <div className="text-[11px] text-yuri-muted leading-relaxed space-y-3 bg-yuri-surface border border-yuri-edge rounded-md p-4">
        <p>{AFFILIATE_DISCLOSURE_LONG}</p>
        <p>{NORD_TRADEMARK_ATTRIBUTION}</p>
      </div>

      {/* バナーHTMLが提供されていればここに表示（lib/affiliate.ts の bannerHtml） */}
      {NORDVPN.bannerHtml && (
        <div className="mt-6 mb-8">
          <p className="text-[10px] text-yuri-muted mb-2 tracking-wider">
            広告（NordVPN®公式提供クリエイティブ）
          </p>
          <div
            className="overflow-hidden rounded-md border border-yuri-edge"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: NORDVPN.bannerHtml }}
          />
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/dramas"
          className="inline-flex items-center gap-1 text-sm text-yuri-rose hover:opacity-80"
        >
          ← タイGL作品一覧に戻る
        </Link>
      </div>
    </div>
  );
}
