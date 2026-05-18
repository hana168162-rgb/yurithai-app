export const metadata = {
  title: "Aboutページ・運営者情報",
  description:
    "YuriThai（ユリタイ）は、日本人ファンのためにタイGLドラマの情報を整理・紹介する非営利メディアです。運営者情報・サイトの方針について。",
  alternates: { canonical: "https://yurithai.jp/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-display font-medium text-yuri-ink mb-4">
        About / 運営者情報
      </h1>
      <div className="prose prose-sm text-yuri-ink/85 space-y-4">
        <p>
          YuriThai（ユリタイ）は、日本人ファンのために
          タイGLドラマの情報を整理・紹介するメディアです。
        </p>
        <p>
          作品ごとのレビュー、配信先、女優情報、タグ別の検索、
          そして「あなたに合うタイGL」を診断する機能を備えています。
        </p>
        <p className="text-xs text-yuri-muted">
          ※ 本サイトはタイGLドラマの情報を非営利・趣味として
          まとめたファンサイトです。画像・映像の著作権は各制作会社に帰属します。
        </p>
      </div>
    </div>
  );
}
