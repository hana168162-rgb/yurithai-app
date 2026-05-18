// Edge Runtime で動的にOG画像を生成
// https://yurithai.jp/api/og/drama/[slug]
import { ImageResponse } from "next/og";
import { getAnyDramaBySlug, extractPairName, allDramaSlugs } from "@/lib/content";

export const runtime = "edge";

// 静的生成: 全 slug を事前ビルド可能（Next.js 14）
export async function generateStaticParams() {
  return allDramaSlugs().map((slug) => ({ slug }));
}

// ブランドカラー
const COLORS = {
  navy: "#3D3470",
  rose: "#C4708C",
  pink: "#F5C5D5",
  cream: "#FAEEDA",
  white: "#FFFFFF",
  muted: "#8B8B9E",
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
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

  // 日本語フォント（Google Fonts経由）
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
          position: "relative",
        }}
      >
        {/* 左上ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 38,
            fontWeight: 600,
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
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: COLORS.navy,
              color: COLORS.cream,
              fontSize: 18,
              fontWeight: 500,
              alignSelf: "flex-start",
              marginBottom: 24,
            }}
          >
            {statusLabel}
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: 84,
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
                fontSize: 32,
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
                fontSize: 36,
                color: COLORS.rose,
                fontWeight: 600,
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
          <div style={{ display: "flex", gap: 16 }}>
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
              weight: 500,
              style: "normal",
            },
          ]
        : [],
    }
  );
}
