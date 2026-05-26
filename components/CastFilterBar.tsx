"use client";

import { useMemo, useState } from "react";
import type { Actress } from "@/lib/types";
import { ActressProfile } from "./ActressProfile";

/**
 * 女優一覧（ペア単位）のクライアント側フィルタリング。
 * ドラマ一覧（DramaFilterBar）と同様、選択式のピルで絞り込む。
 *   - 事務所：いずれかのメンバーがその事務所所属のペアを表示
 *   - カップル：選んだペアだけを表示
 * 表示順はサーバー側（pairs.json の順）を踏襲する。
 */

export interface CastPairEntry {
  short: string;
  full: string;
  dramas: string[];
  actresses: Actress[];
}

export function CastFilterBar({ pairs }: { pairs: CastPairEntry[] }) {
  const [agency, setAgency] = useState("");
  const [pairKey, setPairKey] = useState("");

  // 事務所の選択肢（全メンバーの agency 集合）
  const agencyOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of pairs) {
      for (const a of p.actresses) {
        if (a.agency && a.agency.trim()) set.add(a.agency.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [pairs]);

  // カップルの選択肢（アルファベット順で探しやすく）
  const pairOptions = useMemo(
    () => pairs.map((p) => p.short).sort((a, b) => a.localeCompare(b, "en")),
    [pairs]
  );

  const filtered = useMemo(() => {
    return pairs.filter((p) => {
      if (pairKey && p.short !== pairKey) return false;
      if (
        agency &&
        !p.actresses.some((a) => (a.agency || "").trim() === agency)
      )
        return false;
      return true;
    });
  }, [pairs, agency, pairKey]);

  const isFiltered = !!(agency || pairKey);
  const selectClassName =
    "px-3 py-1.5 rounded-full text-sm border border-yuri-edge bg-yuri-cream text-yuri-ink hover:border-yuri-rose focus:outline-none focus:ring-2 focus:ring-yuri-rose/40 transition-colors";

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2 md:gap-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 flex-1 min-w-0">
          <select
            aria-label="事務所で絞り込み"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className={selectClassName}
          >
            <option value="">事務所：すべて</option>
            {agencyOptions.map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>

          <select
            aria-label="カップルで絞り込み"
            value={pairKey}
            onChange={(e) => setPairKey(e.target.value)}
            className={selectClassName}
          >
            <option value="">カップル：すべて</option>
            {pairOptions.map((pk) => (
              <option key={pk} value={pk}>
                {pk}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setAgency("");
                setPairKey("");
              }}
              className="px-3 py-1.5 text-xs text-yuri-muted hover:text-yuri-rose underline-offset-2 hover:underline"
            >
              絞り込みをクリア
            </button>
          )}
        </div>

        <div className="text-xs text-yuri-muted whitespace-nowrap ml-auto">
          {isFiltered
            ? `${filtered.length} / ${pairs.length} ペア`
            : `全 ${pairs.length} ペア`}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          条件に一致するカップルはありませんでした。
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((p) => (
            <section
              key={p.short}
              className="bg-yuri-cream border border-yuri-edge rounded-lg p-3.5 md:p-5"
            >
              <div className="mb-4">
                <h2 className="text-lg font-medium text-yuri-navy mb-1">
                  {p.short}
                </h2>
                <p className="text-xs text-yuri-muted mb-2">{p.full}</p>
                <p className="text-xs text-yuri-ink/80">
                  <span className="text-yuri-muted">出演: </span>
                  {p.dramas.join(" / ")}
                </p>
              </div>

              {p.actresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.actresses.map((a) => (
                    <ActressProfile key={a.id} actress={a} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-yuri-muted italic">
                  個別プロフィールは準備中
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
