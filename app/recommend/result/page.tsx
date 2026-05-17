"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { dramas, questionsFile } from "@/lib/content";
import { rankDramas } from "@/lib/diagnostic";
import { DramaCard } from "@/components/DramaCard";
import type { Answers } from "@/lib/types";

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
          あなたへのおすすめ
        </h1>
        <p className="text-sm text-yuri-muted">
          選んだタグから、{ranked.length}作品をおすすめします
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
            </div>
          ))}
        </div>
      )}

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
