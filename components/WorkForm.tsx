"use client";

import { useActionState } from "react";
import type { Work } from "@/db/schema";
import type { WorkFormState } from "@/app/admin/(protected)/works/actions";
import FileDropzone from "./FileDropzone";

const initialState: WorkFormState = { status: "idle" };

export default function WorkForm({
  action,
  work,
}: {
  action: (prevState: WorkFormState, formData: FormData) => Promise<WorkFormState>;
  work?: Work;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="admin_form">
      <label className="admin_field_label" htmlFor="title">Title</label>
      <input id="title" type="text" name="title" defaultValue={work?.title} required />

      <label className="admin_field_label" htmlFor="description">Description</label>
      <textarea id="description" name="description" rows={4} defaultValue={work?.description ?? ""} />

      <label className="admin_field_label" htmlFor="images">
        Images {work ? "(leave empty to keep current)" : ""}
      </label>
      <FileDropzone name="images" accept="image/*" multiple />
      {work?.images && work.images.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {work.images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img} src={img} alt="" className="admin_thumb" style={{ width: 60, height: 60 }} />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <p style={{ color: "var(--brand_red)", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
          {state.message}
        </p>
      )}

      <div className="admin_form_actions">
        <button type="submit" className="admin_btn admin_btn_primary" disabled={isPending}>
          {isPending ? "Saving..." : work ? "Save Changes" : "Create Work"}
        </button>
      </div>
    </form>
  );
}
