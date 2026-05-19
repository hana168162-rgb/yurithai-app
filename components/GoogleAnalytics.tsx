import Script from "next/script";

/**
 * Google Analytics 4 (GA4) のページ計測タグ。
 *
 * 使い方:
 *   1. GA4 で「データストリーム」を作成し、Measurement ID（G-XXXXXXXXXX）を取得する。
 *   2. Vercel の Environment Variables に
 *      `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` を登録する。
 *   3. デプロイすると有効化される。環境変数が未設定なら何もレンダリングしない。
 *
 * 計測内容:
 *   - PV / セッション / 流入元はGA4の自動計測に任せる。
 *   - App Router のクライアントナビゲーションも config_default が拾うのでルート変更ごと
 *     に追加のフックは不要。
 *
 * プライバシー:
 *   - IPは GA4 標準で匿名化される。
 *   - 個人情報を計測タグに渡さないこと。サイトのプライバシーポリシーで利用を明記する。
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
