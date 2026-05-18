// Edge Runtime で動的にOG画像を生成
// https://yurithai.jp/api/og/drama/[slug]
import { ImageResponse } from "next/og";
import { getAnyDramaBySlug, extractPairName } from "@/lib/content";

export const runtime = "edge";

// ブランドカラー
const COLORS = {
  navy: "#3D3470",
  rose: "#C4708C",
  cream: "#FAEEDA",
  muted: "#8B8B9E",
};

// 日本語フォント取得（jsDelivr 経由、Edge Runtime で安定）
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
  { params }: { params: { slug: string } }
) {
  try {
    const drama = getAnyDramaBySlug(params.slug);
    if (!drama) {
      return new Response("Not found", { status: 404 });
    }

    const titleTh = "title_th" in drama ? drama.title_th : null;
    const pairName = extractPairName(drama.cast_pair);
    const statusLabel =
      drama.status === "airing"
        ? "放送中"
        : drama.status === "upcoming"
        ? "公開予定"
        : "完結";

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
              letterSpacing: "-0.02em",
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
              paddingTop: 30,
            }}
          >
            {/* ステータスバッジ */}
            <div
              style={{
                display: "flex",
                padding: "6px 16px",
                borderRadius: 999,
                backgroundColor: COLORS.navy,
                color: COLORS.cream,
                fontSize: 18,
                fontWeight: 700,
                alignSelf: "flex-start",
                marginBottom: 24,
              }}
            >
              {statusLabel}
            </div>

            {/* タイトル */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: COLORS.navy,
                lineHeight: 1.1,
                marginBottom: 16,
                display: "flex",
              }}
            >
              {drama.title_ja}
            </div>

            {/* タイ語タイトル */}
            {titleTh && (
              <div
                style={{
                  fontSize: 30,
                  color: COLORS.muted,
                  marginBottom: 28,
                  display: "flex",
                }}
              >
                {titleTh}
              </div>
            )}

            {/* ペア */}
            {pairName && (
              <div
                style={{
                  fontSize: 34,
                  color: COLORS.rose,
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                ✦ {pairName}
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
              {drama.production && (
                <span>{drama.production.split(" × ")[0]}</span>
              )}
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
