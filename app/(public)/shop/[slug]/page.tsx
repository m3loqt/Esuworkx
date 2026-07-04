import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ShopGallery from "@/components/ShopGallery";
import PurchaseControls from "@/components/PurchaseControls";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatPrice, statusLabel, statusColor } from "@/lib/product";

export const dynamic = "force-dynamic";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug));

  if (!product) notFound();

  const soldOut = product.status === "sold_out";

  return (
    <div className="tab">
      <div className="shop_container">
        <ShopGallery images={product.images ?? []} alt={product.name} />

        <div className="shop_details_side">
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: statusColor(product),
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            {statusLabel(product)}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              textTransform: "uppercase",
              marginBottom: 15,
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 25, maxWidth: 450 }}>
            {product.description}
          </p>
          <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>
            {formatPrice(product.price)}
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 25, marginBottom: 25 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 18,
                }}
              >
                Additional Details
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {product.specifications.map((spec, i) => (
                  <div key={i} style={{ display: "flex", gap: 20 }}>
                    <div style={{ minWidth: 120, fontSize: 13, fontWeight: 700 }}>{spec.label}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{spec.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 25 }}>
            {soldOut ? (
              <button className="btn_main" disabled>
                SOLD OUT
              </button>
            ) : (
              <PurchaseControls
                productId={product.id}
                slug={product.slug}
                name={product.name}
                image={product.images?.[0] ?? null}
                price={product.price}
                maxQuantity={product.stockCount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
