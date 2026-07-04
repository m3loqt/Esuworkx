import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminDrawer from "@/components/AdminDrawer";
import WorkForm from "@/components/WorkForm";
import { db } from "@/db";
import { works } from "@/db/schema";
import { updateWork } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditWorkModal({
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
    <AdminDrawer title="Edit Work">
      <WorkForm action={updateWork.bind(null, work.id)} work={work} />
    </AdminDrawer>
  );
}
