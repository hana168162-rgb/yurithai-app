export const metadata = { title: "利用規約 | YuriThai" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-display font-medium text-yuri-ink mb-4">
        利用規約
      </h1>
      <div className="text-sm text-yuri-ink/85 space-y-4">
        <p>
          本利用規約（以下「本規約」）は、YuriThai（以下「当サイト」）の
          利用条件を定めるものです。利用者は本規約に同意のうえ当サイトを利用するものとします。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">第1条 著作権</h2>
        <p>
          当サイトに掲載されている文章、ロゴ等の著作権は運営者に帰属します。
          作品の画像・動画の著作権は各制作会社・権利者に帰属します。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">第2条 禁止事項</h2>
        <p>
          掲載内容の無断転載・営利目的の利用、当サイトおよび関係者を誹謗する行為を禁止します。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">第3条 免責事項</h2>
        <p>
          掲載情報の正確性に努めますが、これを保証するものではありません。
          配信状況などは各サービスの公式情報をご確認ください。
        </p>
        <p className="text-xs text-yuri-muted mt-8">
          制定日：2026年X月X日
        </p>
      </div>
    </div>
  );
}
