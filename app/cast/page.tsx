import {
  dramas,
  watching,
  getActressesForPair,
  pairs,
  shortPairLabel,
} from "@/lib/content";
import { CastFilterBar, type CastPairEntry } from "@/components/CastFilterBar";

export const metadata = {
  title: "タイGL女優・ペア一覧｜FreenBecky・LingOrm・NamtanFilm 他",
  description:
    "FreenBecky、LingOrm、MilkLove、NamtanFilm、EngLot、KaoJane、LMSY、EmiBonnie、ViewMim、ShellyPundao、TKNur など、タイGL（タイ百合）ドラマの主要ペアと出演女優を網羅。各女優のプロフィール・出演タイGL作品を日本語で紹介。",
  keywords: [
    "タイGL",
    "タイGL 女優",
    "タイGL ペア",
    "タイGL シップネーム",
    "FreenBecky",
    "LingOrm",
    "MilkLove",
    "NamtanFilm",
    "LMSY",
    "EmiBonnie",
    "ViewMim",
    "ShellyPundao",
    "TKNur",
    "YuriThai",
    "ユリタイ",
  ],
  alternates: { canonical: "https://yurithai.jp/cast" },
  openGraph: {
    title: "タイGL女優・ペア一覧｜YuriThai",
    url: "https://yurithai.jp/cast",
    type: "website",
    siteName: "YuriThai（ユリタイ）",
  },
};

interface PairEntry {
  short: string;
  full: string;
  dramas: string[];
}

function getPairs(): PairEntry[] {
  const map = new Map<string, PairEntry>();
  const knownPairs = Object.keys(pairs); // pairs.json から既知ペア名

  const addDrama = (castPair: string | null, title: string) => {
    if (!castPair) return;

    // cast_pair に含まれる既知ペア名をすべて抽出（複数主演に対応）
    const foundPairs = knownPairs.filter((p) => castPair.includes(p));

    if (foundPairs.length > 0) {
      for (const key of foundPairs) {
        if (!map.has(key)) {
          map.set(key, { short: key, full: castPair, dramas: [] });
        }
        map.get(key)!.dramas.push(title);
      }
      return;
    }

    // fallback: 既知ペアが見つからない場合の短縮ロジック。
    //   1) 括弧内のシップネーム → 採用
    //   2) "X × Y" の形式なら、それぞれの先頭ワード（ニックネーム想定）を取り出して
    //      "Christine × Mae" のような形にする（dropdown に長いフルネームが入らない）
    //   3) shortPairLabel のフォールバックチェーン（先頭40字）
    const parenMatch = castPair.match(/（([^）]+)）/);
    let key: string;
    if (parenMatch) {
      key = parenMatch[1];
    } else if (/×/.test(castPair)) {
      const parts = castPair
        .split("×")
        .map((p) => p.trim().split(/\s+/)[0])
        .filter(Boolean);
      key = parts.join(" × ");
    } else {
      key = shortPairLabel(castPair) || castPair;
    }
    if (!map.has(key)) {
      map.set(key, { short: key, full: castPair, dramas: [] });
    }
    map.get(key)!.dramas.push(title);
  };

  for (const d of dramas) addDrama(d.cast_pair, d.title_ja);
  for (const w of watching) addDrama(w.cast_pair, w.title_ja);

  // 表示順を pairs.json のキー順に揃える（未登録のフォールバックキーは末尾）。
  const order = knownPairs;
  const rank = (short: string) => {
    const i = order.indexOf(short);
    return i === -1 ? order.length : i;
  };
  return Array.from(map.values()).sort((a, b) => rank(a.short) - rank(b.short));
}

export default function CastPage() {
  const pairList: CastPairEntry[] = getPairs().map((p) => ({
    ...p,
    actresses: getActressesForPair(p.short),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 pt-4 pb-8 md:py-10">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          女優・ペア
        </h1>
        <p className="text-[14px] md:text-sm text-yuri-muted">
          タイGLドラマの主要ペアと出演女優。事務所・カップルで絞り込めます。
        </p>
      </header>

      <CastFilterBar pairs={pairList} />
    </div>
  );
}
