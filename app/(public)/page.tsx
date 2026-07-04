import WorksGrid from "@/components/WorksGrid";
import { db } from "@/db";
import { works } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const allWorks = await db.select().from(works);

  return (
    <div className="tab">
      <WorksGrid works={allWorks} />
    </div>
  );
}
