import Link from "next/link";
import { OPERATOR } from "@/lib/operator";

export const metadata = {
  title: "広告掲載ポリシー | YuriThai",
  description:
    "YuriThai の広告・アフィリエイトに関する方針。掲載基準、編集方針、利益相反の取り扱いについて。",
  alternates: { canonical: `${OPERATOR.siteUrl}/legal/advertising` },
};

export default function AdvertisingPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-6 py-12 prose-yuri">
      <h1 className="text-2xl font-medium text-yuri-ink mb-2 !font-sans">
        広告掲載ポリシー
      </h1>
      <p className="text-xs text-yuri-muted mb-8">
        制定日: 2026年5月
      </p>

      <div className="text-sm text-yuri-ink/85 leading-[1.9] space-y-1">
        <p>
          <strong className="font-medium">YuriThai</strong>（以下「当サイト」）の運営者
          （以下「当社」、{" "}
          <Link href="/about" className="text-yuri-rose hover:opacity-80 underline">
            運営者情報
          </Link>
          に記載）は、当サイトにおける広告・アフィリエイトの掲載について、
          以下の方針を定めています。
        </p>

        <h2>1. アフィリエイト広告の掲載</h2>
        <p>
          当サイトには、第三者の運営する商品・サービスを紹介するアフィリエイトリンクが含まれます。
          利用者がアフィリエイトリンクから商品・サービスを利用された場合、
          当社は広告主または広告ネットワークから所定の紹介報酬を受け取ることがあります。
        </p>
        <p>
          こうした広告は、景品表示法に基づき、当サイト内で
          <strong className="font-medium">「広告」「PR」</strong>
          などのラベルを明示する形で掲載しています。
        </p>

        <h2>2. 現在掲載中の広告プログラム</h2>
        <ul>
          <li>
            <strong className="font-medium">NordVPN®</strong>（Nord Security / Nordsec Ltd. 提供）
            <br />
            <span className="text-xs text-yuri-muted">
              関連ページ: <Link href="/guide/vpn" className="text-yuri-rose hover:opacity-80 underline">VPNとタイGL ガイド</Link>
            </span>
          </li>
        </ul>
        <p className="text-xs text-yuri-muted">
          ※ 今後、掲載プログラムを追加・変更する場合は本ページを更新します。
        </p>

        <h2>3. 編集方針</h2>
        <p>
          当社は、アフィリエイト報酬の有無や金額によって、
          作品レビュー・タグ評価・掲載順位などの編集判断を歪めることはありません。
          記事の構成・評価軸・順位付けは、編集部の独立した判断に基づいて決定します。
        </p>
        <p>
          広告主から記事執筆の指示を受けた場合は、その旨を「PR」「広告」「タイアップ」等として明示し、
          通常の記事と区別して表示します。
        </p>

        <h2>4. 掲載基準</h2>
        <p>当サイトに広告を掲載するにあたり、当社は以下の基準で広告主・商品を選定します。</p>
        <ul>
          <li>当サイトの読者層（タイGLファン・海外コンテンツ視聴者層）と親和性があること</li>
          <li>当該事業者が日本国内で適法に事業を行っていること</li>
          <li>商品・サービスの説明に誇大表現や事実に反する内容がないこと</li>
          <li>当社の方針（差別・誹謗中傷・違法行為の助長を行わない）と矛盾しないこと</li>
        </ul>

        <h2>5. 掲載しない広告</h2>
        <p>以下に該当する広告は掲載しません。</p>
        <ul>
          <li>違法な商品・サービスに関するもの</li>
          <li>アダルト・賭博・反社会的勢力に関するもの</li>
          <li>差別・ヘイト・誹謗中傷を助長するもの</li>
          <li>科学的根拠を欠く健康・美容効果を謳うもの</li>
          <li>事実誤認を招くおそれが高いもの</li>
        </ul>

        <h2>6. 商品・サービスに関する責任</h2>
        <p>
          当サイトのアフィリエイトリンクから遷移した先の商品・サービスについて、
          販売条件・価格・契約・キャンセル・返金等は、すべて各広告主（リンク先の事業者）が定めるものに従います。
          当社は、当該商品・サービスの提供主体ではなく、契約当事者にも含まれません。
        </p>
        <p>
          ご利用にあたっては、必ずリンク先の公式ページに記載された利用規約・
          特定商取引法に基づく表記・プライバシーポリシー等をご確認ください。
        </p>

        <h2>7. お問い合わせ・タイアップのご相談</h2>
        <p>
          広告掲載・タイアップ・記事執筆のご相談は、
          {" "}
          <Link href="/contact?topic=sponsor" className="text-yuri-rose hover:opacity-80 underline">
            お問い合わせフォーム
          </Link>
          {" "}
          より「スポンサー・タイアップ」カテゴリでご連絡ください。
        </p>

        <h2>8. 改定</h2>
        <p>
          本ポリシーは、必要に応じて改定する場合があります。
          改定後の内容は当ページに掲載した時点で効力を生じます。
        </p>

        <h2>9. 運営者</h2>
        <p>
          運営者の名称・代表者・所在地・連絡先等は{" "}
          <Link href="/about" className="text-yuri-rose hover:opacity-80 underline">
            運営者情報
          </Link>
          に記載しています。
        </p>
      </div>

      <p className="text-xs text-yuri-muted mt-10">
        関連: <Link href="/about" className="hover:text-yuri-rose underline">運営者情報</Link>
        {" · "}
        <Link href="/legal/tokushoho" className="hover:text-yuri-rose underline">特定商取引法に基づく表記</Link>
        {" · "}
        <Link href="/privacy" className="hover:text-yuri-rose underline">プライバシーポリシー</Link>
        {" · "}
        <Link href="/terms" className="hover:text-yuri-rose underline">利用規約</Link>
      </p>
    </div>
  );
}
