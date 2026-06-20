/**
 * X (Twitter) 自動投稿エンドポイント — 1日3スロット運用
 *
 * Vercel Cron が 1 日 3 回 GET でこのエンドポイントを叩く想定（vercel.json で設定）。
 *   - 00:00 UTC  → 09:00 JST  (slot 0 / morning)
 *   - 04:00 UTC  → 13:00 JST  (slot 1 / noon)
 *   - 09:00 UTC  → 18:00 JST  (slot 2 / evening)
 *
 * 各スロットで以下のロジックに従って 1 件投稿する:
 *
 *   1. 今日(JST) 日付の「ブログ記事（sns-update カテゴリは除外）」を取得し
 *      slug 昇順で並べる。
 *   2. 当該スロットの index に該当する記事があれば、それを投稿する。
 *   3. 該当が無ければスロット別のフォールバック:
 *        slot 0 → 過去ブログ再紹介（throwback）
 *        slot 1 → 放送中作品の紹介（drama-airing）
 *        slot 2 → 完結作品 / 過去ブログ / 診断 をローテーション
 *
 * 「同じ日に同じ内容を投稿しない」を実現するため、フォールバック内の選択は
 * date + slot を seed にした決定的ランダムで行う。
 *
 * 手動デバッグ用クエリ:
 *   ?slot=0|1|2     スロット強制指定（時刻判定をバイパス）
 *   ?dry=1          実投稿をスキップし、生成テキストだけ返す
 *
 * 認可:
 *   CRON_SECRET が設定されていれば Authorization: Bearer <secret> を要求。
 *   未設定なら誰でも叩ける（ローカル / 初期開発用）。
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";
import { watching, dramas } from "@/lib/content";
import type { WatchingDrama, Drama } from "@/lib/types";
import {
  buildBlogTweet,
  buildThrowbackTweet,
  buildDramaTweet,
  buildDiagnosticTweet,
  hashStringToIndex,
  postTweet,
  TWEET_MAX_LENGTH,
} from "@/lib/twitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
//  時刻ヘルパ
// ---------------------------------------------------------------------------

/** JST で "YYYY-MM-DD" */
function todayJST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** JST の時刻 (0-23) */
function jstHour(): number {
  const h = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  return parseInt(h, 10);
}

/**
 * 現在の JST 時刻からスロットを決定。
 *   slot 0 (morning) : 06:00 - 11:59
 *   slot 1 (noon)    : 12:00 - 15:59
 *   slot 2 (evening) : 16:00 - 23:59
 *   その他           : 0 にフォールバック（深夜帯の手動アクセス時用）
 */
function currentSlot(): 0 | 1 | 2 {
  const h = jstHour();
  if (h >= 6 && h < 12) return 0;
  if (h >= 12 && h < 16) return 1;
  if (h >= 16) return 2;
  return 0;
}

// ---------------------------------------------------------------------------
//  認可
// ---------------------------------------------------------------------------

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return true; // ローカル
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${expected}`;
}

// ---------------------------------------------------------------------------
//  コンテンツ選択
// ---------------------------------------------------------------------------

/** 今日のブログ記事（sns-update を除く） */
function todaysBlogs(today: string) {
  return getAllBlogPosts()
    .filter((p) => p.date === today && p.category !== "sns-update")
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** 過去のブログ記事（14 日以上前、sns-update を除く） */
function throwbackBlogs(today: string) {
  const todayTime = new Date(today + "T00:00:00+09:00").getTime();
  const cutoff = todayTime - 14 * 24 * 60 * 60 * 1000;

  return getAllBlogPosts().filter((p) => {
    if (p.category === "sns-update") return false;
    if (!p.date) return false;
    const t = new Date(p.date + "T00:00:00+09:00").getTime();
    if (Number.isNaN(t)) return false;
    return t <= cutoff;
  });
}

/** 紹介用：放送中作品 */
function pickAiringDrama(seedKey: string): WatchingDrama | null {
  const list = (watching as WatchingDrama[]).filter(
    (w) => w.status === "airing",
  );
  if (list.length === 0) return null;
  return list[hashStringToIndex(seedKey, list.length)];
}

/** 紹介用：完結作品 */
function pickCompletedDrama(seedKey: string): Drama | null {
  const list = dramas as Drama[];
  if (list.length === 0) return null;
  return list[hashStringToIndex(seedKey + "C", list.length)];
}

/** Drama note から短い hook を抽出 */
function shortHookFromNote(note: string | null | undefined, fallback = ""): string {
  if (!note) return fallback;
  const parts = note.split(/[/／]/).map((s) => s.trim()).filter(Boolean);
  return parts.slice(0, 2).join(" / ");
}

// ---------------------------------------------------------------------------
//  スロットに応じたテキスト生成
// ---------------------------------------------------------------------------

function buildSlotTweet(opts: {
  slot: 0 | 1 | 2;
  today: string;
}): { text: string; type: string; ref?: string } {
  const { slot, today } = opts;
  const blogs = todaysBlogs(today);

  // 1. 当日新着ブログがあればそれを優先（slot 順に割り当て）
  if (blogs[slot]) {
    const b = blogs[slot];
    return {
      text: buildBlogTweet({
        title: b.title,
        description: b.description,
        slug: b.slug,
        category: b.category,
        tags: b.tags,
      }),
      type: "new-blog",
      ref: b.slug,
    };
  }

  // 2. スロット別フォールバック
  const seed = `${today}-${slot}`;

  if (slot === 0) {
    const past = throwbackBlogs(today);
    if (past.length > 0) {
      const idx = hashStringToIndex(seed, past.length);
      const b = past[idx];
      return {
        text: buildThrowbackTweet({
          title: b.title,
          description: b.description,
          slug: b.slug,
          category: b.category,
          tags: b.tags,
        }),
        type: "throwback-blog",
        ref: b.slug,
      };
    }
    return { text: buildDiagnosticTweet(seed), type: "diagnostic" };
  }

  if (slot === 1) {
    const d = pickAiringDrama(seed);
    if (d) {
      const hook = shortHookFromNote(d.note, d.production ?? "");
      return {
        text: buildDramaTweet({
          title_ja: d.title_ja,
          title_th: d.title_th,
          hook,
          slug: d.slug,
          status: "airing",
        }),
        type: "drama-airing",
        ref: d.slug,
      };
    }
    const c = pickCompletedDrama(seed);
    if (c) {
      const hook = shortHookFromNote(c.note, c.production ?? "");
      return {
        text: buildDramaTweet({
          title_ja: c.title_ja,
          title_th: c.title_th,
          hook,
          slug: c.slug,
          status: "completed",
        }),
        type: "drama-completed",
        ref: c.slug,
      };
    }
    return { text: buildDiagnosticTweet(seed), type: "diagnostic" };
  }

  // slot === 2 — ローテーション
  const altRoll = hashStringToIndex(seed, 3);
  if (altRoll === 0) {
    const c = pickCompletedDrama(seed);
    if (c) {
      const hook = shortHookFromNote(c.note, c.production ?? "");
      return {
        text: buildDramaTweet({
          title_ja: c.title_ja,
          title_th: c.title_th,
          hook,
          slug: c.slug,
          status: "completed",
        }),
        type: "drama-completed",
        ref: c.slug,
      };
    }
  }
  if (altRoll === 1) {
    const past = throwbackBlogs(today);
    if (past.length > 0) {
      const idx = hashStringToIndex(seed + "B", past.length);
      const b = past[idx];
      return {
        text: buildThrowbackTweet({
          title: b.title,
          description: b.description,
          slug: b.slug,
          category: b.category,
          tags: b.tags,
        }),
        type: "throwback-blog",
        ref: b.slug,
      };
    }
  }
  return { text: buildDiagnosticTweet(seed), type: "diagnostic" };
}

// ---------------------------------------------------------------------------
//  ハンドラ
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const slotParam = url.searchParams.get("slot");
  let slot: 0 | 1 | 2;
  if (slotParam === "0" || slotParam === "1" || slotParam === "2") {
    slot = Number(slotParam) as 0 | 1 | 2;
  } else {
    slot = currentSlot();
  }

  const today = todayJST();
  const built = buildSlotTweet({ slot, today });

  // 念のため最終長チェック
  const safe =
    built.text.length <= TWEET_MAX_LENGTH
      ? built.text
      : built.text.slice(0, TWEET_MAX_LENGTH - 1) + "…";

  if (dry) {
    return NextResponse.json({
      ok: true,
      today,
      slot,
      type: built.type,
      ref: built.ref,
      text: safe,
      length: safe.length,
      dry: true,
    });
  }

  const r = await postTweet(safe);
  return NextResponse.json({
    ok: true,
    today,
    slot,
    type: built.type,
    ref: built.ref,
    posted: r.posted,
    id: r.id ?? null,
    reason: r.reason ?? null,
    text: safe,
    length: safe.length,
  });
}
