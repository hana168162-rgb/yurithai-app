import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // CampaignBanner の bg は content/banners.json に外出ししているので
    // Tailwind のスキャン対象外。動的グラデーション用に safelist しておく。
    "from-yuri-rose",
    "to-yuri-pink",
    "from-yuri-navy",
    "to-yuri-lilac",
    "from-yuri-pink",
    "to-yuri-lilac",
    "from-yuri-gold",
    "from-yuri-teal",
    "to-yuri-cream",
    "text-yuri-cream",
    "text-yuri-ink",
  ],
  theme: {
    extend: {
      colors: {
        yuri: {
          navy: "#3D3470",
          rose: "#C4708C",
          pink: "#F5C5D5",
          lilac: "#C9B8DD",
          teal: "#A5C5D4",
          gold: "#D4B589",
          cream: "#FAF6EE",
          ink: "#2A2548",
          muted: "#574F73",
          edge: "#E8E2D8",
          surface: "#FFFFFF",
        },
        rating: {
          all: "#7BA88E",
          teen: "#D4A574",
          mature: "#C97C5F",
          adult: "#B85450",
        },
      },
      fontFamily: {
        // UI / カード / メタ情報のデフォルトゴシック
        sans: [
          "var(--font-plus-jakarta)",
          "var(--font-noto-sans-jp)",
          "system-ui",
          "sans-serif",
        ],
        // ブログ本文用の明朝体（長文の可読性向上）
        serif: [
          "var(--font-noto-serif-jp)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        // 見出し / 装飾用の丸ゴ
        display: [
          "var(--font-zen-maru-gothic)",
          "var(--font-plus-jakarta)",
          "var(--font-noto-sans-jp)",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
