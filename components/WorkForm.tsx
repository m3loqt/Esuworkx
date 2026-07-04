"use client";

import { useActionState, useState } from "react";
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
  const [keptImages, setKeptImages] = useState<string[]>(work?.images ?? []);

  function removeImage(img: string) {
    setKeptImages((prev) => prev.filter((i) => i !== img));
  }

  function preventEnterSubmit(e: React.KeyboardEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement;
    if (e.key === "Enter" && target.tagName === "INPUT") {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} className="admin_form" onKeyDown={preventEnterSubmit}>
      <label className="admin_field_label" htmlFor="title">Title</label>
      <input id="title" type="text" name="title" defaultValue={work?.title} required />

      <label className="admin_field_label" htmlFor="description">Description</label>
      <textarea id="description" name="description" rows={4} defaultValue={work?.description ?? ""} />

      <label className="admin_field_label" htmlFor="status">Status</label>
      <select id="status" name="status" defaultValue={work?.status ?? "available"}>
        <option value="available">Available (Request to Purchase)</option>
        <option value="sold">Sold</option>
      </select>

      <label className="admin_field_label" htmlFor="images">
        Images {work ? "(new uploads are added to the images below)" : ""}
      </label>
      <FileDropzone name="images" accept="image/*" multiple />
      <input type="hidden" name="keepImages" value={JSON.stringify(keptImages)} />
      {keptImages.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {keptImages.map((img) => (
            <div key={img} className="admin_thumb_removable">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="admin_thumb" style={{ width: 60, height: 60 }} />
              <button
                type="button"
                className="admin_thumb_remove"
                onClick={() => removeImage(img)}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
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
