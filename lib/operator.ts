/**
 * 運営法人の情報を一元管理。
 * - 特商法表記 / About / プライバシーポリシー / 利用規約 / 広告ポリシー 等から参照
 * - メールアドレスは Vercel 環境変数 NEXT_PUBLIC_OPERATOR_EMAIL があればそちらを優先
 *   （連絡先メールの差し替えがコード変更なしでできる）
 */

const FALLBACK_EMAIL = "hana.thaigl@gmail.com";

const RAW_EMAIL =
  process.env.NEXT_PUBLIC_OPERATOR_EMAIL || FALLBACK_EMAIL;

export const OPERATOR = {
  /** 法人名（商号） */
  companyName: "合同会社FUMOMERU",
  /** 英文表記（任意） */
  companyNameEn: "FUMOMERU LLC",
  /** 代表者氏名 */
  representativeName: "花久深夢",
  /** 代表者役職 */
  representativeTitle: "代表社員",
  /** 登記住所（郵便番号は3桁-4桁形式で） */
  postalCode: "150-0043",
  address: "東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F-C",
  /**
   * 連絡先メール（内部用：半角@）。
   * バックエンド処理用に保持しているが、画面表示には絶対に使わない。
   * 画面に出すときは contactEmailDisplay を使う。
   */
  contactEmail: RAW_EMAIL,
  /**
   * 表示用メールアドレス（@を全角に変換）。
   * AIスクレイピングやボットの一括収集を抑止する目的。
   * mailto: リンクの href には使わない（リンクが壊れる）。
   */
  contactEmailDisplay: RAW_EMAIL.replace("@", "＠"),
  /** 連絡フォームのパス */
  contactPath: "/contact",
  /** サイト名 */
  siteName: "YuriThai",
  siteNameJa: "ユリタイ",
  /** サイトURL */
  siteUrl: "https://yurithai.jp",
  /** 設立年（任意） */
  established: 2026,
} as const;

/** 住所をひと続きにした文字列（特商法・JSON-LD 用） */
export function formatOperatorAddress(): string {
  return `〒${OPERATOR.postalCode} ${OPERATOR.address}`;
}
