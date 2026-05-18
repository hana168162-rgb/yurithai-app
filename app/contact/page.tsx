import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "お問い合わせ | YuriThai",
  description:
    "作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップなど、YuriThai へのお問い合わせフォーム。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-10">
      <h1 className="text-2xl font-medium text-yuri-ink mb-3">
        お問い合わせ
      </h1>
      <p className="text-sm text-yuri-ink/85 leading-relaxed mb-6">
        作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップのご相談など、
        以下のフォームよりお気軽にお寄せください。3〜5営業日以内にお返事いたします。
      </p>

      {/* 誹謗中傷NG */}
      <div className="bg-yuri-rose/10 border border-yuri-rose/30 rounded-md p-4 mb-6 text-[13px] text-yuri-ink/85 leading-relaxed">
        <p className="font-medium text-yuri-rose mb-1">
          ⚠ ご利用にあたっての注意
        </p>
        <p>
          特定の個人・団体・作品に対する
          <strong className="font-medium">誹謗中傷・名誉毀損・差別的な内容</strong>
          を含むお問い合わせは受け付けておりません。該当する内容と判断した場合は、
          お返事せずに削除いたします。
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-yuri-muted">読み込み中…</div>}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
