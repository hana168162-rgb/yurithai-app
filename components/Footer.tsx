import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-yuri-navy text-yuri-cream mt-0 md:mt-8">
      {/* モバイルは下部固定バーに被らないよう pb を増やす */}
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-24 md:pb-6">
        <div className="text-lg font-display font-medium mb-4">
          <span className="text-yuri-pink">Yuri</span>
          <span className="text-yuri-lilac">Thai</span>
        </div>

        {/* ==========================
            PC（md+）レイアウト：3列＋スポンサー CTA
            既存の情報量はそのまま維持
            ========================== */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-8 mb-4 text-sm">
            <div>
              <p className="text-xs opacity-60 mb-2 tracking-wider">サイト案内</p>
              <ul className="space-y-1.5 opacity-90">
                <li>
                  <Link href="/about" className="hover:opacity-100">
                    About / 運営者情報
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:opacity-100">
                    ブログ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:opacity-100">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2 tracking-wider">ガイド</p>
              <ul className="space-y-1.5 opacity-90">
                <li>
                  <Link href="/recommend" className="hover:opacity-100">
                    タイGLおすすめ診断
                  </Link>
                </li>
                <li>
                  <Link href="/guide/vpn" className="hover:opacity-100">
                    VPNとタイGL
                  </Link>
                </li>
                <li>
                  <Link href="/guide/travel-to-thailand" className="hover:opacity-100">
                    バンコク旅行ガイド
                  </Link>
                </li>
                <li>
                  <Link href="/legal/advertising" className="hover:opacity-100">
                    広告掲載ポリシー
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2 tracking-wider">法的情報</p>
              <ul className="space-y-1.5 opacity-90">
                <li>
                  <Link href="/privacy" className="hover:opacity-100">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:opacity-100">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/legal/tokushoho" className="hover:opacity-100">
                    特定商取引法に基づく表記
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-yuri-cream/15 pt-4 pb-2 flex flex-row items-center justify-center gap-4 text-xs">
            <span className="opacity-70">
              タイGL関連のスポンサー・タイアップ募集中
            </span>
            <Link
              href="/contact?topic=sponsor"
              className="inline-flex items-center gap-1 rounded-full border border-yuri-cream/30 px-3 py-1 hover:bg-yuri-cream/10 transition-colors"
            >
              お問い合わせ <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* ==========================
            モバイル（〜md）レイアウト：最小限
            主要リンク横並び + スポンサー1行 + コピーライト
            text-[13px] でリンクのタップ・可読性を確保（旧 text-xs は小さすぎた）
            ========================== */}
        <div className="md:hidden text-[13px]">
          <ul className="flex flex-wrap gap-x-3 gap-y-2 opacity-90 mb-4 leading-relaxed">
            <li>
              <Link href="/about" className="hover:opacity-100">
                About
              </Link>
            </li>
            <li aria-hidden className="opacity-40">·</li>
            <li>
              <Link href="/contact" className="hover:opacity-100">
                お問い合わせ
              </Link>
            </li>
            <li aria-hidden className="opacity-40">·</li>
            <li>
              <Link href="/legal/advertising" className="hover:opacity-100">
                広告ポリシー
              </Link>
            </li>
            <li aria-hidden className="opacity-40">·</li>
            <li>
              <Link href="/privacy" className="hover:opacity-100">
                プライバシー
              </Link>
            </li>
            <li aria-hidden className="opacity-40">·</li>
            <li>
              <Link href="/terms" className="hover:opacity-100">
                利用規約
              </Link>
            </li>
            <li aria-hidden className="opacity-40">·</li>
            <li>
              <Link href="/legal/tokushoho" className="hover:opacity-100">
                特商法
              </Link>
            </li>
          </ul>

          <Link
            href="/contact?topic=sponsor"
            className="inline-flex items-center gap-1 rounded-full border border-yuri-cream/30 px-3.5 py-1.5 opacity-90 hover:opacity-100"
          >
            スポンサー募集中 <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="border-t border-yuri-cream/15 mt-4 pt-3 text-xs md:text-[11px] opacity-70 text-center">
          © 2026 YuriThai · yurithai.jp
        </div>
      </div>
    </footer>
  );
}
