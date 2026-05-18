// 女優OG画像 - https://yurithai.jp/api/og/actress/[id]
import { ImageResponse } from "next/og";
import { getActressById, allActressIds } from "@/lib/content";

export const runtime = "edge";

export async function generateStaticParams() {
  return allActressIds().map((id) => ({ id }));
}

const COLORS = {
  navy: "#3D3470",
  rose: "#C4708C",
  pink: "#F5C5D5",
  cream: "#FAEEDA",
  muted: "#8B8B9E",
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const actress = getActressById(params.id);
  if (!actress) {
    return new Response("Not found", { status: 404 });
  }

  const fontData = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/notosansjp/v52/-F62fjtqLzI2JPCgQBnw7HFowwk.ttf"
    )
  )
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .catch(() => null);

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
          fontFamily: '"Noto Sans JP"',
        }}
      >
        {/* 左上ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 38,
            fontWeight: 600,
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
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: COLORS.rose,
              color: COLORS.cream,
              fontSize: 18,
              fontWeight: 500,
              alignSelf: "flex-start",
              marginBottom: 24,
            }}
          >
            タイGL女優
          </div>

          {/* 名前（日本語） */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: COLORS.navy,
              lineHeight: 1.0,
              marginBottom: 20,
              display: "flex",
            }}
          >
            {actress.name_ja}
          </div>

          {/* 本名 */}
          <div
            style={{
              fontSize: 36,
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
                fontSize: 26,
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
          <span style={{ color: COLORS.muted, fontSize: 18 }}>yurithai.jp</span>
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
              weight: 500,
              style: "normal",
            },
          ]
        : [],
    }
  );
}
