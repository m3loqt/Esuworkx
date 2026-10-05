import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import AdminImageThumb from "@/components/AdminImageThumb";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatPrice } from "@/lib/product";
import { deleteProduct, restoreProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; view?: string }>;
}) {
  const { error, notice, view } = await searchParams;
  const showArchived = view === "archived";
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.archived, showArchived))
    .orderBy(desc(products.createdAt));

  return (
    <div className="admin_page">
      <div className="admin_page_header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin_btn admin_btn_primary">
          + Add Product
        </Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Link href="/admin/products" className={`admin_btn admin_btn_sm${!showArchived ? " admin_btn_primary" : ""}`}>
          Active
        </Link>
        <Link
          href="/admin/products?view=archived"
          className={`admin_btn admin_btn_sm${showArchived ? " admin_btn_primary" : ""}`}
        >
          Archived
        </Link>
      </div>

      {notice && <p style={{ fontWeight: 700, marginBottom: 20 }}>{notice}</p>}

      {error && (
        <p style={{ color: "var(--brand_red)", fontWeight: 700, marginBottom: 20 }}>{error}</p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="admin_table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.images?.[0] ? (
                    <AdminImageThumb src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="admin_thumb" />
                  )}
                </td>
                <td style={{ fontWeight: 700 }}>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span className="admin_badge">{product.status.replace("_", " ")}</span>
                </td>
                <td>{product.stockCount}</td>
                <td>
                  <div className="admin_table_actions">
                    <Link href={`/admin/products/${product.id}/edit`} className="admin_btn admin_btn_sm">
                      Edit
                    </Link>
                    {showArchived ? (
                      <form action={restoreProduct.bind(null, product.id)}>
                        <button type="submit" className="admin_btn admin_btn_sm admin_btn_primary">
                          Restore
                        </button>
                      </form>
                    ) : (
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button type="submit" className="admin_btn admin_btn_sm admin_btn_danger">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allProducts.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>{showArchived ? "Nothing archived." : "No products yet."}</p>
        )}
      </div>
    </div>
  );
}
