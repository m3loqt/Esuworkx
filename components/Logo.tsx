import Image from "next/image";

// Intrinsic size of /logo/esuworx-logo.png (664x1024) — keep width/height
// proportional so Next.js doesn't warn about a modified aspect ratio.
const INTRINSIC_WIDTH = 664;
const INTRINSIC_HEIGHT = 1024;

export default function Logo({ size = 55 }: { size?: number }) {
  const height = Math.round((size * INTRINSIC_HEIGHT) / INTRINSIC_WIDTH);
  return (
    <Image
      className="logo_img"
      src="/logo/esuworx-logo.png"
      alt="ESUWORX"
      width={size}
      height={height}
      style={{ width: size, height: "auto" }}
    />
  );
}
