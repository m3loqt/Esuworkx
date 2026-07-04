import Image from "next/image";

export default function Logo({ size = 55 }: { size?: number }) {
  return (
    <Image
      className="logo_img"
      src="/logo/esuworx-logo.png"
      alt="ESUWORX"
      width={size}
      height={size}
      style={{ width: size, height: "auto" }}
    />
  );
}
