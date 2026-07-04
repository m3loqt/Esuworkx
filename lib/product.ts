import type { Product } from "@/db/schema";

export function formatPrice(price: string): string {
  const amount = Number(price);
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export function statusLabel(product: Product): string {
  if (product.status === "sold_out") return "SOLD OUT";
  if (product.status === "limited") return `ONLY ${product.stockCount} UNITS LEFT`;
  return "IN STOCK";
}

export function statusColor(product: Product): string {
  return product.status === "available" ? "var(--muted)" : "var(--brand_red)";
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
