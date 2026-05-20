import Link from "next/link";
import type { Metadata } from "next";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/JsonLd";

const SITE_URL = "https://yurithai.jp";

export const metadata: Metadata = {
  title: "タイGLとは｜歴史・代表作・ペア文化・観方を徹底解説",
  description:
    "タイGL（タイ百合ドラマ）とは？2022年「GAP」以降に急成長したジャンルの歴史、代表的なスタジオ・ペア・作品、視聴方法までを日本語で詳細解説。これからタイGLを観たい方向けの完全ガイド。",
  keywords: [
    "タイGL",
    "タイ百合",
    "タイ百合ドラマ",
    "タイGL とは",
    "タイGL おすすめ",
    "タイGL 一覧",
    "GAP",
    "FreenBecky",
    "GMMTV",
    "Idol Factory",
  ],
  alternates: { canonical: `${SITE_URL}/guide/what-is-thai-gl` },
  openGraph: {
    title: "タイGLとは｜歴史・代表作・ペア文化・観方を徹底解説",
    description:
      "タイGL（タイ百合ドラマ）の全てを日本語で。歴史、ペア文化、代表作、視聴方法まで網羅。",
    url: `${SITE_URL}/guide/what-is-thai-gl`,
    siteName: "YuriThai",
    locale: "ja_JP",
    type: "article",
  },
};

export default function WhatIsThaiGlPage() {
  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "トップ", url: `${SITE_URL}/` },
    { name: "ガイド", url: `${SITE_URL}/guide/what-is-thai-gl` },
    { name: "タイGLとは", url: `${SITE_URL}/guide/what-is-thai-gl` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-6 py-10">
      <JsonLd data={breadcrumbData} />

      <nav className="text-xs text-yuri-muted mb-4" aria-label="パンくず">
        <Link href="/" className="hover:text-yuri-rose">トップ</Link>
        <span className="mx-1.5">/</span>
        <span>ガイド</span>
        <span className="mx-1.5">/</span>
        <span>タイGLとは</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-medium text-yuri-ink mb-3 leading-tight">
        タイGLとは — 歴史・代表作・ペア文化を一望できる完全ガイド
      </h1>
      <p className="text-sm text-yuri-muted mb-8">
        最終更新: 2026年5月 · YuriThai 編集部
      </p>

      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        <strong className="font-medium">タイGL</strong>（タイ・ガールズラブ／タイ百合ドラマ）とは、
        タイで制作される<strong className="font-medium">女性同士のロマンスを描いたドラマ・映画</strong>の総称です。
        2022年の「<Link href="/dramas/gap" className="text-yuri-rose hover:opacity-80">GAP: The Series</Link>」以降、
        ジャンルとして急速に拡大し、いまや
        <strong className="font-medium">タイ国内のみならず日本・韓国・フィリピン・ベトナム・ブラジル等で熱狂的なファンダム</strong>
        を持つコンテンツに成長しています。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-6">
        本ページでは、<strong className="font-medium">タイGL初心者から既存ファンまで</strong>役立つよう、
        歴史・スタジオ・ペア文化・代表作・視聴方法・関連用語をまとめます。
        最後まで読めば、タイGLの全体像と、自分が次に観るべき1作が見えてくるはず。
      </p>

      <div className="bg-yuri-surface border border-yuri-edge rounded-md p-4 mb-8 text-sm">
        <p className="font-medium text-yuri-navy mb-2">目次</p>
        <ol className="list-decimal pl-5 space-y-1 text-yuri-ink/85">
          <li><a href="#definition" className="hover:text-yuri-rose underline">タイGLの定義</a></li>
          <li><a href="#history" className="hover:text-yuri-rose underline">歴史 — GAP以前と以後</a></li>
          <li><a href="#studios" className="hover:text-yuri-rose underline">主要スタジオ</a></li>
          <li><a href="#pair-culture" className="hover:text-yuri-rose underline">ペア文化 — タイGLの心臓</a></li>
          <li><a href="#representative" className="hover:text-yuri-rose underline">これだけは観たい代表作</a></li>
          <li><a href="#themes" className="hover:text-yuri-rose underline">作品のテーマ・タグ</a></li>
          <li><a href="#how-to-watch" className="hover:text-yuri-rose underline">日本からの視聴方法</a></li>
          <li><a href="#glossary" className="hover:text-yuri-rose underline">タイGL用語集</a></li>
          <li><a href="#faq" className="hover:text-yuri-rose underline">よくある質問</a></li>
        </ol>
      </div>

      <h2 id="definition" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        1. タイGLの定義
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        「GL」は <strong className="font-medium">Girls' Love</strong>（ガールズラブ）の略称で、
        日本でいう「百合（ゆり）」とほぼ同義です。
        女性同士の恋愛・絆を主軸に据えた作品ジャンルを指し、タイで制作されたものを
        <strong className="font-medium">タイGL</strong> と呼びます。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        近接ジャンルとしてタイBL（タイ・ボーイズラブ）が2014年頃から世界的に拡大しており、
        タイGLはその「妹分」として遅れて市場が形成された経緯があります。
        ただし2024年以降は、GLがBLに迫る勢いで成長中。
        制作本数・国際的なファンダム規模・興行成績、いずれも年々拡大しています。
      </p>

      <h2 id="history" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        2. 歴史 — GAP以前と以後
      </h2>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">2020年以前：散発的な存在</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        2010年代後半、Club Friday シリーズなど一部のオムニバスドラマで
        女性同士のエピソードが断発的に描かれていましたが、
        「タイGL」というジャンルとしての認知はまだ存在しませんでした。
        独立した連続ドラマシリーズはほぼ皆無で、視聴者層も限定的でした。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">2022年：GAPが市場を切り拓く</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        2022年11月、IDOLFACTORY 制作の{" "}
        <Link href="/dramas/gap" className="text-yuri-rose hover:opacity-80 underline">「GAP: The Series」</Link>
        が放送開始。<strong className="font-medium">タイ初の本格的なGL長編連続ドラマ</strong>として国際的な大ヒットを記録し、
        主演ペア「<Link href="/cast/freen" className="text-yuri-rose hover:opacity-80 underline">FreenBecky</Link>」が瞬く間にタイGLの代名詞となりました。
        以降の流れを決定づけたという意味で、タイGL史は「GAP以前 / GAP以後」で語られるほどの転換点です。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">2023〜2025年：本格化と多様化</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        GAP の成功を受け、タイの主要スタジオが次々に GL シリーズを企画。
        GMMTV（タイ最大のBL/GL制作会社）、CHANGE2561、Channel 3、Snap25 などが参入し、
        年間制作本数が一気に増加します。テーマも王道ロマンスから時代劇、SF、企業ドラマ、社会派と多様化。
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>2023年: <Link href="/dramas/23-5" className="text-yuri-rose hover:opacity-80 underline">「23.5」</Link>（GMMTV初の本格GL）</li>
        <li>2024年: <Link href="/dramas/pluto" className="text-yuri-rose hover:opacity-80 underline">「Pluto」</Link>、<Link href="/dramas/the-loyal-pin" className="text-yuri-rose hover:opacity-80 underline">「The Loyal Pin」</Link>（時代劇）、<Link href="/dramas/affair" className="text-yuri-rose hover:opacity-80 underline">「Affair」</Link></li>
        <li>2025年: <Link href="/dramas/us" className="text-yuri-rose hover:opacity-80 underline">「Us」</Link>（日常系）、<Link href="/dramas/harmony-secret" className="text-yuri-rose hover:opacity-80 underline">「Harmony Secret」</Link>、<Link href="/dramas/dangerous-queen" className="text-yuri-rose hover:opacity-80 underline">「Dangerous Queen」</Link>（インディーズ）</li>
      </ul>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">2026年：グローバル展開期</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        2026年現在、FreenBecky・NamtanFilm・LingOrm・LMSY などの主要ペアが
        Cannes・Paris Fashion Week・Riyadh Fashion Week・Vogue Singapore などの
        グローバル舞台に進出。タイGLは「アジアの一ジャンル」から「世界のジャンル」へと脱皮しつつあります。
      </p>

      <h2 id="studios" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        3. 主要スタジオ
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイGLの制作は、大手から新興インディーズまで複数のスタジオが牽引しています。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">IDOLFACTORY</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        FreenBecky所属の老舗事務所。GAP・The Loyal Pin・Cranium 等を制作。
        タイGL第一世代の代名詞的存在で、グローバル展開のパイオニア。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">GMMTV</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイ最大の制作会社。BL作品で培った海外配信ノウハウを GL にも展開。
        23.5 / Pluto / Girl Rules / Us / Moonshadow 等を制作。
        洗練された映像クオリティと安定した制作体制が強み。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">CHANGE2561</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        LMSY（Lookmhee × Sonya）の3部作（Affair / Harmony Secret / Hometown Romance）を制作。
        「1組のペアを長期プロジェクトとして育てる」という独自モデルを確立。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">S.NUR Entertainment</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        女優兼CEO Nur Desoraya が設立したインディーズスタジオ。
        Dangerous Queen で「インディーズGL」というカテゴリーを開拓。
        大手では扱いにくいダークなテーマ・社会派の物語を独自に展開。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">その他</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        Snap25、Channel 3、North Star Entertainment、Nar-ra-tor など、
        多数のスタジオが GL 制作に参入しており、競争と多様化が加速しています。
      </p>

      <h2 id="pair-culture" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        4. ペア文化 — タイGLの心臓
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイGL（およびタイBL）を理解するうえで欠かせないのが
        <strong className="font-medium">「ペア」</strong> という概念です。
        単に「共演する2人」ではなく、<strong className="font-medium">複数作品にわたって主演する固定の組み合わせ</strong>として
        ブランド化される存在を指します。
      </p>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        各ペアには「<strong className="font-medium">シップネーム</strong>」と呼ばれる固有名（例: FreenBecky、LMSY、NamtanFilm）と、
        専用のファンダム名（例: FreenBeckyKers、Besties、LUNARs）があり、
        ファンミーティング、写真集、グッズ、誕生日ビルボード広告など、
        ペア単位での経済圏が確立されています。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">主要ペア（2026年時点）</h3>
      <ul className="list-disc pl-6 space-y-1 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">FreenBecky</strong> — Freen Chankimha × Becky Armstrong（IDOLFACTORY、GAP / The Loyal Pin / The Air / Cranium）</li>
        <li><strong className="font-medium">LMSY</strong> — Lookmhee Punyapat × Sonya Saranphat（CHANGE2561、Affair / Harmony Secret / Hometown Romance）</li>
        <li><strong className="font-medium">NamtanFilm</strong> — Tipnaree Namtan × Rachanun Film（GMMTV、Pluto / Girl Rules / Her）</li>
        <li><strong className="font-medium">EmiBonnie</strong> — Thasorn Emi × Pattraphus Bonnie（GMMTV、Us / Moonshadow）</li>
        <li><strong className="font-medium">LingOrm</strong> — Ling Kanyawee × Orm Kornnaphat（GMMTV、23.5 ほか）</li>
        <li><strong className="font-medium">MilkLove</strong> — Milk Pansa × Love Pattranite（GMMTV）</li>
        <li><strong className="font-medium">ViewMim</strong> — View Benyapa × Mim Rattawan（GMMTV）</li>
        <li><strong className="font-medium">TKNur</strong> — Tangkwa Phinyanech × Nur Desoraya（S.NUR Entertainment、Dangerous Queen）</li>
      </ul>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        詳しくは <Link href="/cast" className="text-yuri-rose hover:opacity-80 underline">ペア一覧ページ</Link> をご覧ください。
      </p>

      <h2 id="representative" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        5. これだけは観たい代表作
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        いま観るならまずこの数本、というラインナップ。詳細は各作品ページへ。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">入門編</h3>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>
          <Link href="/dramas/gap" className="text-yuri-rose hover:opacity-80 underline font-medium">GAP: The Series</Link>（2022）
          — タイGLの原点。職場ロマンス × 年上×年下の王道。
        </li>
        <li>
          <Link href="/dramas/23-5" className="text-yuri-rose hover:opacity-80 underline font-medium">23.5</Link>（2023）
          — GMMTVの青春GL。爽やか系の入口に。
        </li>
        <li>
          <Link href="/dramas/pluto" className="text-yuri-rose hover:opacity-80 underline font-medium">Pluto</Link>（2024）
          — 盲目の弁護士と双子の姉妹。タイGLが「演技で勝負できる」と示した名作。
        </li>
      </ul>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">じっくり編</h3>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>
          <Link href="/dramas/the-loyal-pin" className="text-yuri-rose hover:opacity-80 underline font-medium">The Loyal Pin</Link>（2024）
          — タイ王朝期の時代劇GL。豪奢な衣装とスロウバーン。
        </li>
        <li>
          <Link href="/dramas/affair" className="text-yuri-rose hover:opacity-80 underline font-medium">Affair</Link>（2024）
          — お嬢様 × メイドの娘、13年越しの再会。
        </li>
        <li>
          <Link href="/dramas/us" className="text-yuri-rose hover:opacity-80 underline font-medium">Us</Link>（2025）
          — 派手な事件のない、日常系GLの傑作。
        </li>
      </ul>

      <h3 className="text-base font-medium text-yuri-navy mt-6 mb-2">挑戦的なテーマ</h3>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li>
          <Link href="/dramas/dangerous-queen" className="text-yuri-rose hover:opacity-80 underline font-medium">Dangerous Queen</Link>（2025）
          — インディーズ発、ギャンブル依存を扱う社会派GL。
        </li>
        <li>
          <Link href="/dramas/harmony-secret" className="text-yuri-rose hover:opacity-80 underline font-medium">Harmony Secret</Link>（2025）
          — 18+評価のコーポレートドラマ × 復讐 × 愛憎。
        </li>
      </ul>

      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        さらに網羅的なリストは{" "}
        <Link href="/dramas" className="text-yuri-rose hover:opacity-80 underline">完結作品一覧</Link>
        {" / "}
        <Link href="/dramas/airing" className="text-yuri-rose hover:opacity-80 underline">放送中</Link>
        {" / "}
        <Link href="/dramas/upcoming" className="text-yuri-rose hover:opacity-80 underline">公開予定</Link>
        へ。
      </p>

      <h2 id="themes" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        6. 作品のテーマ・タグ
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        タイGLは初期の「職場ロマンス」中心から、次第にテーマが多様化しています。代表的なテーマは:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">年齢差・身分差ロマンス</strong>（GAP系）</li>
        <li><strong className="font-medium">時代劇</strong>（The Loyal Pin）</li>
        <li><strong className="font-medium">幼馴染・再会</strong>（Affair）</li>
        <li><strong className="font-medium">企業／復讐</strong>（Harmony Secret）</li>
        <li><strong className="font-medium">校園・青春</strong>（23.5、Girl Rules）</li>
        <li><strong className="font-medium">日常系・スロウライフ</strong>（Us、Hometown Romance）</li>
        <li><strong className="font-medium">社会派・ダーク</strong>（Dangerous Queen）</li>
        <li><strong className="font-medium">SF・ファンタジー</strong>（Pluto、Uranus 2324）</li>
        <li><strong className="font-medium">サブカルチャー</strong>（Love beyond Dreams、Fulfill）</li>
      </ul>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        YuriThaiでは作品ごとに{" "}
        <strong className="font-medium">ジャンル / 関係性 / トーン / ペース / 描写の濃さ / 注意点</strong>{" "}
        のタグを付けており、好みに合うものを横断検索できます。
        <Link href="/recommend" className="text-yuri-rose hover:opacity-80 underline">「おすすめ診断」</Link>
        も併用すると効率的。
      </p>

      <h2 id="how-to-watch" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        7. 日本からの視聴方法
      </h2>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        作品によって配信プラットフォームが異なります。主要なルート:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        <li><strong className="font-medium">日本国内サービス</strong>: TELASA、U-NEXT、Netflix日本、iQIYI日本、ABEMA など — 国内ライセンス済みの作品。</li>
        <li><strong className="font-medium">YouTube</strong>: 一部の作品は公式チャンネルで全話無料公開（タイ語字幕あるいはタイ語のみ）。</li>
        <li><strong className="font-medium">海外配信サービス</strong>: iQIYI（タイ版）、AIS Play、TrueID 等 — ジオ制限がある場合あり。</li>
      </ul>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        各作品ごとの配信先は、作品詳細ページの「どこで見れる？」セクションで確認できます。
        海外配信サービスの利用には{" "}
        <Link href="/guide/vpn" className="text-yuri-rose hover:opacity-80 underline">VPNの活用</Link>
        を含む選択肢があります（詳しくは別ページで解説）。
      </p>

      <h2 id="glossary" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        8. タイGL用語集
      </h2>
      <dl className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4 space-y-3">
        <div>
          <dt className="font-medium text-yuri-ink">ペア（Pair）</dt>
          <dd className="pl-4">複数作品にわたって主演する固定の俳優コンビ。ブランドとして経済圏を持つ。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">シップネーム（Ship Name）</dt>
          <dd className="pl-4">ペアの愛称（例: FreenBecky、LMSY）。ファンが投票で決めたり、事務所公認だったり。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">ケミ（Chemistry）</dt>
          <dd className="pl-4">主演2人の相性・空気感。「ケミ強い」が最大級の褒め言葉。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">ファンミ（Fan Meeting）</dt>
          <dd className="pl-4">ペアが主催するファンイベント。タイ国内のみならず海外でも開催。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">センイル広告</dt>
          <dd className="pl-4">ファンが推しの誕生日に出すお祝いビルボード広告。タイGL文化でも盛ん。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">サブCP</dt>
          <dd className="pl-4">メインの主演ペアと並行して登場する第2のロマンス。サブカップル。</dd>
        </div>
        <div>
          <dt className="font-medium text-yuri-ink">スロウバーン（Slow Burn）</dt>
          <dd className="pl-4">恋愛関係がゆっくり進行する作風。時代劇GL等で多用される。</dd>
        </div>
      </dl>

      <h2 id="faq" className="text-xl font-medium text-yuri-navy mb-3 mt-10 pb-1 border-b border-yuri-edge">
        9. よくある質問
      </h2>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">Q. タイGLとタイBLの違いは？</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        主演の性別・関係性が異なります。タイBLは男性同士、タイGLは女性同士のロマンスを描きます。
        ジャンルとしての歴史はBLが先行し（2010年代から）、GLは2022年以降に急成長しました。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">Q. タイGLは何話くらいで完結する？</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        作品によりますが、<strong className="font-medium">8〜14話</strong>が多く、
        1話50〜70分。シリーズ全体で1クール（2〜3か月）で完結するのが一般的。
        日本のドラマと比べると話数は少なめで、長尺映画を分割視聴する感覚に近い。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">Q. 日本語字幕はある？</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        日本配信されている作品（TELASA・Netflix日本・iQIYI日本等）は基本的に日本語字幕付き。
        YouTube公式配信は作品により異なり、英語字幕中心の作品もあります。
        各作品ページの「配信先」を確認ください。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">Q. タイGLを観るために予備知識は必要？</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        基本的に不要です。ただ、ペアやスタジオの文脈を知っているとより深く楽しめるので、
        本ガイドや YuriThai 内の{" "}
        <Link href="/blog" className="text-yuri-rose hover:opacity-80 underline">ブログ記事</Link>
        を観た作品の前後に読むのがおすすめです。
      </p>

      <h3 className="text-base font-medium text-yuri-navy mt-5 mb-2">Q. 18禁的な描写はある？</h3>
      <p className="text-[15px] leading-[1.9] text-yuri-ink/85 mb-4">
        作品によって大きく異なります。<strong className="font-medium">Harmony Secret</strong> 等は 18+ 評価で、
        親密シーンや成人向けテーマを扱います。
        <strong className="font-medium">23.5</strong> や <strong className="font-medium">Us</strong>{" "}
        などは爽やかな日常系で、年齢制限はありません。
        YuriThai の各作品ページでは「描写の濃さ」「年齢評価」のタグを表示しているので、選ぶ際の参考にしてください。
      </p>

      {/* CTA：診断 */}
      <div className="bg-yuri-pink/10 border border-yuri-rose/20 rounded-lg p-5 mt-10 mb-8 text-center">
        <p className="text-base font-medium text-yuri-ink mb-2">
          自分に合うタイGLが分からない？
        </p>
        <p className="text-sm text-yuri-muted mb-4">
          5問の診断で、あなたに合った1作をご提案します。
        </p>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 bg-yuri-navy text-yuri-cream px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
        >
          <span>✦</span>
          おすすめを診断する
          <span>→</span>
        </Link>
      </div>

      <hr className="my-10 border-yuri-edge" />

      <h2 className="text-lg font-medium text-yuri-navy mb-3">
        次に読むなら
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-[1.9] text-yuri-ink/85 mb-8">
        <li><Link href="/blog/freenbecky-history" className="text-yuri-rose hover:opacity-80 underline">FreenBeckyの歴史 — タイGLを世界に押し上げた二人</Link></li>
        <li><Link href="/blog/lmsy-trilogy-guide" className="text-yuri-rose hover:opacity-80 underline">LMSY 3部作完全ガイド</Link></li>
        <li><Link href="/blog/2026-must-watch" className="text-yuri-rose hover:opacity-80 underline">2026年、これだけは観たいタイGL</Link></li>
        <li><Link href="/guide/vpn" className="text-yuri-rose hover:opacity-80 underline">VPNとタイGL — 海外配信を観るためのガイド</Link></li>
      </ul>
    </div>
  );
}
