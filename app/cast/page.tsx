import { dramas, watching, getActressesForPair } from "@/lib/content";
import { ActressProfile } from "@/components/ActressProfile";

export const metadata = { title: "ペア一覧 | YuriThai" };

interface PairEntry {
  short: string;
  full: string;
  dramas: string[];
}

function getPairs(): PairEntry[] {
  const map = new Map<string, PairEntry>();

  const addDrama = (castPair: string | null, title: string) => {
    if (!castPair) return;
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
  const pairs = getPairs();
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          ペア一覧
        </h1>
        <p className="text-sm text-yuri-muted">全{pairs.length}ペア</p>
      </header>

      <div className="space-y-6">
        {pairs.map((p) => {
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
