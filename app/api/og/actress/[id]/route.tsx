// 女優OG画像 - https://yurithai.jp/api/og/actress/[id]
import { ImageResponse } from "next/og";
import { getActressById } from "@/lib/content";

export const runtime = "edge";

const COLORS = {
  navy: "#3D3470",
  rose: "#C4708C",
  cream: "#FAEEDA",
  muted: "#8B8B9E",
};

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf"
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const actress = getActressById(params.id);
    if (!actress) {
      return new Response("Not found", { status: 404 });
    }

    const fontData = await loadFont();

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: COLORS.cream,
            padding: "60px 70px",
          }}
        >
          {/* 左上ロゴ */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            <span style={{ color: COLORS.navy }}>Yuri</span>
            <span style={{ color: COLORS.rose }}>Thai</span>
          </div>

          {/* メイン */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {/* バッジ */}
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: COLORS.rose,
                color: COLORS.cream,
                fontSize: 18,
                fontWeight: 700,
                alignSelf: "flex-start",
                marginBottom: 24,
              }}
            >
              タイGL女優
            </div>

            {/* カタカナ表記（小） */}
            <div
              style={{
                fontSize: 28,
                color: COLORS.muted,
                lineHeight: 1.0,
                marginBottom: 8,
                display: "flex",
              }}
            >
              {actress.name_ja}
            </div>

            {/* 名前（英字ニックネーム） */}
            <div
              style={{
                fontSize: 92,
                fontWeight: 700,
                color: COLORS.navy,
                lineHeight: 1.0,
                marginBottom: 20,
                display: "flex",
              }}
            >
              {actress.name_en}
            </div>

            {/* 本名 */}
            <div
              style={{
                fontSize: 34,
                color: COLORS.muted,
                marginBottom: 32,
                display: "flex",
              }}
            >
              {actress.real_name}
            </div>

            {/* 出演作品 */}
            {actress.filmography && actress.filmography.length > 0 && (
              <div
                style={{
                  fontSize: 24,
                  color: COLORS.navy,
                  display: "flex",
                }}
              >
                出演: {actress.filmography.slice(0, 3).join(" / ")}
                {actress.filmography.length > 3 ? " 他" : ""}
              </div>
            )}
          </div>

          {/* フッター */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `2px solid ${COLORS.navy}`,
              paddingTop: 20,
              color: COLORS.navy,
              fontSize: 22,
            }}
          >
            <div style={{ display: "flex" }}>
              {actress.agency && <span>{actress.agency.split("（")[0]}</span>}
            </div>
            <span style={{ color: COLORS.muted, fontSize: 18 }}>
              yurithai.jp
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData
          ? [
              {
                name: "Noto Sans JP",
                data: fontData,
                weight: 700,
                style: "normal",
              },
            ]
          : undefined,
      }
    );
  } catch (e) {
    return new Response(`OG error: ${(e as Error).message}`, { status: 500 });
  }
}
