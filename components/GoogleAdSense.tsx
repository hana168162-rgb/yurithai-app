/**
 * Google AdSense のサイト所有権確認用 / 広告配信用 script タグ。
 *
 * 実装ノート:
 *   - AdSense のクローラは <head> 内の生 <script> タグを期待する。
 *   - Next.js の <Script> コンポーネントだと <head> に preload link は入るが
 *     本体の script タグが body に置かれることがあり、AdSenseの確認が落ちる。
 *   - 解決: 生の <script> 要素を直接 <head> に出す。SSRで初回HTMLに焼き込まれる。
 *
 * 使い方:
 *   1. Vercel の Environment Variables に
 *      `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXXXXXXXX` を登録
 *   2. layout.tsx の <head> 内に <GoogleAdSense /> を配置
 *   3. 環境変数が未設定なら何もレンダリングしない
 */
export function GoogleAdSense() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}
