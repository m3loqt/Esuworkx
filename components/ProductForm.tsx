"use client";

import { useActionState, useState } from "react";
import type { Product } from "@/db/schema";
import type { ProductFormState } from "@/app/admin/(protected)/products/actions";
import FileDropzone from "./FileDropzone";
import SpecificationsEditor from "./SpecificationsEditor";

const initialState: ProductFormState = { status: "idle" };

export default function ProductForm({
  action,
  product,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [keptImages, setKeptImages] = useState<string[]>(product?.images ?? []);

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
      <label className="admin_field_label" htmlFor="name">Product Name</label>
      <input id="name" type="text" name="name" defaultValue={product?.name} required />

      <label className="admin_field_label" htmlFor="description">Description</label>
      <textarea id="description" name="description" rows={4} defaultValue={product?.description ?? ""} />

      <label className="admin_field_label" htmlFor="price">Price (₱)</label>
      <input
        id="price"
        type="number"
        name="price"
        step="0.01"
        min="0"
        defaultValue={product?.price ?? "0"}
        required
      />

      <label className="admin_field_label" htmlFor="status">Status</label>
      <select id="status" name="status" defaultValue={product?.status ?? "available"}>
        <option value="available">Available</option>
        <option value="limited">Limited</option>
        <option value="sold_out">Sold Out</option>
      </select>

      <label className="admin_field_label" htmlFor="stockCount">Stock Count</label>
      <input
        id="stockCount"
        type="number"
        name="stockCount"
        min="0"
        defaultValue={product?.stockCount ?? 1}
        required
      />

      <label className="admin_field_label">Additional Details</label>
      <SpecificationsEditor initial={product?.specifications ?? []} />

      <label className="admin_field_label" htmlFor="images">
        Images {product ? "(new uploads are added to the images below)" : ""}
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
          {isPending ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
