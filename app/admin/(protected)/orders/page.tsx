import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { formatPrice } from "@/lib/product";
import { confirmOrder, rejectOrder } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "rejected"] as const;

function statusBadgeClass(status: string) {
  if (status === "pending") return "admin_badge admin_badge_pending";
  if (status === "confirmed") return "admin_badge admin_badge_confirmed";
  if (status === "rejected") return "admin_badge admin_badge_rejected";
  return "admin_badge";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = STATUSES.includes(status as (typeof STATUSES)[number])
    ? (status as (typeof STATUSES)[number])
    : undefined;

  const baseQuery = db.select().from(orders).orderBy(desc(orders.createdAt));
  const orderRows = statusFilter
    ? await baseQuery.where(eq(orders.status, statusFilter))
    : await baseQuery;

  const orderIds = orderRows.map((o) => o.id);
  const itemRows = orderIds.length
    ? await db
        .select({ item: orderItems, product: products })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(inArray(orderItems.orderId, orderIds))
    : [];

  const itemsByOrder = new Map<number, typeof itemRows>();
  for (const row of itemRows) {
    const list = itemsByOrder.get(row.item.orderId) ?? [];
    list.push(row);
    itemsByOrder.set(row.item.orderId, list);
  }

  return (
    <div className="admin_page">
      <div className="admin_page_header">
        <h1>Orders</h1>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Link href="/admin/orders" className={`admin_btn admin_btn_sm${!statusFilter ? " admin_btn_primary" : ""}`}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`admin_btn admin_btn_sm${statusFilter === s ? " admin_btn_primary" : ""}`}
            style={{ textTransform: "capitalize" }}
          >
            {s}
          </Link>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin_table">
          <thead>
            <tr>
              <th>Proof</th>
              <th>Items</th>
              <th>Buyer</th>
              <th>Address</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderRows.map((order) => {
              const lineItems = itemsByOrder.get(order.id) ?? [];
              return (
                <tr key={order.id}>
                  <td>
                    <a href={order.proofOfPaymentUrl} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="admin_thumb" src={order.proofOfPaymentUrl} alt="Proof of payment" />
                    </a>
                  </td>
                  <td style={{ minWidth: 200 }}>
                    {lineItems.map(({ item, product }) => (
                      <div key={item.id} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>
                          {product ? product.name : "Product removed"}
                        </span>
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>
                          {" "}
                          × {item.quantity} — {formatPrice(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td>
                    <div>{order.buyerName}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{order.buyerEmail}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{order.buyerPhone}</div>
                  </td>
                  <td style={{ maxWidth: 220, color: "var(--muted)", fontSize: 12 }}>{order.buyerAddress}</td>
                  <td>
                    <span className={statusBadgeClass(order.status)}>{order.status}</span>
                  </td>
                  <td>
                    {order.status === "pending" && (
                      <div className="admin_table_actions">
                        <form action={confirmOrder.bind(null, order.id)}>
                          <button type="submit" className="admin_btn admin_btn_sm admin_btn_primary">
                            Confirm
                          </button>
                        </form>
                        <form action={rejectOrder.bind(null, order.id)}>
                          <button type="submit" className="admin_btn admin_btn_sm admin_btn_danger">
                            Reject
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orderRows.length === 0 && <p style={{ color: "var(--muted)", padding: "20px 0" }}>No orders here.</p>}
      </div>
    </div>
  );
}
