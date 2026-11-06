import { Suspense } from "react";
import { ContactForm } from "./ContactForm";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "お問い合わせ | YuriThai",
  description:
    "作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップなど、YuriThai へのお問い合わせフォーム。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-10">
      <h1 className="text-3xl font-semibold text-yuri-ink mb-4">
        お問い合わせ
      </h1>
      <p className="text-base md:text-lg text-yuri-ink/90 leading-relaxed mb-8">
        ご質問・情報提供・ご相談など、以下のフォームからお気軽にどうぞ。
        <br />
        スポンサー・タイアップのご相談も歓迎しております。
      </p>

      {/* 誹謗中傷NG */}
      <div className="bg-yuri-rose/10 border border-yuri-rose/30 rounded-md p-5 mb-8 text-sm text-yuri-ink/85 leading-relaxed">
        <p className="font-semibold text-yuri-rose mb-2">
          ⚠ ご利用上の注意
        </p>
        <p>
          <strong className="font-medium">誹謗中傷・差別的な内容</strong>
          を含むお問い合わせはお断りします。
          <br />
          該当する場合はお返事せず削除します。
        </p>
      </div>

      {/* メールフォーム（メインの問い合わせ手段） */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-yuri-ink mb-2">
          お問い合わせフォーム
        </h2>
        <p className="text-sm text-yuri-muted leading-relaxed mb-5">
          送信ボタンを押すと、入力内容を本文に反映したメールがお使いのメールクライアント（Gmail／Apple Mail など）で自動的に開きます。そのまま送信してください。3〜5営業日以内にお返事します。
        </p>
        <Suspense fallback={<div className="text-sm text-yuri-muted">読み込み中…</div>}>
          <ContactForm />
        </Suspense>
      </section>

      {/* 直接メール案内 */}
      <section className="border-t border-yuri-edge pt-6 text-sm text-yuri-muted leading-relaxed">
        <p>
          フォームがご利用になれない場合は、下記メールアドレス宛に直接ご連絡ください。
        </p>
        <p className="mt-2 text-yuri-ink font-medium">
          {OPERATOR.contactEmailDisplay}
        </p>
      </section>
    </div>
  );
}
