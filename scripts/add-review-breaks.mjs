// scripts/add-review-breaks.mjs
// review.body_ja に段落改行を入れる。
// 既存テキストを「導入 / 見どころ / 推奨対象」の3段落に再構成する。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dramasPath = path.resolve(__dirname, "../content/dramas.json");

// slug → 段落分割位置（文番号、1始まり）。3段落構成。
// 各値は「1段落目の文数, 2段落目の文数」を表す（残りは3段落目）。
const splits = {
  "gap":               [2, 2],
  "the-loyal-pin":     [2, 2],
  "only-you":          [2, 2],
  "the-secret-of-us":  [2, 2],
  "23-5":              [2, 2],
  "pluto":             [2, 2],
  "us":                [2, 2],
  "roller-coaster":    [2, 2],
  "poisonous-love":    [2, 2],
  "the-earth":         [2, 2],
  "love-design":       [2, 2],
  "affair":            [2, 2],
  "harmony-secret":    [2, 2],
  "mate":              [2, 2],
  "the-water":         [2, 2],
  "dangerous-queen":   [2, 1],
  "i-wanna-be-suptar": [2, 2],
  "blank":             [2, 2],
  "my-safe-zone":      [2, 2],
  "reverse-with-me":   [2, 2],
  "play-park":         [2, 1],
  "broken-of-love":    [2, 2],
  "whale-store-xoxo":  [2, 2],
};

function splitSentences(text) {
  // 「。」で分割しつつ「。」を残す
  const parts = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (ch === "。") {
      parts.push(buf);
      buf = "";
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts.map((s) => s.trim()).filter(Boolean);
}

function regroup(text, [n1, n2]) {
  const sents = splitSentences(text);
  const p1 = sents.slice(0, n1).join("");
  const p2 = sents.slice(n1, n1 + n2).join("");
  const p3 = sents.slice(n1 + n2).join("");
  return [p1, p2, p3].filter(Boolean).join("\n\n");
}

const dramas = JSON.parse(fs.readFileSync(dramasPath, "utf8"));
let changed = 0;
for (const d of dramas) {
  if (!d.review || !d.review.body_ja) continue;
  const conf = splits[d.slug];
  if (!conf) {
    console.warn("[skip] no split config for:", d.slug);
    continue;
  }
  // 既に改行が入っているものはスキップ
  if (d.review.body_ja.includes("\n")) {
    console.log("[skip] already has line breaks:", d.slug);
    continue;
  }
  const next = regroup(d.review.body_ja, conf);
  if (next !== d.review.body_ja) {
    d.review.body_ja = next;
    changed++;
    console.log("[ok]", d.slug);
  }
}

fs.writeFileSync(dramasPath, JSON.stringify(dramas, null, 2) + "\n", "utf8");
console.log(`\n${changed} dramas updated.`);
