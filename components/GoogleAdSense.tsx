import Script from "next/script";

/**
 * Google AdSense のサイト所有権確認用 / 広告配信用スクリプト。
 *
 * 使い方:
 *   1. Vercel の Environment Variables に
 *      `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXXXXXXXX` を登録
 *   2. デプロイすると <head> に AdSense スクリプトが挿入される
 *   3. 環境変数が未設定なら何もレンダリングしない（開発環境で誤計測しない）
 *
 * 注意:
 *   - 審査前の段階でこのスクリプトを置く必要がある（サイト所有権確認用）
 *   - 審査通過後は同じスクリプトが広告配信用としても機能する
 *   - 広告ユニットを設置する場合は別途 ins タグを配置
 */
export function GoogleAdSense() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
