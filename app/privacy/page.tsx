export const metadata = { title: "プライバシーポリシー | YuriThai" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-display font-medium text-yuri-ink mb-4">
        プライバシーポリシー
      </h1>
      <div className="text-sm text-yuri-ink/85 space-y-4">
        <p>
          YuriThai（以下「当サイト」）は、利用者のプライバシーを尊重し、
          以下のとおり個人情報の取り扱い方針を定めます。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">
          1. 収集する情報
        </h2>
        <p>
          当サイトは、お問い合わせフォームからの送信内容、
          アクセス解析ツール（Vercel Analytics または Plausible）による
          匿名のアクセスログを取得することがあります。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">
          2. Cookie等の利用
        </h2>
        <p>
          当サイトは、アクセス解析および診断機能の状態保持のために
          Cookie・LocalStorageを使用する場合があります。
        </p>
        <h2 className="text-base font-medium text-yuri-navy mt-6">
          3. 第三者提供
        </h2>
        <p>
          法令に基づく場合を除き、収集した情報を第三者に提供することはありません。
        </p>
        <p className="text-xs text-yuri-muted mt-8">
          制定日：2026年X月X日 / 改定日：—
        </p>
      </div>
    </div>
  );
}
