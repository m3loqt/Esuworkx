"use client";

import { useState } from "react";
import type { ProductSpecification } from "@/db/schema";

export default function SpecificationsEditor({
  initial,
}: {
  initial: ProductSpecification[];
}) {
  const [specs, setSpecs] = useState<ProductSpecification[]>(initial);

  function updateSpec(index: number, field: "label" | "detail", value: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { label: "", detail: "" }]);
  }

  return (
    <div>
      <input type="hidden" name="specifications" value={JSON.stringify(specs)} />
      {specs.map((spec, i) => (
        <div className="spec_row" key={i}>
          <input
            type="text"
            placeholder="Label (e.g. Size)"
            value={spec.label}
            onChange={(e) => updateSpec(i, "label", e.target.value)}
          />
          <input
            type="text"
            placeholder="Detail (e.g. 4 inch hand poured resin figure)"
            value={spec.detail}
            onChange={(e) => updateSpec(i, "detail", e.target.value)}
          />
          <button
            type="button"
            className="spec_row_delete"
            onClick={() => removeSpec(i)}
            aria-label="Remove detail"
          >
            🗑
          </button>
        </div>
      ))}
      <button type="button" className="spec_add_btn" onClick={addSpec}>
        + Add Detail
      </button>
    </div>
  );
}
