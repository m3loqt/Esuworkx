import type { Metadata } from "next";
import WorksGrid from "@/components/WorksGrid";
import { db } from "@/db";
import { works } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Browse the Esuworx portfolio of hand-finished art toy sculptures by Ace De Leon — available and sold works, with pieces open for request to purchase.",
};

export default async function WorksPage() {
  const allWorks = await db.select().from(works);

  return (
    <div className="tab">
      <WorksGrid works={allWorks} />
    </div>
  );
}
