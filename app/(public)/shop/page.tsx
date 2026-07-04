import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatPrice, statusLabel, statusColor } from "@/lib/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop limited-edition and made-to-order art toy sculptures from Esuworx, the independent art toy practice of Ace De Leon.",
};

export default async function ShopPage() {
  const shopProducts = await db.select().from(products);

  return (
    <div className="tab">
      <div className="works_grid">
        {shopProducts.map((product) => (
          <Link key={product.id} href={`/shop/${product.slug}`} className="work_card">
            <div className="work_img">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} />
              ) : (
                "NO IMAGE"
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginTop: 15,
                color: statusColor(product),
              }}
            >
              {statusLabel(product)}
            </div>
            <h2 style={{ marginTop: 5 }}>{product.name}</h2>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
