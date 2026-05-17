import type { DramaStatus } from "@/lib/types";

export function StatusBadge({
  status,
  episodes,
}: {
  status: DramaStatus;
  episodes?: number | null;
}) {
  if (status === "airing") {
    return (
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded text-yuri-cream"
        style={{ background: "rgba(196,112,140,0.92)" }}
      >
        放送中
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded text-yuri-cream"
        style={{ background: "rgba(61,52,112,0.88)" }}
      >
        {episodes ? `${episodes}話完結` : "完結"}
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded text-yuri-cream"
        style={{ background: "rgba(165,197,212,0.92)" }}
      >
        放送予定
      </span>
    );
  }
  return null;
}
