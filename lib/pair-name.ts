import pairsData from "@/content/pairs.json";

const KNOWN_PAIRS = Object.keys(pairsData as Record<string, string[]>);

/**
 * cast_pair 文字列からペアの短縮表記を取り出す。
 *   0) "PairA × PairB × PairC"（群像劇）のように、× で区切られた各ピースが
 *      pairs.json の既知ペア名そのものだった場合、そのまま並べて返す
 *   1) "（PairName）" があればその中身（FreenBecky等）
 *   2) pairs.json に登録された既知ペア名が文字列内に含まれていればそれ
 *   3) どちらも無ければ各人の先頭語で「Nick × Nick」風に短縮
 *   4) それも無理なら原文を返す（最終フォールバック）
 *
 * カードの限られた幅でフルネームが折り返さないよう、表示用に使う。
 */
export function shortPairName(castPair: string): string {
  // 0) 群像劇ケース：× で区切られた全ピースが既知ペア名ならそのまま並べる
  //    （例: "NamtanFilm × MilkLove × ViewMim"）
  const ensembleParts = castPair.split("×").map((s) => s.trim());
  if (
    ensembleParts.length >= 2 &&
    ensembleParts.every((p) => KNOWN_PAIRS.includes(p))
  ) {
    return ensembleParts.join(" × ");
  }

  // 1) 全角カッコのペア名
  const m = castPair.match(/（([^）]+)）/);
  if (m) return m[1];

  // 2) pairs.json の既知ペア名（長いキーから先に判定して誤マッチ回避）
  for (const p of [...KNOWN_PAIRS].sort((a, b) => b.length - a.length)) {
    if (castPair.includes(p)) return p;
  }

  // 3) フルネーム列挙のみの場合 → 先頭語だけ拾って短縮（例: "Christine × Mae"）
  const parts = castPair
    .split("×")
    .map((s) => s.trim().split(/\s+/)[0])
    .filter(Boolean);
  if (parts.length >= 2) return parts.join(" × ");

  // 4) 最終フォールバック
  return castPair;
}
