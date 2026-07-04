import Link from "next/link";
import AdminImageThumb from "@/components/AdminImageThumb";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatPrice } from "@/lib/product";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const allProducts = await db.select().from(products).orderBy(products.createdAt);

  return (
    <div className="admin_page">
      <div className="admin_page_header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="admin_btn admin_btn_primary">
          + Add Product
        </Link>
      </div>

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
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button type="submit" className="admin_btn admin_btn_sm admin_btn_danger">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allProducts.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>No products yet.</p>
        )}
      </div>
    </div>
  );
}
