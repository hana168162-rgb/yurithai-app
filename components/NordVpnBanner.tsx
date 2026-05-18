import Image from "next/image";
import {
  NORDVPN,
  AFFILIATE_DISCLOSURE_SHORT,
  type NordVpnBannerKey,
} from "@/lib/affiliate";

type Props = {
  /** どのバナー画像を出すか（lib/affiliate.ts の NORDVPN.banners キー） */
  banner: NordVpnBannerKey;
  /** モバイル時に小さく出したい場合の最大幅指定 */
  className?: string;
  /** PR表記を付けるか（基本 true） */
  showLabel?: boolean;
  /** 画像の遅延読み込みを無効にしたい場合 true（above-the-fold） */
  priority?: boolean;
};

/**
 * NordVPN 公式提供バナーをアフィリエイトURLでラップして表示するコンポーネント。
 * 商標規約上、画像の改変・サイズ強制変更・色変更は禁止のため、
 * 元データの aspect ratio を維持して表示する。
 */
export function NordVpnBanner({
  banner,
  className = "",
  showLabel = true,
  priority = false,
}: Props) {
  const b = NORDVPN.banners[banner];

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {showLabel && (
        <span
          className="absolute top-1.5 right-1.5 z-10 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/85 text-yuri-muted tracking-wider shadow-sm"
          aria-label="アフィリエイト広告"
        >
          {AFFILIATE_DISCLOSURE_SHORT}
        </span>
      )}
      <a
        href={NORDVPN.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="block overflow-hidden rounded-md hover:opacity-95 transition-opacity"
      >
        <Image
          src={b.src}
          alt={b.alt}
          width={b.width}
          height={b.height}
          priority={priority}
          className="w-full h-auto block"
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized
        />
      </a>
    </div>
  );
}

/**
 * モバイル時とPC時で別のバナーを出し分けるラッパー。
 * モバイル: 正方形寄り or 縦長 / PC: 横長 などを切り替える。
 */
export function NordVpnBannerResponsive({
  mobileBanner,
  desktopBanner,
  className = "",
  priority = false,
}: {
  mobileBanner: NordVpnBannerKey;
  desktopBanner: NordVpnBannerKey;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={className}>
      <div className="md:hidden">
        <NordVpnBanner banner={mobileBanner} priority={priority} />
      </div>
      <div className="hidden md:block">
        <NordVpnBanner banner={desktopBanner} priority={priority} />
      </div>
    </div>
  );
}
