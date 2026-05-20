import Link from "next/link";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "プライバシーポリシー | YuriThai",
  description:
    "YuriThai における個人情報の取り扱い・Cookie・アフィリエイトに関する方針。",
  alternates: { canonical: `${OPERATOR.siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-12 prose-yuri">
      <h1 className="text-2xl font-medium text-yuri-ink mb-2 !font-sans">
        プライバシーポリシー
      </h1>
      <p className="text-xs text-yuri-muted mb-8">
        制定日: 2026年5月 / 改定日: 2026年5月20日
      </p>

      <div className="text-sm text-yuri-ink/85 leading-[1.9] space-y-1">
        <p>
          <strong className="font-medium">YuriThai</strong>（以下「当サイト」）の運営者
          （以下「当社」、{" "}
          <Link href="/about" className="text-yuri-rose hover:opacity-80 underline">
            運営者情報
          </Link>
          に記載）は、当サイトにおける個人情報の取り扱いについて、
          以下のとおり方針を定めます。
        </p>

        <h2>1. 取得する情報</h2>
        <p>当サイトでは、以下の情報を取得することがあります。</p>
        <ul>
          <li>お問い合わせフォームから送信された氏名・メールアドレス・電話番号・会社名・本文の内容</li>
          <li>アクセス解析ツール（Vercel Analytics、Google Analytics 4）による匿名のアクセスログ（ページビュー、リファラ、デバイス種別、概算地域 等）。IPアドレスは Google Analytics 側で匿名化されます。</li>
          <li>診断機能などのユーザー操作状態（ブラウザの LocalStorage に保存）</li>
        </ul>

        <h2>2. 利用目的</h2>
        <ul>
          <li>お問い合わせへの返信および対応のため</li>
          <li>当サイトのコンテンツ改善および利用状況の把握のため</li>
          <li>不正利用・ボット投稿の防止のため</li>
        </ul>

        <h2>3. Cookie・LocalStorage の利用</h2>
        <p>
          当サイトは、サイト機能の維持・アクセス解析・診断機能の状態保持のため、
          Cookie および LocalStorage を使用する場合があります。
          ブラウザの設定でこれらを無効化することができますが、その場合、
          一部の機能が正常に動作しない可能性があります。
        </p>

        <h2>4. アフィリエイト広告と第三者 Cookie</h2>
        <p>
          当サイトは <strong className="font-medium">NordVPN®</strong>
          （Nord Security / Nordsec Ltd. 提供）および
          <strong className="font-medium">Trip.com</strong>
          （Trip.com Group Ltd. 提供）の
          アフィリエイト広告プログラムに参加しています。
          これらの広告リンクをクリックして広告主のサイトに遷移した際、
          広告主または広告ネットワーク（Impact 等）が、成果計測のために
          訪問者のブラウザに Cookie を設定することがあります。
        </p>
        <p>
          また、当サイトは Google 社の広告配信サービス
          <strong className="font-medium">Google AdSense</strong>
          を利用する場合があります。Google AdSense は Cookie を使用して、
          当サイトおよび他のサイトへのアクセスに関する情報に基づいて、
          利用者の興味に応じた広告を配信します。
          Cookie を無効にする方法および Google AdSense の詳細については、
          {" "}<a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-yuri-rose hover:opacity-80 underline">広告 - ポリシーと規約 – Google</a>{" "}
          をご確認ください。
        </p>
        <p>
          これらの第三者 Cookie の取得・利用は、各広告主または広告ネットワークの
          プライバシーポリシーに基づき、当社の管理外で行われます。
          当社は個別の訪問者の閲覧履歴を取得・保持しません。
        </p>
        <p>
          第三者 Cookie の無効化は、お使いのブラウザの設定または各広告ネットワークの
          オプトアウトページから行うことができます。
        </p>

        <h2>5. 第三者提供</h2>
        <p>
          当社は、法令に基づく場合および本人の同意がある場合を除き、
          取得した個人情報を第三者に提供することはありません。
        </p>

        <h2>6. 個人情報の開示・訂正・削除</h2>
        <p>
          ご本人からの開示・訂正・削除のご請求があった場合は、
          ご本人確認のうえ、合理的な範囲で速やかに対応いたします。
          下記の問い合わせ窓口までご連絡ください。
        </p>

        <h2>7. 改定</h2>
        <p>
          本ポリシーは法令の改正やサービス内容の変更に応じて改定する場合があります。
          改定後の内容は当ページに掲載した時点で効力を生じます。
        </p>

        <h2>8. 問い合わせ窓口</h2>
        <p>
          運営者の名称・住所等は{" "}
          <Link href="/about" className="text-yuri-rose hover:opacity-80 underline">
            運営者情報
          </Link>
          に記載しています。お問い合わせは{" "}
          <Link href={OPERATOR.contactPath} className="text-yuri-rose hover:opacity-80 underline">
            お問い合わせフォーム
          </Link>
          より承ります。
        </p>
      </div>
    </div>
  );
}
