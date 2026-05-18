import Link from "next/link";
import { OPERATOR, formatOperatorAddress } from "@/lib/operator";

export const metadata = {
  title: "特定商取引法に基づく表記 | YuriThai",
  description:
    "YuriThai 運営者の特定商取引法に基づく表記。",
  alternates: { canonical: `${OPERATOR.siteUrl}/legal/tokushoho` },
};

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-12">
      <h1 className="text-2xl font-medium text-yuri-ink mb-2">
        特定商取引法に基づく表記
      </h1>
      <p className="text-xs text-yuri-muted mb-8">
        最終更新: 2026年5月
      </p>

      <table className="w-full text-sm">
        <tbody className="divide-y divide-yuri-edge">
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted w-32 text-left font-normal align-top"
            >
              事業者名
            </th>
            <td className="py-3 align-top">
              {OPERATOR.companyName}
              <br />
              <span className="text-xs text-yuri-muted">
                （{OPERATOR.companyNameEn}）
              </span>
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              代表者
            </th>
            <td className="py-3 align-top">
              {OPERATOR.representativeTitle} {OPERATOR.representativeName}
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              所在地
            </th>
            <td className="py-3 align-top">
              〒{OPERATOR.postalCode}
              <br />
              {OPERATOR.address}
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              電話番号
            </th>
            <td className="py-3 align-top">
              請求があり次第、遅滞なく開示いたします。
              <br />
              ご請求は下記メールアドレスまたは{" "}
              <Link
                href={OPERATOR.contactPath}
                className="text-yuri-rose hover:opacity-80 underline"
              >
                お問い合わせフォーム
              </Link>
              よりお願いいたします。
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              メールアドレス
            </th>
            <td className="py-3 align-top break-all">
              <span>{OPERATOR.contactEmailDisplay}</span>
              <span className="block text-[11px] text-yuri-muted mt-0.5">
                ※ お使いの際は ＠ を半角@に変換してください
              </span>
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              事業内容
            </th>
            <td className="py-3 align-top">
              タイGL（百合）ドラマ情報を扱うウェブメディアの運営、
              および同メディア上でのアフィリエイト広告の掲載。
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              商品・サービスの販売
            </th>
            <td className="py-3 align-top">
              当サイト運営者は、商品・サービスの直接の販売および代金収受を行いません。
              当サイトに掲載されるアフィリエイト広告から遷移した先の商品・サービスの
              販売条件、価格、契約・返金等は、各広告主（リンク先の事業者）が定める内容に従います。
              ご利用にあたっては、必ずリンク先の公式ページに記載された
              利用規約・特定商取引法に基づく表記・キャンセルポリシー等をご確認ください。
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              広告掲載に関する事項
            </th>
            <td className="py-3 align-top">
              当サイトには事業者から報酬を得るアフィリエイト広告が含まれます。
              詳細は{" "}
              <Link
                href="/legal/advertising"
                className="text-yuri-rose hover:opacity-80 underline"
              >
                広告掲載ポリシー
              </Link>
              をご覧ください。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
