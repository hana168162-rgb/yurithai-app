import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "お問い合わせ | YuriThai",
  description:
    "作品情報の追加・訂正、配信情報の更新、スポンサー・タイアップなど、YuriThai へのお問い合わせフォーム。LINE でもお問い合わせいただけます。",
};

// LINE 公式アカウントの友だち追加URL。
// Vercel の環境変数 NEXT_PUBLIC_LINE_URL で本番URLに差し替える。
// 未設定の場合は LINE ボタンを表示しない。
const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL || "";

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

      {/* LINE 相談ボタン */}
      {LINE_URL && (
        <div className="bg-[#06C755]/10 border border-[#06C755]/30 rounded-md p-4 mb-6">
          <p className="text-sm text-yuri-ink/85 leading-relaxed mb-3">
            LINE でも気軽にお問い合わせいただけます。
            ちょっとした情報提供やご質問は、LINE がスムーズです。
          </p>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.21.88.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.75-3.39 7.84-5.8C21.27 13.66 22 12.02 22 10.23 22 5.69 17.52 2 12 2zM7.9 12.9H6.06c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.18H7.9c.27 0 .49.22.49.49s-.22.49-.49.49zm1.92-.49c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm4.43 0c0 .21-.13.4-.34.46-.05.02-.1.03-.15.03-.15 0-.3-.07-.39-.2l-1.88-2.56v2.27c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.21.13-.4.34-.46.05-.02.1-.02.15-.02.15 0 .29.07.39.19l1.88 2.56V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm3.4-2.32c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35c.27 0 .49.22.49.49s-.22.49-.49.49h-1.84c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49h1.84c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35z" />
            </svg>
            LINE で相談する
          </a>
          <p className="text-xs text-yuri-muted mt-2">
            ※ スポンサー・タイアップなど正式なご相談は、記録の残るフォームをおすすめします。
          </p>
        </div>
      )}

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
