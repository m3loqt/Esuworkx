"use client";

import { useState } from "react";

export default function ShopGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="shop_gallery_side">
      <div className="gallery_main">
        {images[activeIndex] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[activeIndex]} alt={alt} />
        ) : (
          "NO IMAGE"
        )}
      </div>
      <div className="gallery_thumbs">
        {images.map((img, i) => (
          <button
            key={img}
            className={`thumb${i === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`View ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
