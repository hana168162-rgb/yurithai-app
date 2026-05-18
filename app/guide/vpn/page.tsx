import Link from "next/link";
import type { Metadata } from "next";
import { NordVpnCard } from "@/components/NordVpnCard";
import { NORDVPN, AFFILIATE_DISCLOSURE_LONG } from "@/lib/affiliate";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";

const SITE_URL = "https://yurithai.jp";

export const metadata: Metadata = {
  title: "日本からタイGLを観るためのVPN完全ガイド | YuriThai",
  description:
    "iQIYI（タイ）・AIS Play などジオ制限のあるタイGLドラマを、日本から快適に視聴する方法。VPNが必要な理由から、NordVPN を実際に使った設定手順までを解説。",
  keywords: [
    "タイGL",
    "VPN",
    "iQIYI",
    "AIS Play",
    "NordVPN",
    "タイドラマ 日本",
    "ジオ制限",
    "海外配信",
  ],
  alternates: { canonical: `${SITE_URL}/guide/vpn` },
  openGraph: {
    title: "日本からタイGLを観るためのVPN完全ガイド",
    description:
      "iQIYI・AIS Play などジオ制限のあるタイGLを日本から観るためのVPN活用法を、NordVPN を例に解説。",
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
    { name: "タイGLを観るためのVPN", url: `${SITE_URL}/guide/vpn` },
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

      <h1 className="text-2xl md:text-3xl font-medium text-yuri-ink mb-3 leading-tight">
        日本からタイGLを観るためのVPN完全ガイド
      </h1>
      <p className="text-sm text-yuri-muted mb-8">
        最終更新: 2026年5月 · YuriThai 編集部
      </p>

      {/* リード */}
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        タイGLドラマの本数は年々増えていますが、日本の TELASA・U-NEXT
        などで観られる作品は実はごく一部です。最新作の多くは
        <strong className="font-medium"> iQIYI（タイ）</strong> や{" "}
        <strong className="font-medium">AIS Play</strong>、{" "}
        <strong className="font-medium">TrueID</strong> といった現地サービスで先行配信され、
        日本のIPアドレスからはそのまま観られないことがあります。
        このページでは、こうした「ジオ制限（地域制限）」を解除して、
        タイGLを公式ルートで快適に観るための VPN
        の使い方を、実際に編集部が使っている NordVPN を例に解説します。
      </p>

      {/* 目次 */}
      <div className="bg-yuri-surface border border-yuri-edge rounded-md p-4 mb-8 text-sm">
        <p className="font-medium text-yuri-navy mb-2">目次</p>
        <ol className="list-decimal pl-5 space-y-1 text-yuri-ink/85">
          <li><a href="#why" className="hover:text-yuri-rose underline">なぜVPNが必要なのか</a></li>
          <li><a href="#pick" className="hover:text-yuri-rose underline">タイGL視聴に向くVPNの条件</a></li>
          <li><a href="#nordvpn" className="hover:text-yuri-rose underline">編集部が選んだ NordVPN</a></li>
          <li><a href="#howto" className="hover:text-yuri-rose underline">使い方（4ステップ）</a></li>
          <li><a href="#cautions" className="hover:text-yuri-rose underline">使用上の注意</a></li>
          <li><a href="#faq" className="hover:text-yuri-rose underline">よくある質問</a></li>
        </ol>
      </div>

      {/* 1. なぜ */}
      <h2 id="why" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        1. なぜVPNが必要なのか
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイGLの公式配信プラットフォームの大半は、配信権の都合で
        「特定の国・地域からのアクセスのみ視聴可能」という制限をかけています。
        たとえば <strong className="font-medium">iQIYI のタイ版</strong> は、
        タイ国内からアクセスすると視聴できる作品が、日本からだと
        「お住まいの地域では視聴できません」と表示されることがあります。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        VPN（Virtual Private Network）を使うと、通信を暗号化したうえで、
        指定した国のサーバー経由でインターネットに接続できます。
        つまり「タイのサーバー」につなげば、配信側からは
        「タイ国内からのアクセス」として認識され、現地と同じカタログを観られるようになります。
      </p>

      {/* 2. 条件 */}
      <h2 id="pick" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        2. タイGL視聴に向くVPNの条件
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">タイのサーバーを持っていること</strong> — 最低条件。</li>
        <li><strong className="font-medium">速度が十分</strong> — 動画を高画質で観るのに必要。1080p/4K で止まらない実効速度が出るか。</li>
        <li><strong className="font-medium">スマホアプリが安定</strong> — タイGLはスマホで観る人も多いので、iOS/Android アプリの完成度が重要。</li>
        <li><strong className="font-medium">ノーログポリシー</strong> — 通信内容を保存しない方針を明示しているか。</li>
        <li><strong className="font-medium">返金保証</strong> — 「契約してみたけど自分の環境では遅い」というケースに備える。</li>
      </ul>

      {/* 3. NordVPN */}
      <h2 id="nordvpn" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        3. 編集部が選んだ NordVPN
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        編集部では <strong className="font-medium">NordVPN</strong> を実際に使ってタイGLの配信状況を確認しています。
        理由は次のとおり。
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        <li>タイを含む 110+ 国にサーバーがあり、タイサーバーの数も十分。</li>
        <li>NordLynx プロトコルで実効速度が速く、1080p で止まらず観られた。</li>
        <li>iOS/Android/Windows/Mac/Fire TV などほぼ全環境で動く。</li>
        <li>30日間返金保証 — 自分の回線環境で試してから判断できる。</li>
        <li>厳格なノーログポリシーが独立監査済み。</li>
      </ul>

      {/* メイン CTA カード */}
      <NordVpnCard variant="wide" />

      {/* 4. How to */}
      <h2 id="howto" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        4. 使い方（4ステップ）
      </h2>
      <ol className="list-decimal pl-6 space-y-3 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>
          <strong className="font-medium">NordVPN に登録</strong>{" "}
          — 上記リンクから公式サイトでプランを選び、メールアドレスで登録。
        </li>
        <li>
          <strong className="font-medium">アプリをダウンロード</strong>{" "}
          — スマホで観るなら iOS/Android アプリ、PC やテレビなら各端末向けアプリ。
        </li>
        <li>
          <strong className="font-medium">タイのサーバーに接続</strong>{" "}
          — アプリ内の国リストから「Thailand」を選ぶだけ。1タップで完了。
        </li>
        <li>
          <strong className="font-medium">iQIYI / AIS Play などを開く</strong>{" "}
          — 現地と同じカタログが表示されるはず。サインアップは現地のクレジットカードや
          外国でも使える決済手段を求められる場合があります（後述のFAQ参照）。
        </li>
      </ol>

      {/* 5. 注意 */}
      <h2 id="cautions" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        5. 使用上の注意
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>各配信サービスの利用規約を必ず確認してください。VPNの利用や地域外からのアクセスを禁止しているサービスもあります。</li>
        <li>VPNはあくまで通信経路の選択肢を増やす技術であり、海賊版コンテンツを推奨するものではありません。<strong className="font-medium">必ず正規の配信サービスを利用</strong> してください。</li>
        <li>無料VPNは速度・セキュリティ・サーバー数のいずれも有料VPNに劣ることが多いです。長期的に観るなら有料VPNを推奨。</li>
        <li>仕事用のネット回線（会社支給PCなど）でVPNを使う場合は、社内ポリシーを確認してください。</li>
      </ul>

      {/* 6. FAQ */}
      <h2 id="faq" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        6. よくある質問
      </h2>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. iQIYI Thailand の登録はクレジットカードがなくてもできますか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        iQIYI は日本のクレジットカードでも登録できるケースが多いですが、
        サブスクの種類・キャンペーンによっては現地決済が必要になることがあります。
        最新の決済手段は iQIYI のサポートページで確認してください。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. VPN を使うと回線速度が落ちますか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        多少落ちますが、NordVPN の NordLynx
        プロトコルでは編集部の光回線でも1080pストリーミングに十分な実効速度が出ています。
        ご自宅の回線速度や使用時間帯にもよるので、まずは返金保証期間内で試すのがおすすめです。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">
        Q. 違法ではないですか？
      </h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        日本国内でVPNを使うこと自体は合法です。
        ただし「VPNを使って各配信サービスの利用規約に反する形で観る」ことは、
        当該サービスの規約違反になる可能性があります。
        各サービスの規約と現地法令を必ずご自身でご確認ください。
      </p>

      {/* セカンダリ CTA */}
      <div className="mt-10 mb-8">
        <NordVpnCard variant="wide" />
      </div>

      {/* バナーHTMLが提供されていればここに表示（lib/affiliate.ts の bannerHtml） */}
      {NORDVPN.bannerHtml && (
        <div className="mt-6 mb-8">
          <p className="text-[10px] text-yuri-muted mb-2 tracking-wider">SPONSORED</p>
          <div
            className="overflow-hidden rounded-md border border-yuri-edge"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: NORDVPN.bannerHtml }}
          />
        </div>
      )}

      <hr className="my-10 border-yuri-edge" />

      <p className="text-xs text-yuri-muted leading-relaxed">
        {AFFILIATE_DISCLOSURE_LONG}
      </p>

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
