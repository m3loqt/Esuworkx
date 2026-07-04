import WorkForm from "@/components/WorkForm";
import { createWork } from "../actions";

export default function NewWorkPage() {
  return (
    <div className="admin_page">
      <h1 style={{ marginBottom: 28 }}>Add Work</h1>
      <WorkForm action={createWork} />
    </div>
  );
}
