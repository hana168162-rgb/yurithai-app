// scripts/set-blog-covers.mjs
// 各ブログ記事の frontmatter `cover_image` に対応作品の画像を設定する。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, "../content/blog");

// slug → 設定したい cover_image パス（既存の /public/images/dramas/*.jpg）
const COVERS = {
  // 既存記事
  "intro-to-thai-gl": "/images/dramas/gap.jpg",
  "freenbecky-history": "/images/dramas/gap.jpg",
  "lmsy-trilogy-guide": "/images/dramas/affair.jpg",
  "namtanfilm-popularity-secret": "/images/dramas/girl-rules.jpg",
  "emibonnie-feature": "/images/dramas/us.jpg",
  "tknur-rise-story": "/images/dramas/dangerous-queen.jpg",
  "2026-must-watch": "/images/dramas/the-air.jpg",
  "thai-gl-ranking-2026": "/images/dramas/gap.jpg",
  "gmmtv-gl-story": "/images/dramas/girl-rules.jpg",
  "ginjay-rise-story": "/images/dramas/poisonous-love.jpg",
  "idolfactory-gl-empire": "/images/dramas/the-air.jpg",
  "lingorm-history": "/images/dramas/only-you.jpg",
  "change2561-strategy": "/images/dramas/harmony-secret.jpg",
  "thai-gl-3rd-generation": "/images/dramas/us.jpg",
  "thai-gl-global-expansion": "/images/dramas/the-air.jpg",

  // 聖地巡礼系
  "thai-gl-pilgrimage-guide": "/images/dramas/gap.jpg",
  "pilgrimage-gap": "/images/dramas/gap.jpg",
  "pilgrimage-the-loyal-pin": "/images/dramas/the-loyal-pin.jpg",
  "pilgrimage-pluto": "/images/dramas/pluto.jpg",
  "pilgrimage-23-5": "/images/dramas/23-5.jpg",
  "pilgrimage-affair": "/images/dramas/affair.jpg",
  "pilgrimage-us": "/images/dramas/us.jpg",
  "pilgrimage-dangerous-queen": "/images/dramas/dangerous-queen.jpg",
  "pilgrimage-poisonous-love": "/images/dramas/poisonous-love.jpg",
};

let updated = 0;

for (const [slug, coverPath] of Object.entries(COVERS)) {
  const filePath = path.join(blogDir, slug + ".md");
  if (!fs.existsSync(filePath)) {
    console.warn("[skip] not found:", slug);
    continue;
  }

  const src = fs.readFileSync(filePath, "utf8");
  // cover_image: null → cover_image: "/path/to/image.jpg" に置換
  const next = src.replace(
    /^cover_image:\s*(null|"[^"]*"|'[^']*')\s*$/m,
    `cover_image: "${coverPath}"`,
  );

  if (next !== src) {
    fs.writeFileSync(filePath, next, "utf8");
    console.log("[ok]", slug, "→", coverPath);
    updated++;
  } else {
    console.warn("[skip] no cover_image line found in:", slug);
  }
}

console.log("\n" + updated + " ブログを更新しました。");
