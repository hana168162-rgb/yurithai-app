"use client";

import { useMemo, useState, type ReactNode } from "react";
import type {
  AnyDrama,
  Drama,
  WatchingDrama,
  UpcomingDrama,
  Actress,
} from "@/lib/types";
import { DramaCard } from "./DramaCard";
import { WatchingCard } from "./WatchingCard";
import { UpcomingCard } from "./UpcomingCard";

/**
 * 作品一覧用のクライアント側フィルタリングコンポーネント。
 *
 * 仕様:
 *   - 「女優 / 事務所 / 公開年」の3軸で絞り込み
 *   - 各 selectは「すべて」をデフォルトに、選択でリアクティブに絞られる
 *   - URLは変えない（共有性より軽さを優先。SSR時は全件レンダリングできる）
 *   - 1件もマッチしない場合はメッセージ表示
 *   - cardType でレンダリングするカードを切り替え（完結・放送中・公開予定）
 *
 * 注意:
 *   - 女優→作品マッチングは actresses.json の filmography（出演作タイトル文字列）を逆引きする。
 *     したがって actresses.json 側のタイトル表記が drama.title_en/title_ja のいずれかと
 *     一致している必要がある。表記揺れ（コロン、ハイフン）は両側を正規化して吸収。
 */

type CardType = "drama" | "watching" | "upcoming";

interface Props {
  /** 主たる作品リスト。 cardType に応じて型が決まる。 */
  dramas: AnyDrama[];
  /** 全女優情報。女優プルダウンとフィルタマッチに使用。 */
  actresses: Actress[];
  /** どのカードコンポーネントでレンダリングするか。 */
  cardType: CardType;
  /**
   * 完結ページで、watching.json から最近 end_date を過ぎた作品を先頭に並べたい場合に渡す。
   * 通常の dramas (Drama[]) より前にレンダリングされる。
   */
  recentlyEnded?: WatchingDrama[];
}

function norm(s: string | null | undefined): string {
  if (!s) return "";
  // 区切り記号・空白・引用符は全て除去して、表記揺れを吸収
  return s
    .toLowerCase()
    .replace(/[\s:：・\-_'"‘’“”()（）「」『』]/g, "")
    .trim();
}

/**
 * 女優のfilmographyタイトルとドラマタイトルが「同じ作品を指している」かどうかを判定する。
 * 表記揺れを吸収するため、正規化後に「片方がもう片方の部分文字列」のケースも一致とみなす。
 * 例: "4 Elements: The Earth (2025-2026)" と "The Earth" → match
 *     "GAP: The Series" と "GAP" → match
 * 短すぎるタイトル（< 4文字）は誤マッチを避けるため exact match のみ。
 */
function titleMatches(work: string, drama: AnyDrama): boolean {
  const w = norm(work);
  if (!w) return false;
  const candidates = [norm(drama.title_en), norm(drama.title_ja)].filter(Boolean);
  for (const c of candidates) {
    if (!c) continue;
    if (w === c) return true;
    const shorter = Math.min(w.length, c.length);
    if (shorter < 3) continue;
    // 短いタイトル（3〜4文字）は prefix 一致のみ、長いタイトルは substring 一致を許可
    if (shorter < 5) {
      if (w.startsWith(c) || c.startsWith(w)) return true;
    } else {
      if (w.includes(c) || c.includes(w)) return true;
    }
  }
  return false;
}

export function DramaFilterBar({
  dramas,
  actresses,
  cardType,
  recentlyEnded = [],
}: Props) {
  const [actress, setActress] = useState("");
  const [agency, setAgency] = useState("");
  const [year, setYear] = useState("");

  const allList: AnyDrama[] = [...recentlyEnded, ...dramas];

  // 作品slug → 出演女優IDのSet
  // この一覧に登場する作品分だけ計算してメモ化（O(dramas × actresses) だが、いずれも小規模）
  const dramaToActressIds = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const d of allList) {
      const ids = new Set<string>();
      for (const a of actresses) {
        for (const work of a.filmography ?? []) {
          if (titleMatches(work, d)) {
            ids.add(a.id);
            break;
          }
        }
      }
      if (ids.size > 0) map.set(d.slug, ids);
    }
    return map;
  }, [allList, actresses]);

  // 「この一覧に登場する作品の出演女優」だけを選択肢にする
  const actressOptions = useMemo(() => {
    const ids = new Set<string>();
    for (const set of dramaToActressIds.values()) {
      set.forEach((id) => ids.add(id));
    }
    return actresses
      .filter((a) => ids.has(a.id))
      .sort((a, b) => a.name_ja.localeCompare(b.name_ja, "ja"));
  }, [dramaToActressIds, actresses]);

  const agencyOptions = useMemo(() => {
    const set = new Set<string>();
    for (const d of allList) {
      if (d.production && d.production.trim()) set.add(d.production.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [allList]);

  const yearOptions = useMemo(() => {
    const set = new Set<number>();
    for (const d of allList) {
      if ("year" in d && typeof d.year === "number") set.add(d.year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [allList]);

  // 女優→作品マッチング
  const matchesActress = (d: AnyDrama, actressId: string): boolean => {
    return dramaToActressIds.get(d.slug)?.has(actressId) ?? false;
  };

  // フィルタ適用
  const applyFilters = <T extends AnyDrama>(list: T[]): T[] => {
    return list.filter((d) => {
      if (actress && !matchesActress(d, actress)) return false;
      if (agency && d.production !== agency) return false;
      if (year) {
        if (!("year" in d) || (d as Drama).year !== Number(year)) return false;
      }
      return true;
    });
  };

  const filteredDramas = applyFilters(dramas);
  const filteredEnded = applyFilters(recentlyEnded);

  const totalAll = dramas.length + recentlyEnded.length;
  const totalFiltered = filteredDramas.length + filteredEnded.length;
  const isFiltered = !!(actress || agency || year);

  const renderCard = (d: AnyDrama): ReactNode => {
    switch (cardType) {
      case "drama":
        return <DramaCard key={d.slug} drama={d as Drama} />;
      case "watching": {
        const w = d as WatchingDrama;
        return <WatchingCard key={w.slug} drama={w} cover={w.cover_image} />;
      }
      case "upcoming":
        return <UpcomingCard key={d.slug} drama={d as UpcomingDrama} />;
    }
  };

  const selectClassName =
    "px-3 py-1.5 rounded-full text-sm border border-yuri-edge bg-yuri-cream text-yuri-ink hover:border-yuri-rose focus:outline-none focus:ring-2 focus:ring-yuri-rose/40 transition-colors";

  return (
    <>
      {/* 絞り込みバー */}
      <div className="mb-5 flex flex-wrap items-center gap-2 md:gap-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 flex-1 min-w-0">
          <select
            aria-label="女優で絞り込み"
            value={actress}
            onChange={(e) => setActress(e.target.value)}
            className={selectClassName}
          >
            <option value="">女優：すべて</option>
            {actressOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name_ja}
              </option>
            ))}
          </select>

          <select
            aria-label="事務所で絞り込み"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className={selectClassName}
          >
            <option value="">事務所：すべて</option>
            {agencyOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {yearOptions.length > 0 && (
            <select
              aria-label="公開年で絞り込み"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={selectClassName}
            >
              <option value="">公開年：すべて</option>
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}年
                </option>
              ))}
            </select>
          )}

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setActress("");
                setAgency("");
                setYear("");
              }}
              className="px-3 py-1.5 text-xs text-yuri-muted hover:text-yuri-rose underline-offset-2 hover:underline"
            >
              絞り込みをクリア
            </button>
          )}
        </div>

        <div className="text-xs text-yuri-muted whitespace-nowrap ml-auto">
          {isFiltered ? `${totalFiltered} / ${totalAll} 作品` : `全 ${totalAll} 作品`}
        </div>
      </div>

      {/* 作品グリッド */}
      {totalFiltered === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          条件に一致する作品はありませんでした。
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredEnded.map((d) => (
            <WatchingCard
              key={d.slug}
              drama={d}
              cover={d.cover_image}
              statusOverride="completed"
            />
          ))}
          {filteredDramas.map((d) => renderCard(d))}
        </div>
      )}
    </>
  );
}
