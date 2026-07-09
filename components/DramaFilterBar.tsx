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
 *   - 女優表示はニックネーム（英語）。fanの呼び名と一致させる。
 *   - 事務所は actresses.json の `agency` 値を使う（dramas.json の `production` は制作会社で別物）
 *   - 各 select は「すべて」をデフォルトに、選択でリアクティブに絞られる
 *   - URLは変えない
 *   - cardType でレンダリングするカードを切り替え（完結・放送中・公開予定）
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
  return s
    .toLowerCase()
    .replace(/[\s:：・\-_'"‘’“”()（）「」『』]/g, "")
    .trim();
}

/**
 * VPN不要で YouTube で「全話無料」視聴できる作品か判定する。
 * 条件: streaming に YouTube 系プラットフォームがあり、かつ
 *   - VPN必要でない
 *   - メンバーシップ / 会員 / 有料 限定でない（例: SHADES の「メンバー限定」）
 *   - 一部エピソードのみ無料でない（例: 「YouTube (EP1)」）
 */
function isFreeOnYouTube(d: AnyDrama): boolean {
  const streaming = (
    d as { streaming?: { platform?: string | null; note?: string | null }[] }
  ).streaming;
  if (!streaming) return false;
  return streaming.some((s) => {
    const plat = (s.platform || "").toLowerCase();
    const note = (s.note || "").toLowerCase();
    if (!plat.includes("youtube")) return false;
    const blob = `${plat} ${note}`;
    // 制限ワード（VPN / メンバーシップ / 会員 / 有料）が含まれる場合は無料扱いにしない
    const restricted = ["vpn", "メンバー", "会員", "membership", "有料", "paid"].some(
      (k) => blob.includes(k)
    );
    if (restricted) return false;
    // 「EP1」など一部エピソードのみ無料のケースを除外
    if (/ep\s?\d/.test(plat)) return false;
    return true;
  });
}

/**
 * 女優のfilmographyタイトルとドラマタイトルが「同じ作品を指している」かどうかを判定する。
 * 表記揺れを吸収するため、正規化後に「片方がもう片方の部分文字列」のケースも一致とみなす。
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
    if (shorter < 5) {
      if (w.startsWith(c) || c.startsWith(w)) return true;
    } else {
      if (w.includes(c) || c.includes(w)) return true;
    }
  }
  return false;
}

/**
 * 女優の表示名（英語ニックネーム）を抽出する。
 *   - actresses.json の name_en が公式ニックネーム
 *   - フォールバックは real_name の引用符内 → id を Title Case 化
 */
function nickName(a: Actress): string {
  if (a.name_en) return a.name_en;
  const real = a.real_name || "";
  const m = real.match(/^(\S+)\s+"([^"]+)"/);
  if (m) {
    const [, first, nick] = m;
    if (first.toLowerCase() === a.id.toLowerCase()) return first;
    return nick;
  }
  return a.id.charAt(0).toUpperCase() + a.id.slice(1);
}

function familyName(a: Actress): string {
  const real = a.real_name || "";
  const parts = real.replace(/"[^"]*"/g, "").trim().split(/\s+/);
  return parts[parts.length - 1] || "";
}

/**
 * 同じ nickname のactressが複数いる場合、family nameを併記して区別する。
 */
function displayName(a: Actress, all: Actress[]): string {
  const nick = nickName(a);
  const sharing = all.filter((x) => nickName(x) === nick);
  if (sharing.length > 1) {
    const fam = familyName(a);
    if (fam && fam.toLowerCase() !== nick.toLowerCase()) {
      return `${nick} ${fam}`;
    }
  }
  return nick;
}

export function DramaFilterBar({
  dramas,
  actresses,
  cardType,
  recentlyEnded = [],
}: Props) {
  const [actressId, setActressId] = useState("");
  const [agency, setAgency] = useState("");
  const [year, setYear] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const allList: AnyDrama[] = [...recentlyEnded, ...dramas];

  // この一覧に「VPN不要のYouTube無料視聴可」作品が存在するか（トグル表示の判定用）
  const hasFreeWorks = useMemo(
    () => allList.some((d) => isFreeOnYouTube(d)),
    [allList]
  );

  // 作品slug → 出演女優IDのSet
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

  // この一覧に登場する作品の出演女優だけを選択肢に
  const actressOptions = useMemo(() => {
    const ids = new Set<string>();
    for (const set of dramaToActressIds.values()) {
      set.forEach((id) => ids.add(id));
    }
    const matched = actresses.filter((a) => ids.has(a.id));
    return matched
      .map((a) => ({ id: a.id, label: displayName(a, matched) }))
      .sort((a, b) => a.label.localeCompare(b.label, "en"));
  }, [dramaToActressIds, actresses]);

  // 事務所は出演女優の agency 集合
  const agencyOptions = useMemo(() => {
    const ids = new Set<string>();
    for (const set of dramaToActressIds.values()) {
      set.forEach((id) => ids.add(id));
    }
    const set = new Set<string>();
    for (const a of actresses) {
      if (!ids.has(a.id)) continue;
      if (a.agency && a.agency.trim()) set.add(a.agency.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [dramaToActressIds, actresses]);

  const yearOptions = useMemo(() => {
    const set = new Set<number>();
    for (const d of allList) {
      if ("year" in d && typeof d.year === "number") set.add(d.year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [allList]);

  // マッチング関数群
  const matchesActress = (d: AnyDrama, id: string) =>
    dramaToActressIds.get(d.slug)?.has(id) ?? false;

  const actressIdsByAgency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const a of actresses) {
      if (!a.agency) continue;
      const key = a.agency.trim();
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(a.id);
    }
    return map;
  }, [actresses]);

  const matchesAgency = (d: AnyDrama, agencyName: string) => {
    const dramaActresses = dramaToActressIds.get(d.slug);
    const agencyActresses = actressIdsByAgency.get(agencyName);
    if (!dramaActresses || !agencyActresses) return false;
    for (const id of dramaActresses) {
      if (agencyActresses.has(id)) return true;
    }
    return false;
  };

  const applyFilters = <T extends AnyDrama>(list: T[]): T[] => {
    return list.filter((d) => {
      if (actressId && !matchesActress(d, actressId)) return false;
      if (agency && !matchesAgency(d, agency)) return false;
      if (year) {
        if (!("year" in d) || (d as Drama).year !== Number(year)) return false;
      }
      if (freeOnly && !isFreeOnYouTube(d)) return false;
      return true;
    });
  };

  const filteredDramas = applyFilters(dramas);
  const filteredEnded = applyFilters(recentlyEnded);

  const totalAll = dramas.length + recentlyEnded.length;
  const totalFiltered = filteredDramas.length + filteredEnded.length;
  const isFiltered = !!(actressId || agency || year || freeOnly);

  /**
   * 完結一覧では、recentlyEnded (watching.json 由来) と dramas を
   * まとめて year 降順 + series 隣接ソートで返す。
   * 各要素の描画時に元の型で判別してカードを出し分ける。
   */
  type MergedCompleted =
    | { kind: "drama"; drama: Drama }
    | { kind: "watching"; drama: WatchingDrama };
  // 完結ページ (cardType === "drama") では filteredDramas は Drama[]、
  // それ以外の cardType はここに来ないので安全にキャストできる。
  const mergedCompleted: MergedCompleted[] = [
    ...filteredDramas.map((d) => ({
      kind: "drama" as const,
      drama: d as Drama,
    })),
    ...filteredEnded.map((d) => ({ kind: "watching" as const, drama: d })),
  ];
  // year は Drama は d.year、Watching は end_date の年 or start_date の年
  const yearOf = (m: MergedCompleted): number => {
    if (m.kind === "drama") return m.drama.year ?? 0;
    const w = m.drama;
    const src = w.end_date || w.start_date || "";
    const y = parseInt(src.slice(0, 4), 10);
    return Number.isFinite(y) ? y : 0;
  };
  const sortedCompleted: MergedCompleted[] = (() => {
    const byYearDesc = [...mergedCompleted].sort(
      (a, b) => yearOf(b) - yearOf(a),
    );
    const groups = new Map<string, MergedCompleted[]>();
    for (const m of byYearDesc) {
      const s = m.drama.series;
      if (s) {
        const arr = groups.get(s) ?? [];
        arr.push(m);
        groups.set(s, arr);
      }
    }
    const out: MergedCompleted[] = [];
    const placed = new Set<string>();
    for (const m of byYearDesc) {
      if (placed.has(m.drama.slug)) continue;
      const s = m.drama.series;
      if (s && groups.has(s)) {
        for (const g of groups.get(s)!) {
          if (!placed.has(g.drama.slug)) {
            out.push(g);
            placed.add(g.drama.slug);
          }
        }
      } else {
        out.push(m);
        placed.add(m.drama.slug);
      }
    }
    return out;
  })();

  const renderCard = (d: AnyDrama): ReactNode => {
    switch (cardType) {
      case "drama":
        return <DramaCard key={d.slug} drama={d as Drama} hideTags />;
      case "watching": {
        const w = d as WatchingDrama;
        return <WatchingCard key={w.slug} drama={w} cover={w.cover_image} />;
      }
      case "upcoming":
        return <UpcomingCard key={d.slug} drama={d as UpcomingDrama} />;
    }
  };

  const selectClassName =
    "w-full sm:w-auto max-w-full px-3 py-2 rounded-full text-sm border border-yuri-edge bg-yuri-cream text-yuri-ink hover:border-yuri-rose focus:outline-none focus:ring-2 focus:ring-yuri-rose/40 transition-colors";

  return (
    <>
      <div className="mb-5">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 md:gap-3">
          <select
            aria-label="女優で絞り込み"
            value={actressId}
            onChange={(e) => setActressId(e.target.value)}
            className={selectClassName}
          >
            <option value="">女優：すべて</option>
            {actressOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
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

          {hasFreeWorks && (
            <button
              type="button"
              aria-pressed={freeOnly}
              onClick={() => setFreeOnly((v) => !v)}
              className={`w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-full text-sm border transition-colors ${
                freeOnly
                  ? "border-[#06C755] bg-[#06C755]/10 text-yuri-ink"
                  : "border-yuri-edge bg-yuri-cream text-yuri-ink hover:border-[#06C755]"
              }`}
            >
              <span aria-hidden>{freeOnly ? "✓" : "▶"}</span>
              YouTube無料
            </button>
          )}

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setActressId("");
                setAgency("");
                setYear("");
                setFreeOnly(false);
              }}
              className="col-span-2 sm:col-auto self-start text-left px-1 sm:px-3 py-1.5 text-[13px] sm:text-xs text-yuri-muted hover:text-yuri-rose underline-offset-2 hover:underline"
            >
              絞り込みをクリア
            </button>
          )}
        </div>

        <p className="mt-2 text-[13px] sm:text-xs text-yuri-muted sm:text-right">
          {isFiltered ? `${totalFiltered} / ${totalAll} 作品` : `全 ${totalAll} 作品`}
        </p>
      </div>

      {totalFiltered === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          条件に一致する作品はありませんでした。
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {cardType === "drama"
            ? sortedCompleted.map((m) =>
                m.kind === "drama" ? (
                  renderCard(m.drama)
                ) : (
                  <WatchingCard
                    key={m.drama.slug}
                    drama={m.drama}
                    cover={m.drama.cover_image}
                    statusOverride="completed"
                  />
                ),
              )
            : (
              <>
                {filteredEnded.map((d) => (
                  <WatchingCard
                    key={d.slug}
                    drama={d}
                    cover={d.cover_image}
                    statusOverride="completed"
                  />
                ))}
                {filteredDramas.map((d) => renderCard(d))}
              </>
            )}
        </div>
      )}
    </>
  );
}
