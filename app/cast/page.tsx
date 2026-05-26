import { dramas, watching, getActressesForPair, pairs } from "@/lib/content";
import { ActressProfile } from "@/components/ActressProfile";

export const metadata = {
  title: "女優一覧（タイGL主演ペア・女優）",
  description:
    "FreenBecky、LingOrm、MilkLove、NamtanFilm、EngLot、KaoJane、LMSY など、タイGLドラマの主要ペアと出演女優を網羅。プロフィール・出演作品を日本語で紹介。",
  alternates: { canonical: "https://yurithai.jp/cast" },
  openGraph: {
    title: "女優一覧（タイGL主演ペア・女優） | YuriThai",
    url: "https://yurithai.jp/cast",
    type: "website",
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

    // fallback: 既知ペアが見つからない場合は カッコ内 or cast_pair そのもの
    const match = castPair.match(/（([^）]+)）/);
    const key = match ? match[1] : castPair;
    if (!map.has(key)) {
      map.set(key, { short: key, full: castPair, dramas: [] });
    }
    map.get(key)!.dramas.push(title);
  };

  for (const d of dramas) addDrama(d.cast_pair, d.title_ja);
  for (const w of watching) addDrama(w.cast_pair, w.title_ja);

  return Array.from(map.values());
}

export default function CastPage() {
  const pairList = getPairs();
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          女優
        </h1>
        <p className="text-sm text-yuri-muted">全{pairList.length}ペア</p>
      </header>

      <div className="space-y-6">
        {pairList.map((p) => {
          const actressList = getActressesForPair(p.short);
          return (
            <section
              key={p.short}
              className="bg-yuri-cream border border-yuri-edge rounded-lg p-5"
            >
              <div className="mb-4">
                <h2 className="text-lg font-medium text-yuri-navy mb-1">
                  {p.short}
                </h2>
                <p className="text-xs text-yuri-muted mb-2">{p.full}</p>
                <p className="text-xs text-yuri-ink/80">
                  <span className="text-yuri-muted">出演: </span>
                  {p.dramas.join(" / ")}
                </p>
              </div>

              {actressList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actressList.map((a) => (
                    <ActressProfile key={a.id} actress={a} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-yuri-muted italic">
                  個別プロフィールは準備中
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
