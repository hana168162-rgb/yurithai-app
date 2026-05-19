// scripts/fix-tags.mjs
// タグ表記揺れ・明らかなミスを修正

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dramasPath = path.resolve(__dirname, "../content/dramas.json");
const dramas = JSON.parse(fs.readFileSync(dramasPath, "utf8"));

let fixCount = 0;

for (const d of dramas) {
  if (!d.tags) continue;

  // 1. I Wanna Be Sup'tar: ? を削除
  if (d.slug === "i-wanna-be-suptar") {
    const idx = d.tags.genre?.indexOf("業界もの（芸能）?") ?? -1;
    if (idx !== -1) {
      d.tags.genre[idx] = "業界もの（芸能）";
      console.log("[" + d.slug + "] 業界もの（芸能）? → 業界もの（芸能）");
      fixCount++;
    }
  }

  // 2-4. Roller Coaster / Affair / Broken of Love: 単独 業界もの を削除
  if (["roller-coaster", "affair", "broken-of-love"].includes(d.slug)) {
    const before = d.tags.genre?.length ?? 0;
    d.tags.genre = (d.tags.genre || []).filter((t) => t !== "業界もの");
    const after = d.tags.genre.length;
    if (before !== after) {
      console.log("[" + d.slug + "] genre: 業界もの 削除");
      fixCount++;
    }
  }

  // 5. Only You: 暴力描写（アクション） → 暴力描写
  if (d.slug === "only-you") {
    const idx = d.tags.warnings?.indexOf("暴力描写（アクション）") ?? -1;
    if (idx !== -1) {
      d.tags.warnings[idx] = "暴力描写";
      console.log("[" + d.slug + "] 暴力描写（アクション） → 暴力描写");
      fixCount++;
    }
  }
}

fs.writeFileSync(dramasPath, JSON.stringify(dramas, null, 2) + "\n", "utf8");
console.log("\n" + fixCount + " 件の修正を反映しました。");
