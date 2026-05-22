import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "お問い合わせ | YuriThai",
  description:
    "作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップなど、YuriThai へのお問い合わせフォーム。LINE でもお問い合わせいただけます。",
};

// LINE 公式アカウントの友だち追加URL。
// 既定は YuriThai 公式 LINE。差し替えたい場合は環境変数 NEXT_PUBLIC_LINE_URL を優先。
const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL || "https://lin.ee/zytqHxV";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-10">
      <h1 className="text-2xl font-medium text-yuri-ink mb-3">
        お問い合わせ
      </h1>
      <p className="text-sm text-yuri-ink/85 leading-relaxed mb-6">
        作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップのご相談など、
        お気軽にお寄せください。
        <strong className="font-medium">最も早くお返事できるのは LINE です。</strong>
      </p>

      {/* LINE（メインの問い合わせ手段） */}
      {LINE_URL && (
        <div className="rounded-xl border-2 border-[#06C755]/50 bg-gradient-to-br from-[#06C755]/15 to-yuri-cream p-6 md:p-7 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#06C755] text-white mb-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.21.88.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.75-3.39 7.84-5.8C21.27 13.66 22 12.02 22 10.23 22 5.69 17.52 2 12 2zM7.9 12.9H6.06c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.18H7.9c.27 0 .49.22.49.49s-.22.49-.49.49zm1.92-.49c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm4.43 0c0 .21-.13.4-.34.46-.05.02-.1.03-.15.03-.15 0-.3-.07-.39-.2l-1.88-2.56v2.27c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.21.13-.4.34-.46.05-.02.1-.02.15-.02.15 0 .29.07.39.19l1.88 2.56V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm3.4-2.32c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35c.27 0 .49.22.49.49s-.22.49-.49.49h-1.84c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49h1.84c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-yuri-ink mb-1">
            LINE でお問い合わせ
          </h2>
          <p className="text-sm text-yuri-ink/80 leading-relaxed mb-4">
            友だち追加して、トークから気軽にメッセージを送るだけ。
            作品情報の提供・ご質問・ご相談まで、いちばんスムーズな方法です。
          </p>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-8 py-3.5 rounded-full text-base font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.21.88.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.75-3.39 7.84-5.8C21.27 13.66 22 12.02 22 10.23 22 5.69 17.52 2 12 2zM7.9 12.9H6.06c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.18H7.9c.27 0 .49.22.49.49s-.22.49-.49.49zm1.92-.49c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm4.43 0c0 .21-.13.4-.34.46-.05.02-.1.03-.15.03-.15 0-.3-.07-.39-.2l-1.88-2.56v2.27c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.21.13-.4.34-.46.05-.02.1-.02.15-.02.15 0 .29.07.39.19l1.88 2.56V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm3.4-2.32c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35c.27 0 .49.22.49.49s-.22.49-.49.49h-1.84c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49h1.84c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35z" />
            </svg>
            LINE で友だち追加して相談
          </a>
        </div>
      )}

      {/* 誹謗中傷NG */}
      <div className="bg-yuri-rose/10 border border-yuri-rose/30 rounded-md p-4 mb-8 text-[13px] text-yuri-ink/85 leading-relaxed">
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

      {/* メールフォーム（サブの問い合わせ手段。折りたたみ） */}
      <details className="group border-t border-yuri-edge pt-6">
        <summary className="cursor-pointer list-none flex items-center gap-2 text-sm text-yuri-muted hover:text-yuri-ink select-none">
          <span className="text-yuri-rose transition-transform group-open:rotate-90">▶</span>
          メールフォームでのお問い合わせはこちら
        </summary>
        <p className="text-xs text-yuri-muted leading-relaxed mt-3 mb-5">
          スポンサー・タイアップなど、記録を残したい正式なご相談はこちらのフォームをご利用ください。
          3〜5営業日以内にご記入のメールアドレス宛にお返事いたします。
        </p>
        <Suspense fallback={<div className="text-sm text-yuri-muted">読み込み中…</div>}>
          <ContactForm />
        </Suspense>
      </details>
    </div>
  );
}
