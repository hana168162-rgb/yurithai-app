import pairsData from "@/content/pairs.json";
import type { CastGroup, CastInfo } from "@/lib/types";

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

/** グループの表示名（ペア名優先、無ければ各人の先頭語を × で連結） */
export function castGroupName(g: CastGroup): string {
  if (g.pair) return g.pair;
  return g.members.map((m) => m.trim().split(/\s+/)[0]).join(" × ");
}

/**
 * 一覧カード用の主演ラベル。
 * - cast_groups が無い作品は従来どおり cast_pair から短縮表記
 * - pair: メインペア名のみ（サブ・共演は一覧では出さない）
 * - multi_pair: 「OrmFolk ほか2ペア」
 * - ensemble: 「5人主演」
 * 詳細ページでは cast_groups を全員表示する。
 */
export function cardCastLabel(
  d: CastInfo & { cast_pair: string | null }
): string | null {
  const mains = (d.cast_groups ?? []).filter((g) => g.role === "main");
  if (!d.cast_type || mains.length === 0) {
    return d.cast_pair ? shortPairName(d.cast_pair) : null;
  }
  if (d.cast_type === "ensemble") {
    const n = mains.reduce((sum, g) => sum + g.members.length, 0);
    return `${n}人主演`;
  }
  if (d.cast_type === "multi_pair" && mains.length > 1) {
    return `${castGroupName(mains[0])} ほか${mains.length - 1}ペア`;
  }
  return castGroupName(mains[0]);
}
