import AdminDrawer from "@/components/AdminDrawer";
import WorkForm from "@/components/WorkForm";
import { createWork } from "../../actions";

export default function NewWorkModal() {
  return (
    <AdminDrawer title="Add Work">
      <WorkForm action={createWork} />
    </AdminDrawer>
  );
}
