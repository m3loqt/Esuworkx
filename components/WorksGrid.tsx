"use client";

import { useState } from "react";
import type { Work } from "@/db/schema";

export default function WorksGrid({ works }: { works: Work[] }) {
  const [previewWork, setPreviewWork] = useState<Work | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [inquiryWork, setInquiryWork] = useState<Work | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  function openPreview(work: Work) {
    setPreviewWork(work);
    setPreviewIndex(0);
  }

  function closeOverlays() {
    setPreviewWork(null);
    setInquiryWork(null);
    setInquirySent(false);
  }

  function openInquiry(work: Work) {
    setInquiryWork(work);
  }

  const previewImages = previewWork?.images ?? [];

  return (
    <>
      <div className="works_grid">
        {works.map((work) => (
          <button
            key={work.id}
            className="work_card"
            onClick={() => openPreview(work)}
          >
            <div className="work_img">
              {work.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={work.images[0]} alt={work.title} />
              ) : (
                "NO IMAGE"
              )}
            </div>
            <h2>{work.title}</h2>
            <p className="view_meta">VIEW DETAILS</p>
          </button>
        ))}
      </div>

      {previewWork && (
        <div className="overlay" style={{ display: "block" }}>
          <div
            style={{
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
              textAlign: "left",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <span
              style={{ fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}
              onClick={closeOverlays}
            >
              ← BACK TO GALLERY
            </span>
          </div>

          <div className="shop_container" style={{ marginTop: 40 }}>
            <div className="shop_gallery_side">
              <div className="gallery_main">
                {previewImages[previewIndex] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImages[previewIndex]} alt={previewWork.title} />
                ) : (
                  "NO IMAGE"
                )}
              </div>
              <div className="gallery_thumbs">
                {previewImages.map((img, i) => (
                  <button
                    key={img}
                    className={`thumb${i === previewIndex ? " active" : ""}`}
                    onClick={() => setPreviewIndex(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="shop_details_side">
              <h1
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  marginBottom: 15,
                }}
              >
                {previewWork.title}
              </h1>
              <p style={{ color: "#555", fontSize: 16, marginBottom: 30 }}>
                {previewWork.description}
              </p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 30 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 20,
                    letterSpacing: 1,
                    color: "var(--muted)",
                  }}
                >
                  SPECIFICATIONS AVAILABLE ON REQUEST
                </p>
                <button className="btn_main" onClick={() => openInquiry(previewWork)}>
                  REQUEST TO PURCHASE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inquiryWork && (
        <div className="overlay" style={{ display: "block" }}>
          <div className="form_container">
            <h2 style={{ fontWeight: 900, fontSize: 32, textTransform: "uppercase" }}>
              {inquiryWork.title}
            </h2>
            <div
              style={{
                margin: "30px 0",
                fontSize: 13,
                color: "#555",
                border: "1px solid var(--border)",
                padding: 25,
                background: "#fff",
                textAlign: "left",
                lineHeight: 1.6,
              }}
            >
              <p style={{ fontWeight: 900, color: "var(--ink)" }}>PRODUCTION DISCLAIMER</p>
              <p style={{ marginBottom: 15 }}>
                Every piece is made to order. Current lead time is 4 to 6 weeks.
              </p>
              <p style={{ fontWeight: 900, color: "var(--ink)" }}>WHAT HAPPENS NEXT</p>
              <p>We will contact you via email with a formal quote and delivery estimate.</p>
            </div>
            {inquirySent ? (
              <p style={{ fontWeight: 700, margin: "20px 0" }}>
                Request received. We&apos;ll be in touch by email.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInquirySent(true);
                }}
              >
                <input type="text" placeholder="FULL NAME" required />
                <input type="email" placeholder="EMAIL ADDRESS" required />
                <textarea placeholder="ANY CUSTOM PREFERENCES?" rows={4} />
                <button type="submit" className="btn_main" style={{ margin: "20px auto" }}>
                  SUBMIT REQUEST
                </button>
              </form>
            )}
            <p
              onClick={closeOverlays}
              style={{ marginTop: 20, cursor: "pointer", fontSize: 11, fontWeight: 700, opacity: 0.5 }}
            >
              [ CLOSE ]
            </p>
          </div>
        </div>
      )}
    </>
  );
}
