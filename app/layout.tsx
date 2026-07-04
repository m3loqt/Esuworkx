import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://esuworx.shop";
const description =
  "Esuworx is an independent art toy practice by Ace De Leon, a Philippine-based artist exploring childhood memories, companionship, and everyday moments through hand-finished sculpture. Shop limited and made-to-order releases.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Esuworx | Studio",
    template: "%s | Esuworx",
  },
  description,
  keywords: ["Esuworx", "ESUWORX", "Ace De Leon", "art toy", "resin sculpture", "Philippine art toy", "designer toy"],
  authors: [{ name: "Ace De Leon" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Esuworx",
    title: "Esuworx | Studio",
    description,
    images: [{ url: "/logo/esuworx-logo.png" }],
  },
  twitter: {
    card: "summary",
    title: "Esuworx | Studio",
    description,
    images: ["/logo/esuworx-logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Esuworx",
      alternateName: "ESUWORX",
      url: siteUrl,
      logo: `${siteUrl}/logo/esuworx-logo.png`,
      founder: { "@type": "Person", name: "Ace De Leon" },
      sameAs: ["https://instagram.com/esuworx"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Esuworx",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
