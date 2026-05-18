import Link from "next/link";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "利用規約 | YuriThai",
  description:
    "YuriThai（運営: 合同会社FUMOMERU）の利用規約。著作権、禁止事項、免責、アフィリエイト広告の取り扱いについて。",
  alternates: { canonical: `${OPERATOR.siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-12 prose-yuri">
      <h1 className="text-2xl font-medium text-yuri-ink mb-2 !font-sans">
        利用規約
      </h1>
      <p className="text-xs text-yuri-muted mb-8">
        制定日: 2026年5月
      </p>

      <div className="text-sm text-yuri-ink/85 leading-[1.9] space-y-1">
        <p>
          本利用規約（以下「本規約」）は、{OPERATOR.companyName}（以下「当社」）が運営する
          <strong className="font-medium">YuriThai</strong>（以下「当サイト」）の利用条件を定めるものです。
          利用者は本規約に同意のうえ当サイトを利用するものとします。
        </p>

        <h2>第1条（適用）</h2>
        <p>
          本規約は、当サイトを利用するすべての利用者と当社との間の一切の関係に適用されます。
        </p>

        <h2>第2条（著作権）</h2>
        <p>
          当サイトに掲載されている文章・ロゴ・データベースの構造・タグ分類等の著作権は当社に帰属します。
          作品の画像・動画・タイトルロゴ等の著作権は各制作会社・権利者に帰属し、
          当サイトは紹介・批評の目的で必要最小限の範囲で引用しています。
        </p>

        <h2>第3条（禁止事項）</h2>
        <p>利用者は、当サイトの利用にあたり、以下の行為を行ってはなりません。</p>
        <ul>
          <li>掲載内容の無断転載・複製・改変</li>
          <li>営利目的での当サイトデータの再利用（スクレイピング等を含む）</li>
          <li>当サイト・当社・関係者および掲載作品の関係者を誹謗中傷する行為</li>
          <li>法令または公序良俗に違反する行為</li>
          <li>当サイトの運営を妨害する行為</li>
        </ul>

        <h2>第4条（アフィリエイト広告）</h2>
        <p>
          当サイトには、{" "}
          <strong className="font-medium">NordVPN®</strong>{" "}
          を含む第三者のアフィリエイト広告が含まれます。
          広告リンクから商品・サービスをご利用いただいた場合、
          当社は広告主から所定の紹介報酬を受け取ることがあります。
        </p>
        <p>
          掲載されている商品・サービスの内容・価格・提供条件・キャンペーン等は、
          各広告主（リンク先の事業者）が定めるものであり、当社はその正確性・最新性を保証しません。
          ご利用にあたっては、必ずリンク先の公式ページに記載された条件をご確認ください。
        </p>
        <p>
          広告掲載に関する詳細は{" "}
          <Link
            href="/legal/advertising"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            広告掲載ポリシー
          </Link>
          をご覧ください。
        </p>

        <h2>第5条（免責）</h2>
        <p>
          当社は、当サイトに掲載する情報の正確性に努めますが、その完全性・最新性・有用性を保証しません。
          配信状況・キャスト情報・放送日程などは各サービスの公式情報をご確認ください。
          利用者が当サイトの情報を利用したことによって生じた損害について、
          当社は法令で認められる範囲で一切の責任を負わないものとします。
        </p>

        <h2>第6条（規約の変更）</h2>
        <p>
          当社は、必要と判断した場合には、利用者への事前の通知なく本規約を変更できるものとします。
          変更後の規約は当サイトに掲載した時点で効力を生じます。
        </p>

        <h2>第7条（準拠法・管轄）</h2>
        <p>
          本規約の解釈にあたっては日本法を準拠法とし、
          当サイトに関連して紛争が生じた場合は、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
        </p>

        <h2>第8条（運営者）</h2>
        <p>
          {OPERATOR.companyName}（代表者: {OPERATOR.representativeName}）
          <br />
          所在地: 〒{OPERATOR.postalCode} {OPERATOR.address}
          <br />
          連絡先: <span>{OPERATOR.contactEmailDisplay}</span>
          <span className="text-xs text-yuri-muted ml-1">（@を半角に変換してご利用ください）</span>
        </p>
      </div>
    </div>
  );
}
