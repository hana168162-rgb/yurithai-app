// scripts/fix-bold-quote.mjs
// markdown 内の壊れた太字パターンを修正:
//   **「xxxx**」    →    「**xxxx**」
// （閉じ ** が 」の中に入ってしまっているケース）

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, "../content/blog");

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
let totalFixed = 0;

for (const file of files) {
  const full = path.join(blogDir, file);
  const src = fs.readFileSync(full, "utf8");

  // パターン: **「（中身）**」  →  「**（中身）**」
  //   ・「 と 」の間に **xxx** を入れる正しい形に
  //   ・閉じ ** が」 の手前にくる
  // 非貪欲マッチ。改行とコード越境は避ける。
  const regex = /\*\*「([^」\n]+?)\*\*」/g;
  const next = src.replace(regex, "「**$1**」");

  if (next !== src) {
    const count = (src.match(regex) || []).length;
    fs.writeFileSync(full, next, "utf8");
    console.log(`[fixed] ${file}: ${count}件`);
    totalFixed += count;
  }
}

console.log(`\n合計 ${totalFixed} 件を修正しました。`);
