import Link from "next/link";
import { db } from "@/db";
import { works } from "@/db/schema";
import { deleteWork } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const allWorks = await db.select().from(works).orderBy(works.createdAt);

  return (
    <div className="admin_page">
      <div className="admin_page_header">
        <h1>Works</h1>
        <Link href="/admin/works/new" className="admin_btn admin_btn_primary">
          + Add Work
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin_table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allWorks.map((work) => (
              <tr key={work.id}>
                <td>
                  {work.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="admin_thumb" src={work.images[0]} alt="" />
                  ) : (
                    <div className="admin_thumb" />
                  )}
                </td>
                <td style={{ fontWeight: 700 }}>{work.title}</td>
                <td style={{ color: "var(--muted)", fontSize: 12, maxWidth: 320 }}>
                  {work.description}
                </td>
                <td>
                  <div className="admin_table_actions">
                    <Link href={`/admin/works/${work.id}/edit`} className="admin_btn admin_btn_sm">
                      Edit
                    </Link>
                    <form action={deleteWork.bind(null, work.id)}>
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
        {allWorks.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>No works yet.</p>
        )}
      </div>
    </div>
  );
}
