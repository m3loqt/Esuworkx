import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import WorkForm from "@/components/WorkForm";
import { db } from "@/db";
import { works } from "@/db/schema";
import { updateWork } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [work] = await db
    .select()
    .from(works)
    .where(eq(works.id, Number(id)));

  if (!work) notFound();

  return (
    <div className="admin_page">
      <h1 style={{ marginBottom: 28 }}>Edit Work</h1>
      <WorkForm action={updateWork.bind(null, work.id)} work={work} />
    </div>
  );
}
