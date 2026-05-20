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
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-728x90.png",
      width: 728,
      height: 90,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_1500x300: {
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-1500x300.png",
      width: 1500,
      height: 300,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_1200x628: {
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-1200x628.png",
      width: 1200,
      height: 628,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_1200x1200: {
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-1200x1200.png",
      width: 1200,
      height: 1200,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_160x600: {
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-160x600.png",
      width: 160,
      height: 600,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    borderless_300x600: {
      src: "/affiliate/nordvpn/generic-banners-explore-the-internet-v2-ja-300x600.png",
      width: 300,
      height: 600,
      alt: "国境のないインターネットを探検しよう — NordVPN®公式",
    },
    // ---- 青背景「サイバー脅威…」シリーズ ----
    cybersec_728x90: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-728x90.png",
      width: 728,
      height: 90,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1500x300: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-1500x300.png",
      width: 1500,
      height: 300,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1200x628: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-1200x628.png",
      width: 1200,
      height: 628,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_1200x1200: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-1200x1200.png",
      width: 1200,
      height: 1200,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_160x600: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-160x600.png",
      width: 160,
      height: 600,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
    cybersec_300x600: {
      src: "/affiliate/nordvpn/generic-banners-protect-digital-life-v1-ja-300x600.png",
      width: 300,
      height: 600,
      alt: "サイバー脅威からデジタルライフを守る — NordVPN®公式",
    },
  },
} as const;

export type NordVpnBannerKey = keyof typeof NORDVPN.banners;

// ====== Trip.com ======
// 東京→バンコク パッケージ向けの計測URL
// Allianceid=8247863 / SID=312714424 が紐づく
const TRIPCOM_DEFAULT_URL =
  "https://jp.trip.com/packages/list/tokyo-to-bangkok/tyo-to-bkk?dCity=tyo&aCity=bkk&Allianceid=8247863&SID=312714424&trip_sub1=&trip_sub3=D17134231";

export const TRIPCOM = {
  /** 計測付きアフィリエイトURL（東京→バンコク パッケージ）。 */
  url: process.env.NEXT_PUBLIC_TRIPCOM_AFF_URL || TRIPCOM_DEFAULT_URL,

  /** カード見出し */
  cardTitle: "東京〜バンコク 航空券＋ホテル",
  cardSubtitle:
    "推しのファンミ・聖地巡礼でバンコクへ行くなら。Trip.com で航空券＋ホテルをまとめて検索・予約。",
  cta: "Trip.com で検索",
} as const;

// Trip.com トップページ向けの計測URL（汎用 — 任意のルート/ホテル/都市を検索したい読者向け）
const TRIPCOM_TOP_DEFAULT_URL =
  "https://jp.trip.com/?Allianceid=8247863&SID=312714424&trip_sub1=&trip_sub3=D17191323";

export const TRIPCOM_TOP = {
  /** 計測付きアフィリエイトURL（Trip.com トップ）。 */
  url: process.env.NEXT_PUBLIC_TRIPCOM_TOP_AFF_URL || TRIPCOM_TOP_DEFAULT_URL,

  /** カード見出し */
  cardTitle: "他のルート・都市・日程も検索",
  cardSubtitle:
    "東京以外の出発地、バンコク以外の都市（チェンマイ・プーケット等）、別の日程も Trip.com で横断検索。",
  cta: "Trip.com トップへ",
} as const;

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
