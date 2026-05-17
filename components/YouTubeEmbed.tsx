// Extract YouTube video ID from various URL formats
export function getYouTubeId(input: string | null): string | null {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  // Try parsing as URL
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      // shorts
      const m = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
      // embed
      const e = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (e) return e[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTubeEmbed({ src }: { src: string | null }) {
  const id = getYouTubeId(src);
  if (!id) return null;
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-yuri-edge"
      style={{ aspectRatio: "16/9" }}
    >
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube ティザー"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
