/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Vercel自動生成ドメイン（yurithai-app.vercel.app）への全アクセスを
  // 正規ドメイン（yurithai.jp）に 308 (Permanent) リダイレクトする。
  //
  // 目的:
  //   - SEO の重複コンテンツ対策（Googleが両方をインデックスするのを防ぐ）
  //   - ブランド統一（yurithai.jp に集約）
  //   - canonical URL と一致させる
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "yurithai-app.vercel.app" }],
        destination: "https://yurithai.jp/:path*",
        permanent: true,
      },

      // ---- 旧URL → 新URL の 301 リダイレクト ----
      // slug変更で生じた404（Search Console）の解消用。
      // 新たなリネームが出たら、ここに { source, destination, permanent:true } を追記する。
      {
        source: "/dramas/rental-love",
        destination: "/dramas/rental-love-lab",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
