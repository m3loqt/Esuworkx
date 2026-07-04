import { sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { formatPrice } from "@/lib/product";
import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import DailyTrendChart from "@/components/charts/DailyTrendChart";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "#fab219",
  confirmed: "#0ca30c",
  rejected: "#d03b3b",
};

function StatTile({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="admin_card" style={{ minWidth: 180, flex: 1 }}>
      <div className="admin_field_label">{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
  return href ? (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

export default async function AdminDashboardPage() {
  const {
    rows: [{ total_orders, pending_orders }],
  } = await db.execute<{
    total_orders: number;
    pending_orders: number;
  }>(sql`
    select
      count(*)::int as total_orders,
      count(*) filter (where status = 'pending')::int as pending_orders
    from orders
  `);

  const { rows: statusRows } = await db.execute<{ status: string; count: number }>(sql`
    select status, count(*)::int as count from orders group by status
  `);
  const statusCounts: Record<string, number> = { pending: 0, confirmed: 0, rejected: 0 };
  for (const row of statusRows) statusCounts[row.status] = row.count;

  const {
    rows: [{ revenue }],
  } = await db.execute<{ revenue: string }>(sql`
    select coalesce(sum(oi.unit_price::numeric * oi.quantity), 0) as revenue
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.status = 'confirmed'
  `);

  const { rows: topProductRows } = await db.execute<{ name: string; revenue: string }>(sql`
    select p.name, sum(oi.unit_price::numeric * oi.quantity) as revenue
    from order_items oi
    join orders o on o.id = oi.order_id
    join products p on p.id = oi.product_id
    where o.status = 'confirmed'
    group by p.name
    order by revenue desc
    limit 5
  `);

  const { rows: dailyRows } = await db.execute<{ day: string; count: number }>(sql`
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)::int as count
    from orders
    where created_at >= now() - interval '14 days'
    group by day
  `);
  const dailyCounts = new Map(dailyRows.map((r) => [r.day, r.count]));
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const key = date.toISOString().slice(0, 10);
    return { day: key, count: dailyCounts.get(key) ?? 0 };
  });

  const { rows: stockRows } = await db.execute<{ name: string; stock_count: number }>(sql`
    select name, stock_count from products order by stock_count asc
  `);

  return (
    <div className="admin_page">
      <h1 style={{ marginBottom: 28 }}>Dashboard</h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 40 }}>
        <StatTile label="Pending Orders" value={String(pending_orders)} href="/admin/orders?status=pending" />
        <StatTile label="Total Orders" value={String(total_orders)} href="/admin/orders" />
        <StatTile label="Confirmed Revenue" value={formatPrice(revenue)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 40 }}>
        <div className="admin_card">
          <div className="admin_field_label" style={{ marginBottom: 16 }}>
            Orders by Status
          </div>
          <HorizontalBarChart
            data={[
              { label: "Pending", value: statusCounts.pending, color: STATUS_COLORS.pending },
              { label: "Confirmed", value: statusCounts.confirmed, color: STATUS_COLORS.confirmed },
              { label: "Rejected", value: statusCounts.rejected, color: STATUS_COLORS.rejected },
            ]}
          />
        </div>

        <div className="admin_card">
          <div className="admin_field_label" style={{ marginBottom: 16 }}>
            Top Products (Confirmed Revenue)
          </div>
          <HorizontalBarChart
            data={topProductRows.map((r) => ({ label: r.name, value: Number(r.revenue) }))}
            valueFormatter={(v) => formatPrice(String(v))}
            emptyMessage="No confirmed orders yet."
          />
        </div>
      </div>

      <div className="admin_card" style={{ marginBottom: 40 }}>
        <div className="admin_field_label" style={{ marginBottom: 16 }}>
          Orders — Last 14 Days
        </div>
        <DailyTrendChart data={dailyData} />
      </div>

      <div className="admin_card">
        <div className="admin_field_label" style={{ marginBottom: 16 }}>
          Stock Levels
        </div>
        <HorizontalBarChart
          data={stockRows.map((r) => ({
            label: r.name,
            value: r.stock_count,
            color: r.stock_count === 0 ? "#d03b3b" : "#2a78d6",
          }))}
          emptyMessage="No products yet."
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
        <Link href="/admin/works" className="admin_btn">Manage Works</Link>
        <Link href="/admin/products" className="admin_btn">Manage Products</Link>
        <Link href="/admin/orders" className="admin_btn">View Orders</Link>
      </div>
    </div>
  );
}
