"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import bannersData from "@/content/banners.json";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string; // tailwind gradient classes, e.g. "from-yuri-rose to-yuri-pink"
  fg: string; // tailwind text color class
  icon?: string;
};

const banners = bannersData as Banner[];
const ROTATE_MS = 4000;            // 自動回転の間隔
const SWIPE_THRESHOLD = 40;        // この距離以上ドラッグしたらスライドを進める/戻す
const PAUSE_AFTER_SWIPE_MS = 6000; // 手動操作後しばらく自動回転を停止

// バナーを表示しないパス（作品詳細ページなど、コンテンツに集中させたい場所）
function shouldHide(pathname: string | null): boolean {
  if (!pathname) return false;
  // /dramas/[slug] の詳細ページでは非表示。
  // /dramas, /dramas/airing, /dramas/upcoming はトップ階層なので表示する。
  if (/^\/dramas\/[^/]+$/.test(pathname)) {
    const seg = pathname.split("/")[2];
    if (seg !== "airing" && seg !== "upcoming") return true;
  }
  return false;
}

export function CampaignBanner() {
  const pathname = usePathname();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragDx, setDragDx] = useState(0); // ドラッグ中の指追従用 px
  const startX = useRef<number | null>(null);
  const wasSwiped = useRef(false); // クリック抑制判定用（同期refで状態保持）
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 自動回転
  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  // 手動操作後の一時停止タイマー
  function tempPause() {
    setPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setPaused(false), PAUSE_AFTER_SWIPE_MS);
  }

  function goPrev() {
    setIdx((i) => (i - 1 + banners.length) % banners.length);
    tempPause();
  }
  function goNext() {
    setIdx((i) => (i + 1) % banners.length);
    tempPause();
  }
  function goTo(i: number) {
    setIdx(i);
    tempPause();
  }

  // Pointer Events: マウスもタッチも両方拾える
  // 5px未満の微小な動きはクリックとして通す（Link の navigation を妨げない）。
  // 5px以上動いて初めて setPointerCapture でドラッグ確定 → スワイプ判定。
  const DRAG_START_PX = 5;
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    startX.current = e.clientX;
    setDragDx(0);
    wasSwiped.current = false;
    // ここでは setPointerCapture を呼ばない（クリックイベントを妨げない）。
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;

    // 一定量動いて初めて「ドラッグ」として扱い、ポインター捕獲を開始
    if (
      Math.abs(dx) >= DRAG_START_PX &&
      !e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    setDragDx(dx);
    if (Math.abs(dx) >= SWIPE_THRESHOLD) wasSwiped.current = true;
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const dx = dragDx;
    startX.current = null;
    setDragDx(0);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  if (banners.length === 0) return null;
  if (shouldHide(pathname)) return null;

  return (
    <div
      className="mx-auto max-w-6xl px-4 md:px-6 mt-3 md:mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl shadow-sm select-none">
        {/* スライド本体 */}
        <div
          className={`flex touch-pan-y ${
            startX.current !== null ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            transform: `translateX(calc(-${idx * 100}% + ${dragDx}px))`,
            transition: startX.current === null ? "transform 500ms ease-out" : "none",
          }}
          aria-live="polite"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              draggable={false}
              onClick={(e) => {
                // スワイプ（>= SWIPE_THRESHOLD px のドラッグ）の直後だけクリックを抑制。
                // 通常のクリック（数px未満の微小なマウス移動）は素通しでナビゲートさせる。
                if (wasSwiped.current) {
                  e.preventDefault();
                  wasSwiped.current = false;
                }
              }}
              className={`shrink-0 w-full bg-gradient-to-r ${b.bg} ${b.fg} px-5 md:px-7 py-3.5 md:py-5 flex items-center gap-3.5 md:gap-4 cursor-pointer hover:opacity-95`}
            >
              {b.icon && (
                <div className="text-2xl md:text-3xl shrink-0" aria-hidden>
                  {b.icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[15px] md:text-lg font-semibold leading-snug truncate">
                  {b.title}
                </div>
                <div className="text-[12px] md:text-sm opacity-90 leading-snug truncate">
                  {b.subtitle}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs md:text-sm opacity-90 shrink-0">
                {b.cta}
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 左右矢印（PC・タブレット表示） */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="前のスライドへ"
              onClick={goPrev}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 items-center justify-center rounded-full bg-white/85 hover:bg-white text-yuri-ink shadow-sm z-10"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="次のスライドへ"
              onClick={goNext}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 items-center justify-center rounded-full bg-white/85 hover:bg-white text-yuri-ink shadow-sm z-10"
            >
              ›
            </button>
          </>
        )}

        {/* インジケーター */}
        {banners.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`スライド ${i + 1} へ`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-white/90" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
