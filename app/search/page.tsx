"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { searchAll, type SearchResult } from "@/lib/search";

function ResultIcon({ type }: { type: SearchResult["type"] }) {
  const icon = type === "drama" ? "🎬" : type === "actress" ? "👤" : "🏷️";
  return <span aria-hidden>{icon}</span>;
}

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => searchAll(query), [query]);

  // タイプ別グルーピング
  const dramaResults = results.filter((r) => r.type === "drama");
  const actressResults = results.filter((r) => r.type === "actress");
  const tagResults = results.filter((r) => r.type === "tag");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-3">
          検索
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="作品名・女優名・ペア名・タグから検索"
            className="w-full px-4 py-2 rounded-lg border border-yuri-edge bg-yuri-cream text-yuri-ink focus:outline-none focus:border-yuri-rose"
            autoFocus
          />
        </form>
      </header>

      {query.length === 0 ? (
        <p className="text-sm text-yuri-muted">
          検索したいキーワードを入力してください。
          <br />
          例: 「FreenBecky」「シリアス」「Pluto」「Channel 3」など
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-yuri-muted">
          「{query}」に一致する結果はありません。
        </p>
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-yuri-muted">
            {results.length}件ヒット
          </p>

          {dramaResults.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-yuri-navy mb-2">
                作品（{dramaResults.length}）
              </h2>
              <ul className="space-y-2">
                {dramaResults.map((r) => (
                  <li key={`${r.type}-${r.href}`}>
                    <Link
                      href={r.href}
                      className="block bg-yuri-surface border border-yuri-edge rounded-lg p-3 hover:border-yuri-rose/40"
                    >
                      <p className="text-sm font-medium text-yuri-ink">
                        <ResultIcon type={r.type} /> {r.title}
                      </p>
                      <p className="text-xs text-yuri-muted mt-0.5 truncate">
                        {r.subtitle}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {actressResults.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-yuri-navy mb-2">
                女優（{actressResults.length}）
              </h2>
              <ul className="space-y-2">
                {actressResults.map((r) => (
                  <li key={`${r.type}-${r.href}`}>
                    <Link
                      href={r.href}
                      className="block bg-yuri-surface border border-yuri-edge rounded-lg p-3 hover:border-yuri-rose/40"
                    >
                      <p className="text-sm font-medium text-yuri-ink">
                        <ResultIcon type={r.type} /> {r.title}
                      </p>
                      <p className="text-xs text-yuri-muted mt-0.5 truncate">
                        {r.subtitle}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tagResults.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-yuri-navy mb-2">
                タグ（{tagResults.length}）
              </h2>
              <div className="flex flex-wrap gap-2">
                {tagResults.map((r) => (
                  <Link
                    key={`${r.type}-${r.href}`}
                    href={r.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yuri-pink/40 hover:bg-yuri-pink/70 border border-yuri-edge text-yuri-navy text-xs"
                  >
                    <ResultIcon type={r.type} />
                    {r.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-yuri-muted">読み込み中…</div>}>
      <SearchInner />
    </Suspense>
  );
}
