/**
 * 運営法人の情報を一元管理。
 * - 特商法表記 / About / プライバシーポリシー / 利用規約 / 広告ポリシー 等から参照
 * - メールアドレスは Vercel 環境変数 NEXT_PUBLIC_OPERATOR_EMAIL があればそちらを優先
 *   （連絡先メールの差し替えがコード変更なしでできる）
 */

const FALLBACK_EMAIL = "hana.thaigl@gmail.com";

const RAW_EMAIL =
  process.env.NEXT_PUBLIC_OPERATOR_EMAIL || FALLBACK_EMAIL;

/**
 * 個人情報保護方針:
 *   代表者氏名と所在地の値は、サイト本体（公開ページ・JSバンドル）には含めない方針。
 *   公開ページ（/legal/tokushoho・/about）では「請求があり次第、遅滞なく開示いたします」と表示し、
 *   開示が必要になった際は contactEmail 経由で個別に対応する。
 *   法人登記情報は国税庁の法人番号公表サイトで誰でも参照可能なため、サイト側で隠すのは
 *   AI/ボット等による一括収集の抑止が目的。
 */
export const OPERATOR = {
  /** 法人名（商号） */
  companyName: "合同会社FUMOMERU",
  /** 英文表記（任意） */
  companyNameEn: "FUMOMERU LLC",
  /** 代表者役職（氏名はサイトに非掲載、請求対応で開示） */
  representativeTitle: "代表社員",
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
