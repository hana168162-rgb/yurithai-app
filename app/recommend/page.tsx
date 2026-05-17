"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "@/content/diagnostic/questions.json";
import type { QuestionsFile, Answers } from "@/lib/types";

const qf = questionsData as unknown as QuestionsFile;

export default function RecommendPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const q = qf.questions[idx];
  const total = qf.questions.length;
  const picked = answers[q.id] ?? [];

  function toggle(optId: string) {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === "single") {
        return { ...prev, [q.id]: [optId] };
      }
      const next = cur.includes(optId)
        ? cur.filter((x) => x !== optId)
        : [...cur, optId];
      return { ...prev, [q.id]: next };
    });
  }

  function next() {
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      // Encode answers in URL hash to keep page static-friendly
      const enc = encodeURIComponent(JSON.stringify(answers));
      router.push(`/recommend/result?a=${enc}`);
    }
  }

  function back() {
    if (idx > 0) setIdx(idx - 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs text-yuri-rose mb-2">
          ✦ おすすめを診断する
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink">
          あなたに合うタイGLを見つけよう
        </h1>
        <p className="text-xs text-yuri-muted mt-2">
          {total}問のクイズで、好みに合う作品をおすすめします。
        </p>
      </header>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-yuri-muted mb-2">
          <span>
            Q{idx + 1} / {total}
          </span>
          <span>{Math.round(((idx + 1) / total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-yuri-edge rounded-full overflow-hidden">
          <div
            className="h-full bg-yuri-rose transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-6 mb-6">
        <h2 className="text-base md:text-lg font-medium text-yuri-ink mb-4">
          {q.question_ja}
        </h2>
        {q.type === "multi" && (
          <p className="text-xs text-yuri-muted mb-3">複数選択可</p>
        )}

        <div className="space-y-2">
          {q.options.map((opt) => {
            const isPicked = picked.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isPicked
                    ? "bg-yuri-navy text-yuri-cream border-yuri-navy"
                    : "bg-yuri-cream border-yuri-edge text-yuri-ink hover:border-yuri-rose"
                }`}
              >
                {opt.label_ja}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={back}
          disabled={idx === 0}
          className="text-sm text-yuri-muted disabled:opacity-30 hover:text-yuri-ink"
        >
          ← 戻る
        </button>
        <button
          onClick={next}
          disabled={picked.length === 0}
          className="bg-yuri-rose text-yuri-cream px-6 py-2.5 rounded-full text-sm font-medium disabled:opacity-40 hover:opacity-90"
        >
          {idx === total - 1 ? "診断結果を見る →" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
