/**
 * アフィリエイト設定の集約ファイル
 *
 * ここに記載した URL / HTML が、サイト全体のアフィリリンク・バナーに使われます。
 * 配信先や条件が変わったら、このファイルだけ書き換えれば全ページに反映されます。
 *
 * URL は環境変数 NEXT_PUBLIC_NORDVPN_AFF_URL があればそちらを優先。
 * （Vercel で URL を差し替えたいケース対応）
 */

// ====== NordVPN ======
// 承認済みアフィリエイトURL（aff_id=148221 / offer_id=15 / url_id=880）
const NORDVPN_DEFAULT_URL =
  "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148221&url_id=880";

export const NORDVPN = {
  /** 計測付きアフィリエイトURL。クリック時に飛ばす先。 */
  url: process.env.NEXT_PUBLIC_NORDVPN_AFF_URL || NORDVPN_DEFAULT_URL,

  /** カードの見出し */
  cardTitle: "海外配信のタイGLを観るなら NordVPN",

  /** カードのサブテキスト */
  cardSubtitle:
    "iQIYI（タイ）・AIS Play など、日本からだと観られないタイGLを快適に。30日間の返金保証つき。",

  /** ボタンラベル */
  cta: "NordVPN を見る",

  /**
   * NordVPN 提供のバナー HTML（iframe など）を貼り付ける場所。
   * 空文字なら専用ガイドページにはバナーを表示しない。
   * 例:
   *   `<iframe src="https://go.nordvpn.net/aff_..." width="728" height="90" frameborder="0"></iframe>`
   *
   * セキュリティ上、ここに貼る HTML は信頼できる NordVPN（または提携の Impact/CJ 等）の
   * オフィシャルコードだけにしてください。
   */
  bannerHtml: "",
} as const;

/** 共通のアフィリ免責文 */
export const AFFILIATE_DISCLOSURE_SHORT = "PR";
export const AFFILIATE_DISCLOSURE_LONG =
  "本リンクからのご加入で、YuriThai に紹介手数料が入る場合があります（アフィリエイト広告）。サービスの提供条件や料金はリンク先のサイトをご確認ください。";
