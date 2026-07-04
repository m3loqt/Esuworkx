import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";

const siteUrl = "https://esuworx.shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProducts = await db
    .select({ slug: products.slug, createdAt: products.createdAt })
    .from(products);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${siteUrl}/shop/${product.slug}`,
    lastModified: product.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
