import Link from "next/link";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "YuriThai（ユリタイ）について｜運営者情報",
  description:
    "YuriThai（ユリタイ／ゆりたい）は、タイGL（タイ百合ドラマ）を日本語でまとめた専門情報サイト。作品レビュー・配信先・女優プロフィール・ペア解説・おすすめ診断・聖地巡礼・ファンミ情報まで網羅。完結作品23本、放送中6本、公開予定12本以上、ブログ記事75本超を掲載中。運営者情報、広告掲載ポリシーもこちらから。",
  keywords: [
    "YuriThai",
    "ユリタイ",
    "ゆりたい",
    "YuriThai 運営",
    "ユリタイ 運営",
    "タイGL",
    "タイGL 情報サイト",
    "タイ百合 サイト",
  ],
  alternates: { canonical: `${OPERATOR.siteUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-10 md:py-12">
      <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-2">
        YuriThai（ユリタイ）について
      </h1>
      <p className="text-[13px] md:text-xs text-yuri-muted tracking-wider mb-6">
        About / 運営者情報
      </p>

      <section className="text-[15px] md:text-sm text-yuri-ink/85 leading-[1.95] md:leading-[1.9] space-y-4 mb-10">
        <p>
          <strong className="font-medium">YuriThai（ユリタイ／ゆりたい）</strong>{" "}
          は、<strong className="font-medium">タイGL（タイ百合ドラマ）</strong>を
          日本語でまとめた専門情報サイトです。
          タイで制作される女性同士のロマンスを描いた作品を、
          作品レビュー・配信先・女優プロフィール・ペア解説・おすすめ診断・聖地巡礼・ファンミ情報まで、
          タイGL初心者から既存ファンまで使えるリファレンスとして整理しています。
        </p>
        <p>
          現在掲載しているタイGL情報は、
          <Link
            href="/dramas"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            完結作品23本
          </Link>
          、
          <Link
            href="/dramas/airing"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            放送中6本
          </Link>
          、
          <Link
            href="/dramas/upcoming"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            公開予定12本以上
          </Link>
          、
          <Link
            href="/cast"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            女優プロフィール
          </Link>
          、
          <Link
            href="/blog"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            特集記事75本超
          </Link>
          に渡ります。タイGL作品の選び方に迷ったら
          <Link
            href="/recommend"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            おすすめ診断
          </Link>
          、ジャンル自体の理解には
          <Link
            href="/guide/what-is-thai-gl"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            「タイGLとは」完全ガイド
          </Link>
          、日本から海外配信を観るには
          <Link
            href="/guide/vpn"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            VPNガイド
          </Link>
          、現地イベント参加には
          <Link
            href="/guide/travel-to-thailand"
            className="text-yuri-rose hover:opacity-80 underline"
          >
            バンコク旅行ガイド
          </Link>
          をご利用ください。
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
        <p className="text-[13px] md:text-xs text-yuri-muted">
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
              請求があり次第、遅滞なく開示いたします。
              <br />
              <span className="text-xs text-yuri-muted">
                詳細は{" "}
                <Link
                  href="/legal/tokushoho"
                  className="text-yuri-rose hover:opacity-80 underline"
                >
                  特定商取引法に基づく表記
                </Link>
                をご覧ください。
              </span>
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
              請求があり次第、遅滞なく開示いたします。
              <br />
              <span className="text-xs text-yuri-muted">
                詳細は{" "}
                <Link
                  href="/legal/tokushoho"
                  className="text-yuri-rose hover:opacity-80 underline"
                >
                  特定商取引法に基づく表記
                </Link>
                をご覧ください。
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
