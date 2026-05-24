"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { dramas, questionsFile } from "@/lib/content";
import { rankDramas } from "@/lib/diagnostic";
import { DramaCard } from "@/components/DramaCard";
import type { Answers } from "@/lib/types";

const SITE_URL = "https://yurithai.jp";

/** 診断結果のSNS共有ボタン群 */
function ShareButtons({ topTitle }: { topTitle: string | null }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${SITE_URL}/recommend`;
  const text = topTitle
    ? `タイGLおすすめ診断、私への1作は「${topTitle}」でした✨ あなたに合うタイGLは？`
    : `タイGLおすすめ診断、やってみた✨ あなたに合うタイGLは？`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(
    "タイGL,YuriThai"
  )}`;
  const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(
    `${text}\n${shareUrl}`
  )}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="mb-10 text-center">
      <p className="text-sm font-medium text-yuri-navy mb-1">
        結果をシェアする
      </p>
      <p className="text-xs text-yuri-muted mb-4">
        友だちにも、あなたに合うタイGLを見つけてもらおう
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {/* X */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X でシェア"
          className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>
        {/* LINE */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LINE でシェア"
          className="inline-flex items-center gap-1.5 bg-[#06C755] text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.21.88.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.75-3.39 7.84-5.8C21.27 13.66 22 12.02 22 10.23 22 5.69 17.52 2 12 2zM7.9 12.9H6.06c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.18H7.9c.27 0 .49.22.49.49s-.22.49-.49.49zm1.92-.49c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm4.43 0c0 .21-.13.4-.34.46-.05.02-.1.03-.15.03-.15 0-.3-.07-.39-.2l-1.88-2.56v2.27c0 .27-.22.49-.49.49s-.49-.22-.49-.49V8.74c0-.21.13-.4.34-.46.05-.02.1-.02.15-.02.15 0 .29.07.39.19l1.88 2.56V8.74c0-.27.22-.49.49-.49s.49.22.49.49v3.67zm3.4-2.32c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35c.27 0 .49.22.49.49s-.22.49-.49.49h-1.84c-.27 0-.49-.22-.49-.49V8.74c0-.27.22-.49.49-.49h1.84c.27 0 .49.22.49.49s-.22.49-.49.49h-1.35v.85h1.35z" />
          </svg>
          LINE
        </a>
        {/* Facebook */}
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook でシェア"
          className="inline-flex items-center gap-1.5 bg-[#1877F2] text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" />
          </svg>
          Facebook
        </a>
        {/* リンクコピー */}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 bg-yuri-cream border border-yuri-edge text-yuri-ink px-4 py-2 rounded-full text-xs font-medium hover:border-yuri-rose"
        >
          {copied ? "✓ コピーしました" : "🔗 リンクをコピー"}
        </button>
      </div>
    </div>
  );
}

function ResultInner() {
  const sp = useSearchParams();
  const raw = sp.get("a");

  const answers: Answers = useMemo(() => {
    if (!raw) return {};
    try {
      return JSON.parse(decodeURIComponent(raw)) as Answers;
    } catch {
      return {};
    }
  }, [raw]);

  const ranked = useMemo(
    () => rankDramas(answers, questionsFile.questions, dramas, 5),
    [answers]
  );

  // 全件スコア0なら、初心者向け王道ラインのフォールバック表示
  const isBeginnerFallback =
    ranked.length > 0 && ranked.every((r) => r.score === 0);

  // 共有テキスト用のトップ作品名
  const topTitle = ranked.length > 0 ? ranked[0].drama.title_ja : null;

  if (Object.keys(answers).length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm text-yuri-muted mb-6">
          診断データが見つかりませんでした
        </p>
        <Link
          href="/recommend"
          className="bg-yuri-navy text-yuri-cream px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
        >
          診断を始める →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8 text-center">
        <p className="text-xs text-yuri-rose mb-2">✦ 診断結果</p>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-2">
          {isBeginnerFallback ? "迷ったらこの王道ラインから" : "あなたへのおすすめ"}
        </h1>
        <p className="text-sm text-yuri-muted">
          {isBeginnerFallback
            ? "タイGLの代表作からピックアップしました。気になる1本から観てみてください。"
            : `選んだタグから、${ranked.length}作品をおすすめします`}
        </p>
      </header>

      {ranked.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center">
          <p className="text-sm text-yuri-muted mb-4">
            条件に合う作品が見つかりませんでした
          </p>
          <Link
            href="/dramas"
            className="text-yuri-rose text-sm hover:underline"
          >
            すべての作品を見る →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {ranked.map(({ drama, score, matched }) => (
            <div key={drama.slug} className="relative">
              <DramaCard drama={drama} />
              {!isBeginnerFallback && (
                <div className="mt-2 text-xs text-yuri-muted text-center">
                  マッチ度: <span className="text-yuri-rose font-medium">
                    {score}
                  </span>
                  {matched.length > 0 && (
                    <div className="text-[10px] mt-0.5 truncate">
                      {matched.slice(0, 3).join(" · ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SNS共有導線 */}
      {ranked.length > 0 && <ShareButtons topTitle={topTitle} />}

      <div className="text-center space-x-4">
        <Link
          href="/recommend"
          className="inline-block bg-yuri-cream border border-yuri-edge text-yuri-ink px-5 py-2.5 rounded-full text-sm font-medium hover:border-yuri-rose"
        >
          もう一度診断する
        </Link>
        <Link
          href="/dramas"
          className="inline-block bg-yuri-navy text-yuri-cream px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          すべての作品を見る
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-yuri-muted">
          診断結果を計算中...
        </div>
      }
    >
      <ResultInner />
    </Suspense>
  );
}
