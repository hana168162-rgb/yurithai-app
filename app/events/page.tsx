"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getAllEvents,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_STYLES,
  getEventFilterOptions,
  normalizeEventCategory,
  shortPairLabel,
} from "@/lib/content";
import type { GLEvent } from "@/lib/types";
import { TripcomCard } from "@/components/TripcomCard";

function formatDate(d: string): string {
  // "2026-08-15" → "8月15日（土）"
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  const m = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${m}月${day}日（${weekday}）`;
}

// カテゴリ → 絵文字アイコン（ぱっと見の識別性を上げる）
const CATEGORY_ICON: Record<string, string> = {
  birthday: "🎂",
  broadcast: "📺",
  "fan-meeting": "🎤",
  concert: "🎵",
  premiere: "🎬",
  press: "🗞",
  release: "💿",
  fashion: "👗",
  "award-ceremony": "🏆",
  event: "✨",
  other: "✦",
};

// カテゴリ → 左ボーダー色（at-a-glance スキャン用、Tailwind の literal class）
const CATEGORY_BORDER: Record<string, string> = {
  birthday: "border-l-pink-400",
  broadcast: "border-l-sky-400",
  "fan-meeting": "border-l-rose-400",
  concert: "border-l-violet-400",
  premiere: "border-l-amber-400",
  press: "border-l-slate-400",
  release: "border-l-emerald-400",
  fashion: "border-l-fuchsia-400",
  "award-ceremony": "border-l-yellow-500",
  event: "border-l-indigo-400",
  other: "border-l-yuri-edge",
};

// カテゴリ → 日付チップの背景色（控えめなトーン）
const CATEGORY_CHIP: Record<string, string> = {
  birthday: "bg-pink-50 text-pink-800",
  broadcast: "bg-sky-50 text-sky-800",
  "fan-meeting": "bg-rose-50 text-rose-800",
  concert: "bg-violet-50 text-violet-800",
  premiere: "bg-amber-50 text-amber-800",
  press: "bg-slate-50 text-slate-800",
  release: "bg-emerald-50 text-emerald-800",
  fashion: "bg-fuchsia-50 text-fuchsia-800",
  "award-ceremony": "bg-yellow-50 text-yellow-800",
  event: "bg-indigo-50 text-indigo-800",
  other: "bg-yuri-cream text-yuri-ink",
};

function dayParts(d: string): { day: string; weekday: string; month: string } {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return { day: "—", weekday: "", month: "" };
  return {
    day: String(date.getDate()),
    weekday: ["日", "月", "火", "水", "木", "金", "土"][date.getDay()],
    month: `${date.getMonth() + 1}月`,
  };
}

function formatYearMonth(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function CategoryBadge({ category }: { category: string }) {
  // 表記ゆれ（"Award Ceremony" 等）を正規化してからルックアップする
  const key = normalizeEventCategory(category);
  const label = EVENT_CATEGORY_LABELS[key] ?? category;
  const style =
    EVENT_CATEGORY_STYLES[key] ??
    "bg-yuri-cream text-yuri-ink border border-yuri-edge";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${style}`}
    >
      {label}
    </span>
  );
}

function EventCard({ event }: { event: GLEvent }) {
  // 表記ゆれを正規化してから色・アイコンを引く
  const key = normalizeEventCategory(event.category);
  const icon = CATEGORY_ICON[key] ?? "✦";
  const borderClass = CATEGORY_BORDER[key] ?? "border-l-yuri-edge";
  const chipClass = CATEGORY_CHIP[key] ?? "bg-yuri-cream text-yuri-ink";
  const d = dayParts(event.date);

  const venueLine = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(" · ");

  // タイトルラッパー（内部 / 外部リンク自動判別）
  const titleEl =
    event.link ? (
      event.link.startsWith("/") ? (
        <Link href={event.link} className="hover:text-yuri-rose">
          {event.title}
          <span aria-hidden className="ml-0.5 text-yuri-muted">→</span>
        </Link>
      ) : (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yuri-rose"
        >
          {event.title}
          <span aria-hidden className="ml-0.5 text-yuri-muted">↗</span>
        </a>
      )
    ) : (
      <span>{event.title}</span>
    );

  return (
    <article
      className={`bg-yuri-surface border border-yuri-edge ${borderClass} border-l-[4px] rounded-lg flex overflow-hidden`}
    >
      {/* 日付チップ（縦並び：月 / 日 / 曜日） */}
      <div
        className={`shrink-0 w-16 sm:w-[72px] flex flex-col items-center justify-center py-3 px-2 ${chipClass}`}
      >
        <span className="text-[10px] font-medium opacity-75 leading-none">
          {d.month}
        </span>
        <span className="text-2xl font-semibold leading-none mt-0.5">
          {d.day}
        </span>
        <span className="text-[10px] opacity-75 leading-none mt-1">
          {d.weekday}
        </span>
      </div>

      {/* 本体 */}
      <div className="flex-1 min-w-0 p-3 sm:p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span aria-hidden className="text-base leading-none">
            {icon}
          </span>
          <CategoryBadge category={event.category} />
          {event.end_date && event.end_date !== event.date && (
            <span className="text-[11px] text-yuri-muted">
              〜 {formatDate(event.end_date)}
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-medium text-yuri-ink leading-snug">
          {titleEl}
        </h3>

        {/* 詳細行：埋まっているフィールドだけインラインで表示 */}
        {(event.time || venueLine || event.pair || event.agency) && (
          <p className="mt-1.5 text-xs text-yuri-muted flex flex-wrap gap-x-2 gap-y-0.5">
            {event.time && <span>🕒 {event.time}</span>}
            {venueLine && <span>📍 {venueLine}</span>}
            {event.pair && (
              <span>
                👯{" "}
                <Link href="/cast" className="text-yuri-rose hover:underline">
                  {shortPairLabel(event.pair)}
                </Link>
              </span>
            )}
            {event.agency && <span>🏢 {event.agency}</span>}
          </p>
        )}

        {event.description && (
          <p className="mt-1.5 text-xs text-yuri-ink/75 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [filterPair, setFilterPair] = useState<string>("");
  const [filterAgency, setFilterAgency] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [showPast, setShowPast] = useState(false);

  const allEvents = useMemo(() => getAllEvents(), []);
  const {
    pairs: pairOptions,
    agencies: agencyOptions,
    categories: categoryOptions,
  } = useMemo(() => getEventFilterOptions(), []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = useMemo(() => {
    return allEvents
      .filter((e) => {
        const eventDate = new Date(e.date);
        const isPast = eventDate < today;
        if (!showPast && isPast) return false;
        if (showPast && !isPast) return false;
        // ペアは短縮名で比較（dropdown 側も短縮名を返す）
        if (filterPair && shortPairLabel(e.pair) !== filterPair) return false;
        if (filterAgency && e.agency !== filterAgency) return false;
        if (
          filterCategory &&
          normalizeEventCategory(e.category) !==
            normalizeEventCategory(filterCategory)
        )
          return false;
        return true;
      })
      .sort((a, b) =>
        showPast ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
      );
  }, [allEvents, filterPair, filterAgency, filterCategory, showPast, today]);

  // 月別グルーピング
  const grouped = useMemo(() => {
    const map = new Map<string, GLEvent[]>();
    for (const e of filtered) {
      const key = formatYearMonth(e.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          イベントカレンダー
        </h1>
        <p className="text-sm text-yuri-muted">
          女優の誕生日、ドラマ放送日、ファンミーティング、コンサート、プレミア、リリースイベントなど
        </p>
      </header>

      {/* バンコク行きのアフィリ（イベント参加導線）
          出発地を絞らない汎用コピー（東京以外の読者にも刺さる）にして、
          Trip.com トップに送る。トップバナーと同じ trip_sub3=D17647184 を使う。 */}
      <TripcomCard variant="compact" linkType="generic" />

      {/* フィルタ */}
      <div className="mb-6 bg-yuri-cream border border-yuri-edge rounded-lg p-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowPast(false)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !showPast
              ? "bg-yuri-navy text-yuri-cream"
              : "bg-yuri-surface text-yuri-ink border border-yuri-edge"
          }`}
        >
          これから
        </button>
        <button
          type="button"
          onClick={() => setShowPast(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            showPast
              ? "bg-yuri-navy text-yuri-cream"
              : "bg-yuri-surface text-yuri-ink border border-yuri-edge"
          }`}
        >
          過去
        </button>

        <div className="h-5 w-px bg-yuri-edge mx-1" />

        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-yuri-muted">種類:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1 rounded border border-yuri-edge bg-yuri-surface text-yuri-ink"
          >
            <option value="">すべて</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {EVENT_CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-yuri-muted">ペア:</span>
          <select
            value={filterPair}
            onChange={(e) => setFilterPair(e.target.value)}
            className="px-2 py-1 rounded border border-yuri-edge bg-yuri-surface text-yuri-ink"
          >
            <option value="">すべて</option>
            {pairOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-yuri-muted">事務所:</span>
          <select
            value={filterAgency}
            onChange={(e) => setFilterAgency(e.target.value)}
            className="px-2 py-1 rounded border border-yuri-edge bg-yuri-surface text-yuri-ink"
          >
            <option value="">すべて</option>
            {agencyOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        {(filterPair || filterAgency || filterCategory) && (
          <button
            type="button"
            onClick={() => {
              setFilterPair("");
              setFilterAgency("");
              setFilterCategory("");
            }}
            className="text-xs text-yuri-rose hover:underline"
          >
            条件クリア
          </button>
        )}
      </div>

      {/* 件数 */}
      <p className="text-xs text-yuri-muted mb-4">
        {filtered.length}件のイベント
      </p>

      {/* イベント一覧 */}
      {filtered.length === 0 ? (
        <div className="bg-yuri-surface border border-yuri-edge rounded-lg p-8 text-center text-sm text-yuri-muted">
          {allEvents.length === 0
            ? "イベント情報を準備中です。"
            : "条件に合うイベントがありません。"}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([month, items]) => (
            <section key={month}>
              <h2 className="text-sm font-medium text-yuri-muted tracking-wider mb-2">
                {month}
              </h2>
              <div className="space-y-3">
                {items.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
