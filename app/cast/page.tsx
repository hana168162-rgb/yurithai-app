import { dramas } from "@/lib/content";

export const metadata = { title: "女優一覧 | YuriThai" };

// Extract pairs from drama data (pair name in cast_pair field)
function getPairs() {
  const map = new Map<string, { name: string; dramas: string[] }>();
  for (const d of dramas) {
    if (!d.cast_pair) continue;
    // Pair display name from parentheses if present (e.g., FreenBecky)
    const match = d.cast_pair.match(/（([^）]+)）/);
    const key = match ? match[1] : d.cast_pair;
    if (!map.has(key)) {
      map.set(key, { name: d.cast_pair, dramas: [] });
    }
    map.get(key)!.dramas.push(d.title_ja);
  }
  return Array.from(map.entries()).map(([key, val]) => ({
    short: key,
    full: val.name,
    dramas: val.dramas,
  }));
}

export default function CastPage() {
  const pairs = getPairs();
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium text-yuri-ink mb-1">
          女優一覧
        </h1>
        <p className="text-sm text-yuri-muted">
          全{pairs.length}ペア · タイGLドラマの主演女優
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pairs.map((p) => (
          <div
            key={p.short}
            className="bg-yuri-surface border border-yuri-edge rounded-lg p-4"
          >
            <p className="font-medium text-yuri-navy mb-1">{p.short}</p>
            <p className="text-xs text-yuri-muted mb-2 truncate">{p.full}</p>
            <p className="text-xs text-yuri-ink/70">
              <span className="text-yuri-muted">出演: </span>
              {p.dramas.join(" / ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
