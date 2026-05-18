import Link from "next/link";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "About / 運営者情報 | YuriThai",
  description:
    "YuriThai（ユリタイ）は、日本人ファンに向けてタイGLドラマの情報を整理・紹介する日本語特化メディア。レビュー・配信先・女優情報・診断機能を日本語で。",
  alternates: { canonical: `${OPERATOR.siteUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-12">
      <h1 className="text-2xl font-medium text-yuri-ink mb-6">
        About / 運営者情報
      </h1>

      <section className="text-sm text-yuri-ink/85 leading-[1.9] space-y-4 mb-10">
        <p>
          <strong className="font-medium">YuriThai（ユリタイ）</strong>{" "}
          は、日本人ファンに向けて
          <strong className="font-medium">タイGL（百合）ドラマ</strong>の情報を整理・紹介する
          日本語特化メディアです。
        </p>
        <p>
          作品ごとのレビュー、配信先、女優・ペア情報、タグ別の検索、
          「あなたに合うタイGL」を見つける診断機能などを通じて、
          日本人ファンがタイGLを楽しむためのハブとなることを目指しています。
        </p>
        <p>
          サイトの運営費・記事制作費は、一部アフィリエイト広告による収益で賄っています。
          広告掲載に関する方針は{" "}
          <Link
            href="/legal/advertising"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            広告掲載ポリシー
          </Link>
          をご覧ください。運営者の詳細は下記の表をご参照ください。
        </p>
        <p className="text-xs text-yuri-muted">
          ※ 作品の画像・映像・タイトルロゴ等の著作権は各制作会社・権利者に帰属します。
          引用にあたっては、出典の明示と必要最小限の範囲を遵守しています。
        </p>
      </section>

      <h2 className="text-lg font-medium text-yuri-navy mb-3 pb-1 border-b border-yuri-edge">
        運営者情報
      </h2>
      <table className="w-full text-sm mb-10">
        <tbody className="divide-y divide-yuri-edge">
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted w-32 text-left font-normal align-top"
            >
              法人名
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
              事業内容
            </th>
            <td className="py-3 align-top">
              ウェブメディア運営、アフィリエイト広告事業
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-3 pr-4 text-yuri-muted text-left font-normal align-top"
            >
              連絡先
            </th>
            <td className="py-3 align-top break-all">
              <span>{OPERATOR.contactEmailDisplay}</span>
              <span className="block text-[11px] text-yuri-muted mt-0.5">
                ※ ご利用の際は ＠ を半角@に変換してください
              </span>
              <div className="mt-1.5">
                <Link
                  href={OPERATOR.contactPath}
                  className="text-yuri-rose hover:opacity-80"
                >
                  お問い合わせフォーム →
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-xs text-yuri-muted">
        関連: <Link href="/legal/tokushoho" className="hover:text-yuri-rose underline">特定商取引法に基づく表記</Link>
        {" · "}
        <Link href="/privacy" className="hover:text-yuri-rose underline">プライバシーポリシー</Link>
        {" · "}
        <Link href="/terms" className="hover:text-yuri-rose underline">利用規約</Link>
        {" · "}
        <Link href="/legal/advertising" className="hover:text-yuri-rose underline">広告掲載ポリシー</Link>
      </p>
    </div>
  );
}
