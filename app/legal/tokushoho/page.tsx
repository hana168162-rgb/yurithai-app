export const metadata = { title: "特定商取引法に基づく表記 | YuriThai" };

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-display font-medium text-yuri-ink mb-6">
        特定商取引法に基づく表記
      </h1>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-yuri-edge">
          <tr>
            <td className="py-3 pr-4 text-yuri-muted w-32">販売事業者</td>
            <td className="py-3">YuriThai 運営</td>
          </tr>
          <tr>
            <td className="py-3 pr-4 text-yuri-muted">運営責任者</td>
            <td className="py-3">（個人情報のため、お問い合わせ時に開示）</td>
          </tr>
          <tr>
            <td className="py-3 pr-4 text-yuri-muted">所在地</td>
            <td className="py-3">（お問い合わせ時に開示）</td>
          </tr>
          <tr>
            <td className="py-3 pr-4 text-yuri-muted">連絡先</td>
            <td className="py-3">お問い合わせフォームより</td>
          </tr>
          <tr>
            <td className="py-3 pr-4 text-yuri-muted">商品・サービス</td>
            <td className="py-3">
              現時点で物品・サービスの販売は行っていません。<br />
              アフィリエイト・寄付等を導入する際に本ページを更新します。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
