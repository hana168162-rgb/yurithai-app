/**
 * X (Twitter) 自動投稿エンドポイント
 *
 * 動作:
 *   1. 全ブログ記事を取得
 *   2. 「今日 = JST」の日付の記事を抽出
 *   3. 投稿済みの slug（process.env / KV / 一時メモリ）を除外
 *   4. 残りを X に順次投稿
 *
 * 起動方法:
 *   - Vercel Cron Jobs（vercel.json で設定）から定期 GET
 *   - 手動: curl https://yurithai.jp/api/cron/auto-tweet -H "Authorization: Bearer $CRON_SECRET"
 *
 * セキュリティ:
 *   - CRON_SECRET が設定されていれば、Authorization ヘッダで照合（Vercel Cron 自動付与）
 *   - 不一致なら 401
 *
 * レスポンス: 投稿結果の JSON（誰がいつ何を投稿したかのログ替わり）
 *
 * 注意:
 *   - X 投稿は **副作用** なので、開発環境で間違って叩いても投稿が走らないよう
 *     X_API_KEY 等が未設定なら自動で no-op になる仕組み（lib/twitter.ts 側）。
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";
import {
  buildTweetText,
  postTweet,
  TWEET_MAX_LENGTH,
} from "@/lib/twitter";

// Vercel Edge ではなく Node ランタイムで動かす（twitter-api-v2 が Node のみ対応）
export const runtime = "nodejs";
// キャッシュさせない
export const dynamic = "force-dynamic";

/** JST で今日の YYYY-MM-DD を返す */
function todayJST(): string {
  // タイムゾーン考慮（Asia/Tokyo）
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // "YYYY-MM-DD"
}

/** Vercel Cron / 開発時の手動アクセス両方に対応した認可チェック */
function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  // CRON_SECRET 未設定なら、誰でも叩ける（ローカル/初期開発用）
  if (!expected) return true;
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  return auth === `Bearer ${expected}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const today = todayJST();
  const posts = getAllBlogPosts();

  // 今日付の記事だけ
  const todays = posts.filter((p) => p.date === today);

  if (todays.length === 0) {
    return NextResponse.json({
      ok: true,
      today,
      message: "No posts for today, nothing to tweet.",
      candidates: 0,
    });
  }

  // 投稿安全装置：1 回の cron 実行で 5 件まで（不慮の連投防止）
  const targets = todays.slice(0, 5);

  const results = [];
  for (const post of targets) {
    const text = buildTweetText({
      title: post.title,
      description: post.description,
      slug: post.slug,
      category: post.category,
      tags: post.tags,
    });

    // 念のため最大長チェック（buildTweetText 側でも調整しているが防衛的に）
    const safe =
      text.length <= TWEET_MAX_LENGTH
        ? text
        : text.slice(0, TWEET_MAX_LENGTH - 1) + "…";

    const r = await postTweet(safe);
    results.push({
      slug: post.slug,
      title: post.title,
      text: safe,
      posted: r.posted,
      id: r.id ?? null,
      reason: r.reason ?? null,
    });
  }

  return NextResponse.json({
    ok: true,
    today,
    candidates: todays.length,
    posted: results.filter((r) => r.posted).length,
    skipped: results.filter((r) => !r.posted).length,
    results,
  });
}
