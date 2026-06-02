"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getAllEvents,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_STYLES,
  getEventFilterOptions,
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

function formatYearMonth(d: string): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function CategoryBadge({ category }: { category: string }) {
  const label = EVENT_CATEGORY_LABELS[category] ?? category;
  const style =
    EVENT_CATEGORY_STYLES[category] ??
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
  return (
    <article className="bg-yuri-surface border border-yuri-edge rounded-lg p-4">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-base font-medium text-yuri-navy">
          {formatDate(event.date)}
          {event.end_date && event.end_date !== event.date && (
            <>
              <span className="text-yuri-muted text-sm"> 〜 </span>
              <span>{formatDate(event.end_date)}</span>
            </>
          )}
        </p>
        <CategoryBadge category={event.category} />
      </div>
      <h3 className="text-sm font-medium text-yuri-ink mb-2">
        {event.link ? (
          event.link.startsWith("/") ? (
            <Link href={event.link} className="hover:text-yuri-rose">
              {event.title} →
            </Link>
          ) : (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yuri-rose"
            >
              {event.title} ↗
            </a>
          )
        ) : (
          event.title
        )}
      </h3>

      <dl className="text-xs space-y-1 mb-2">
        {event.time && (
          <div className="flex">
            <dt className="w-16 text-yuri-muted shrink-0">時刻</dt>
            <dd className="text-yuri-ink">{event.time}</dd>
          </div>
        )}
        {(event.venue || event.city) && (
          <div className="flex">
            <dt className="w-16 text-yuri-muted shrink-0">会場</dt>
            <dd className="text-yuri-ink">
              {[event.venue, event.city, event.country]
                .filter(Boolean)
                .join(" · ")}
            </dd>
          </div>
        )}
        {event.pair && (
          <div className="flex">
            <dt className="w-16 text-yuri-muted shrink-0">ペア</dt>
            <dd>
              <Link
                href={`/cast`}
                className="text-yuri-rose hover:underline"
              >
                {event.pair}
              </Link>
            </dd>
          </div>
        )}
        {event.agency && (
          <div className="flex">
            <dt className="w-16 text-yuri-muted shrink-0">事務所</dt>
            <dd className="text-yuri-ink">{event.agency}</dd>
          </div>
        )}
      </dl>

      {event.description && (
        <p className="text-xs text-yuri-ink/80 leading-relaxed">
          {event.description}
        </p>
      )}
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
        if (filterPair && e.pair !== filterPair) return false;
        if (filterAgency && e.agency !== filterAgency) return false;
        if (filterCategory && e.category !== filterCategory) return false;
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

      {/* バンコク行きのアフィリ（イベント参加導線） */}
      <TripcomCard variant="compact" />

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
          {events.length === 0
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
