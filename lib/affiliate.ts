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

  /**
   * カードの見出し。
   * 商標規約に従い、Nord Marks を独自商標と結合する見出しは避けています。
   */
  cardTitle: "VPNサービスのご紹介 — NordVPN®",

  /**
   * カードのサブテキスト。
   * 機能・条件は NordVPN 公式の一般情報のみを記載し、誇大な表現を避ける。
   */
  cardSubtitle:
    "海外（タイ等）の配信サービスを観る際の選択肢として。30日間返金保証あり ※詳細は公式サイトをご確認ください。",

  /** ボタンラベル */
  cta: "NordVPN® 公式サイト",

  /**
   * NordVPN 提供のバナー HTML（iframe など）を貼り付ける場所。
   * 空文字なら専用ガイドページにはバナーを表示しない。
   * NordVPN 公式アフィリエイトダッシュボードから取得した
   * 正規のクリエイティブ HTML のみを貼ること。
   */
  bannerHtml: "",

  /**
   * NordVPN 公式提供のバナー画像（/public/affiliate/nordvpn/ 配下）。
   * 規約上、改変・トリミング・色変更は禁止。元データをそのまま配置する。
   *
   * クリエイティブテーマ:
   * - borderless: 白背景・赤CTA「国境のないインターネットを探検しよう」
   *   → タイGL文脈（海外配信を観る）に最も合うのでメインで使用
   * - cybersec:   青背景・緑CTA「サイバー脅威からデジタルライフを守る」
   *   → セキュリティ訴求。サブ的に使用
   */
  banners: {
    // ---- 白背景「国境のない…」シリーズ ----
    borderless_728x90: {
      src: "/affiliate/nordvpn/borderless-728x90.png",
      width: 728,
      height: 90,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_1500x180: {
      src: "/affiliate/nordvpn/borderless-1500x180.png",
      width: 1500,
      height: 180,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_300x300: {
      src: "/affiliate/nordvpn/borderless-300x300.png",
      width: 300,
      height: 300,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_160x600: {
      src: "/affiliate/nordvpn/borderless-160x600.png",
      width: 160,
      height: 600,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_300x600: {
      src: "/affiliate/nordvpn/borderless-300x600.png",
      width: 300,
      height: 600,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_1200x630: {
      src: "/affiliate/nordvpn/borderless-1200x630.png",
      width: 1200,
      height: 630,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    // ---- 青背景「サイバー脅威…」シリーズ ----
    cybersec_728x90: {
      src: "/affiliate/nordvpn/cybersec-728x90.png",
      width: 728,
      height: 90,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1500x180: {
      src: "/affiliate/nordvpn/cybersec-1500x180.png",
      width: 1500,
      height: 180,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_300x600: {
      src: "/affiliate/nordvpn/cybersec-300x600.png",
      width: 300,
      height: 600,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_180x600: {
      src: "/affiliate/nordvpn/cybersec-180x600.png",
      width: 180,
      height: 600,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1200x630: {
      src: "/affiliate/nordvpn/cybersec-1200x630.png",
      width: 1200,
      height: 630,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1200x1200: {
      src: "/affiliate/nordvpn/cybersec-1200x1200.png",
      width: 1200,
      height: 1200,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
  },
} as const;

export type NordVpnBannerKey = keyof typeof NORDVPN.banners;

/** PR表記（短） */
export const AFFILIATE_DISCLOSURE_SHORT = "広告";

/** PR表記（長） — 景品表示法に基づくステマ規制対応の明示文 */
export const AFFILIATE_DISCLOSURE_LONG =
  "本ページにはアフィリエイト広告（PR）が含まれます。リンクからご加入いただくと、YuriThai に紹介報酬が支払われる場合があります。サービス内容・料金・キャンペーン等の最新情報は必ずリンク先の公式サイトでご確認ください。";

/**
 * Nord Marks の商標帰属表記。
 * NordVPN 提供の商標ガイドラインに従い、明示が必要。
 * 参考: https://nordsecurity.com/trademark-policy
 */
export const NORD_TRADEMARK_ATTRIBUTION =
  "「NordVPN」および関連ロゴ・名称は、Nord Security（Nordsec Ltd. および関連会社）の商標または登録商標です。本サイトは NordVPN のアフィリエイトパートナーですが、Nord Security が本サイトを公式に支持・推薦するものではありません。";
