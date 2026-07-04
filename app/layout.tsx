import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESUWORX | STUDIO",
  description:
    "ESUWORX is an independent art toy label based in Manila, specializing in industrial grade resin sculptures.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
