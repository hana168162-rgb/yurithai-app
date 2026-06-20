/**
 * X (Twitter) API クライアント + 投稿テキストビルダー。
 *
 * - twitter-api-v2（OAuth 1.0a User Context）
 * - 環境変数から認証情報取得
 * - 投稿コピーは「新着ブログ / 過去ブログ再紹介 / 作品紹介 / 診断プロモ」の 4 種
 *
 * 設計方針:
 *   - 派手な絵文字スパムや「📖 新着記事」のような自動感は避ける
 *   - 1〜2 個のサブタイ風絵文字 + 簡潔な見出し + 1 行フック + URL + #タイGL
 *   - 文字数は 280 字以内、余裕がなければ description を末尾省略
 *
 * 必要な環境変数 (Vercel):
 *   - X_API_KEY        : Consumer Key
 *   - X_API_SECRET     : Consumer Secret
 *   - X_ACCESS_TOKEN   : Access Token
 *   - X_ACCESS_SECRET  : Access Token Secret
 */

import { TwitterApi } from "twitter-api-v2";

const SITE_URL = "https://yurithai.jp";

/** X の文字数上限 */
export const TWEET_MAX_LENGTH = 280;

/** URL は t.co 短縮で固定 23 文字 */
export const TCO_URL_LENGTH = 23;

// ---------------------------------------------------------------------------
//  クライアント
// ---------------------------------------------------------------------------

/**
 * 環境変数が揃っているときだけ TwitterApi クライアントを返す。
 * 開発・PR プレビュー等で誤投稿しないための安全装置。
 */
export function getTwitterClient(): TwitterApi | null {
  const k = process.env.X_API_KEY;
  const s = process.env.X_API_SECRET;
  const at = process.env.X_ACCESS_TOKEN;
  const ats = process.env.X_ACCESS_SECRET;
  if (!k || !s || !at || !ats) return null;
  return new TwitterApi({
    appKey: k,
    appSecret: s,
    accessToken: at,
    accessSecret: ats,
  });
}

/**
 * テキストを投稿。クライアント未設定なら no-op。
 */
export async function postTweet(text: string): Promise<{
  posted: boolean;
  id?: string;
  reason?: string;
}> {
  const client = getTwitterClient();
  if (!client) {
    return { posted: false, reason: "X API credentials not set" };
  }
  try {
    const res = await client.v2.tweet(text);
    return { posted: true, id: res.data.id };
  } catch (err) {
    return {
      posted: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
//  共通ユーティリティ
// ---------------------------------------------------------------------------

/** 1 行に押し込む（改行を半角スペースに） */
function flatten(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

/**
 * 与えられたヘッダ・本文・URL・タグから 280 字以内のテキストを組み立てる。
 * 本文は予算を超えるとき末尾省略（"…"）する。
 */
function assemble(opts: {
  header: string;          // 例 "🌸 新記事公開"
  title: string;           // 必須見出し（記事タイトル or 作品名）
  hook: string;            // 1 行フック（短くトリミングされる）
  url: string;             // パスのみ or フル URL
  hashtags: string[];      // ["#タイGL"] など
}): string {
  const fullUrl = opts.url.startsWith("http")
    ? opts.url
    : `${SITE_URL}${opts.url.startsWith("/") ? opts.url : "/" + opts.url}`;

  const hashLine = opts.hashtags.join(" ");
  const headerLine = flatten(opts.header);
  const titleLine = flatten(opts.title);

  // 固定で必要な長さを試算
  // [header]\n\n[title]\n\n[hook?]\n\n[URL=23]\n[hashtags]
  const fixedLen =
    headerLine.length + 1 + // header + \n
    1 +                     // 空行
    titleLine.length + 1 + // title + \n
    1 +                     // 空行
    1 +                     // \n（hook がある場合のための余地）
    TCO_URL_LENGTH + 1 +    // URL + \n
    hashLine.length;

  const hookBudget = TWEET_MAX_LENGTH - fixedLen;
  let hook = flatten(opts.hook);
  if (hookBudget <= 1) {
    hook = "";
  } else if (hook.length > hookBudget) {
    hook = hook.slice(0, Math.max(0, hookBudget - 1)) + "…";
  }

  const parts: string[] = [headerLine, "", titleLine];
  if (hook) {
    parts.push("");
    parts.push(hook);
  }
  parts.push("");
  parts.push(fullUrl);
  parts.push(hashLine);
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
//  1. 新着ブログ
// ---------------------------------------------------------------------------

export interface BlogTweetInput {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
}

/**
 * 当日の新着ブログ用ツイート。
 *
 * 例:
 *   🌸 新着記事
 *
 *   タイGL × オフィスロマンス完全ガイド
 *
 *   GAP から Hak Na My Boss まで、上司×部下構造の系譜を整理。
 *
 *   https://yurithai.jp/blog/thai-gl-office-romance-guide
 *   #タイGL #オフィスロマンス
 */
export function buildBlogTweet(input: BlogTweetInput): string {
  // sns-update（Manus 速報）はもう使わない想定だが、来ても自然に振る舞う
  const header =
    input.category === "sns-update"
      ? "🗓 デイリー速報"
      : "🌸 新着記事";

  const hashtags = ["#タイGL"];
  // 記事タグから最初の 1 つだけ採用（過剰なハッシュタグは "自動感" の原因）
  for (const t of input.tags.slice(0, 1)) {
    const clean = t.replace(/\s+/g, "");
    if (clean && clean.length <= 18) hashtags.push("#" + clean);
  }

  return assemble({
    header,
    title: input.title,
    hook: input.description,
    url: `/blog/${input.slug}`,
    hashtags,
  });
}

// ---------------------------------------------------------------------------
//  2. 過去ブログ再紹介
// ---------------------------------------------------------------------------

/**
 * 過去ブログ再紹介用ツイート。
 *
 * 例:
 *   📚 アーカイブから
 *
 *   ShellyPundao 完全ガイド
 *
 *   無名から Roller Coaster 主演まで——タイGL界に現れた新世代ペアの軌跡。
 *
 *   https://yurithai.jp/blog/shellypundao-feature
 *   #タイGL
 */
export function buildThrowbackTweet(input: BlogTweetInput): string {
  return assemble({
    header: "📚 アーカイブから",
    title: input.title,
    hook: input.description,
    url: `/blog/${input.slug}`,
    hashtags: ["#タイGL"],
  });
}

// ---------------------------------------------------------------------------
//  3. 作品紹介
// ---------------------------------------------------------------------------

export interface DramaTweetInput {
  title_ja: string;
  title_th?: string | null;
  /** 短い紹介文 */
  hook: string;
  slug: string;
  status: "airing" | "completed" | "upcoming" | "unknown";
}

/**
 * 作品紹介ツイート。
 *
 * 例:
 *   🎬 注目作
 *
 *   Chasing Love（ตามล่าหารัก）
 *
 *   NileNamwan デビュー作、毎週金曜配信。Netflix で日本からも視聴可。
 *
 *   https://yurithai.jp/dramas/chasing-love
 *   #タイGL
 */
export function buildDramaTweet(input: DramaTweetInput): string {
  const header =
    input.status === "airing"
      ? "🎬 放送中の注目作"
      : input.status === "upcoming"
        ? "✨ 公開予定"
        : "🎞 観てほしい1作";

  const titleLine = input.title_th
    ? `${input.title_ja}（${input.title_th}）`
    : input.title_ja;

  return assemble({
    header,
    title: titleLine,
    hook: input.hook,
    url: `/dramas/${input.slug}`,
    hashtags: ["#タイGL"],
  });
}

// ---------------------------------------------------------------------------
//  4. 診断プロモ
// ---------------------------------------------------------------------------

/** 診断プロモのバリエーション（曜日 % で巡回） */
const DIAGNOSTIC_VARIANTS: { header: string; title: string; hook: string }[] = [
  {
    header: "✦ おすすめ診断",
    title: "タイGL、何から観ればいい？",
    hook: "5 問の質問で、あなたに合う 1 作をマッチング。「気分」と「観たい関係性」で選びます。",
  },
  {
    header: "✦ こんな日に",
    title: "観たい気分から、1 作を",
    hook: "甘め？切ない？オフィス？校園？選択肢に答えるだけで、ぴったりの 1 作が出ます。",
  },
  {
    header: "✦ 迷ったときに",
    title: "タイGLおすすめ診断",
    hook: "ペア・ジャンル・トロープから、あなたの気分に合った 1 作を提案します。",
  },
];

/**
 * 診断プロモツイート。日付 + スロットで variant を決定するので
 * 同じ日に複数回呼んでも同じものは選ばれない設計。
 */
export function buildDiagnosticTweet(seedKey: string): string {
  const idx = hashStringToIndex(seedKey, DIAGNOSTIC_VARIANTS.length);
  const v = DIAGNOSTIC_VARIANTS[idx];
  return assemble({
    header: v.header,
    title: v.title,
    hook: v.hook,
    url: "/recommend",
    hashtags: ["#タイGL", "#タイGLおすすめ"],
  });
}

/** 文字列 → 0 ≤ n < size の決定的なインデックス */
export function hashStringToIndex(s: string, size: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % Math.max(1, size);
}
