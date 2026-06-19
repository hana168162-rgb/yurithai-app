/**
 * X (Twitter) API クライアントラッパー。
 *
 * - twitter-api-v2 を使用（OAuth 1.0a User Context）
 * - 環境変数から認証情報を取得
 * - 投稿のテキスト構築・280字制限のハンドリングを集約
 *
 * 必要な環境変数（Vercel に設定）:
 *   - X_API_KEY        : Consumer Key（API Key）
 *   - X_API_SECRET     : Consumer Secret（API Key Secret）
 *   - X_ACCESS_TOKEN   : Access Token
 *   - X_ACCESS_SECRET  : Access Token Secret
 *
 * すべて未設定なら getTwitterClient() は null を返し、投稿はスキップされる
 * （ローカル開発・PRプレビュー等での誤投稿防止）。
 */

import { TwitterApi } from "twitter-api-v2";

const SITE_URL = "https://yurithai.jp";

/** 280 文字（X の上限）— 投稿テキストはこの長さ以下に */
export const TWEET_MAX_LENGTH = 280;

/** URL は X 側で短縮 t.co URL（23 文字）として計算される */
export const TCO_URL_LENGTH = 23;

export interface TweetBlogInput {
  title: string;
  description: string;
  slug: string;
  /** 'sns-update' なら "デイリー速報" 表記、それ以外は "新記事" 表記 */
  category: string;
  tags: string[];
}

/**
 * 環境変数が揃っているときだけ TwitterApi クライアントを返す。
 * 揃っていなければ null（呼び出し側でスキップ判定）。
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
 * ブログ記事から X 用テキストを組み立てる。
 *
 * 構成:
 *   [プレフィックス] タイトル
 *   （空行）
 *   説明文（残り文字に応じて省略）
 *   （空行）
 *   URL
 *   ハッシュタグ群
 *
 * 280 字以内に収まるよう description を末尾から削る。
 */
export function buildTweetText(input: TweetBlogInput): string {
  const prefix =
    input.category === "sns-update" ? "🗓 デイリー速報" : "📖 新着記事";

  const url = `${SITE_URL}/blog/${input.slug}`;

  // ハッシュタグ：「#タイGL」固定 + 記事タグから最大3個
  const hashes = ["#タイGL"];
  for (const t of input.tags.slice(0, 3)) {
    // X はハッシュタグ内の空白を許さないので除去
    hashes.push("#" + t.replace(/\s+/g, ""));
  }
  const hashLine = hashes.join(" ");

  const titleLine = `${prefix} ${input.title}`;

  // 固定部分（description 抜きで）の長さを試算
  // URL は t.co で 23 文字計算
  const fixedLen =
    titleLine.length +
    1 /* \n */ +
    1 /* \n（説明文と URL の間）*/ +
    TCO_URL_LENGTH +
    1 /* \n */ +
    hashLine.length;

  const descBudget = TWEET_MAX_LENGTH - fixedLen;
  let desc = input.description.trim();
  if (descBudget <= 0) {
    desc = "";
  } else if (desc.length > descBudget) {
    desc = desc.slice(0, Math.max(0, descBudget - 1)) + "…";
  }

  const parts: string[] = [titleLine];
  if (desc) {
    parts.push("");
    parts.push(desc);
  }
  parts.push("");
  parts.push(url);
  parts.push(hashLine);
  return parts.join("\n");
}

/**
 * 実投稿。クライアント未設定なら no-op。
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
