import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "イベントカレンダー（タイGL）",
  description:
    "タイGL関連のファンミーティング、コンサート、プレミア、リリースイベント情報をペア・事務所別に絞り込み可能なカレンダー。FreenBecky、LingOrm、MilkLove などの推し活情報を日本語で。",
  alternates: { canonical: "https://yurithai.jp/events" },
  openGraph: {
    title: "イベントカレンダー（タイGL） | YuriThai",
    description: "タイGLのファンミ・コンサート・プレミア情報を一覧で。",
    url: "https://yurithai.jp/events",
    type: "website",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
