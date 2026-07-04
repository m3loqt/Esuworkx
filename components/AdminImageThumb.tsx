"use client";

import { useState } from "react";

export default function AdminImageThumb({ src, alt = "" }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="admin_thumb_btn" onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="admin_thumb" src={src} alt={alt} />
      </button>
      {open && (
        <div className="admin_lightbox_backdrop" onClick={() => setOpen(false)}>
          <button
            type="button"
            className="admin_lightbox_close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="admin_lightbox_img"
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
