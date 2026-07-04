import type { MetadataRoute } from "next";

const siteUrl = "https://esuworx.shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
