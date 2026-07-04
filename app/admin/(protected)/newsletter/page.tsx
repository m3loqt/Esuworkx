import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));

  return (
    <div className="admin_page">
      <div className="admin_page_header">
        <h1>Newsletter</h1>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin_table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{subscriber.email}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>
                  {subscriber.createdAt.toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
