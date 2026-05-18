"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
const ROTATE_MS = 5500;

export function CampaignBanner() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  if (banners.length === 0) return null;

  return (
    <div
      className="mx-auto max-w-6xl px-4 md:px-6 mt-3 md:mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl shadow-sm">
        {/* スライド本体 */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
          aria-live="polite"
        >
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className={`shrink-0 w-full bg-gradient-to-r ${b.bg} ${b.fg} px-5 md:px-7 py-4 md:py-5 flex items-center gap-4`}
            >
              {b.icon && (
                <div className="text-2xl md:text-3xl shrink-0" aria-hidden>
                  {b.icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[13px] md:text-base font-medium leading-snug truncate">
                  {b.title}
                </div>
                <div className="text-[11px] md:text-sm opacity-80 leading-snug truncate">
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
                  setIdx(i);
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
