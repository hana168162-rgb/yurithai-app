export const metadata = { title: "お問い合わせ | YuriThai" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-display font-medium text-yuri-ink mb-4">
        お問い合わせ
      </h1>
      <p className="text-sm text-yuri-ink/85 mb-6">
        作品情報の追加・訂正、配信情報の更新、ご意見・ご感想など、
        以下のフォームよりお気軽にお寄せください。
      </p>
      <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-6 text-center text-sm text-yuri-muted">
        フォームは準備中です。<br />
        当面はSNS DM等でご連絡ください。
      </div>
    </div>
  );
}
