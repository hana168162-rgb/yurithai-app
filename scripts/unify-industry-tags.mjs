// scripts/unify-industry-tags.mjs
// 「業界もの（医療）」「業界もの（芸能）」等を、
// 「業界もの」+ 個別の業種タグ（医療/芸能/建築/企業/遊園地）に分解する。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dramasPath = path.resolve(__dirname, "../content/dramas.json");
const dramas = JSON.parse(fs.readFileSync(dramasPath, "utf8"));

// マッチパターン → 「業界もの」+ 業種タグ配列
function explode(tag) {
  // 「業界もの（医療・芸能）」 → ["業界もの", "医療", "芸能"]
  const m = tag.match(/^業界もの（(.+)）$/);
  if (!m) return null;
  const subs = m[1].split(/[・/]/).map((s) => s.trim()).filter(Boolean);
  return ["業界もの", ...subs];
}

let fixCount = 0;

for (const d of dramas) {
  if (!d.tags?.genre) continue;

  const out = new Set();
  for (const t of d.tags.genre) {
    const ex = explode(t);
    if (ex) {
      for (const x of ex) out.add(x);
      console.log("[" + d.slug + "] " + t + " → " + ex.join(" + "));
      fixCount++;
    } else {
      out.add(t);
    }
  }

  d.tags.genre = [...out];
}

fs.writeFileSync(dramasPath, JSON.stringify(dramas, null, 2) + "\n", "utf8");
console.log("\n" + fixCount + " 件のタグを分解しました。");
