import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
          muted: "#6B6585",
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
        sans: [
          "Plus Jakarta Sans",
          "Noto Sans JP",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Quicksand",
          "M PLUS Rounded 1c",
          "Plus Jakarta Sans",
          "Noto Sans JP",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
