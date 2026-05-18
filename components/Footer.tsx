import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-yuri-navy text-yuri-cream mt-8">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="text-lg font-display font-medium mb-4">
          <span className="text-yuri-pink">Yuri</span>
          <span className="text-yuri-lilac">Thai</span>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-4 text-sm">
          <div>
            <p className="text-xs opacity-60 mb-2 tracking-wider">サイト案内</p>
            <ul className="space-y-1.5 opacity-90">
              <li>
                <Link href="/about" className="hover:opacity-100">
                  About / 運営者情報
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:opacity-100">
                  レビュー一覧
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
                <Link
                  href="/legal/tokushoho"
                  className="hover:opacity-100"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yuri-cream/15 pt-3 text-xs opacity-70 text-center">
          © 2026 YuriThai · yurithai.jp
        </div>
      </div>
    </footer>
  );
}
