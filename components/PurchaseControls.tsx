"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function PurchaseControls({
  productId,
  slug,
  name,
  image,
  price,
  maxQuantity,
}: {
  productId: number;
  slug: string;
  name: string;
  image: string | null;
  price: string;
  maxQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({ productId, slug, name, image, price, maxQuantity }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem({ productId, slug, name, image, price, maxQuantity }, quantity);
    router.push("/checkout");
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        Quantity ({maxQuantity} available)
      </label>
      <input
        type="number"
        min={1}
        max={maxQuantity}
        value={quantity}
        onChange={(e) => {
          const value = Number(e.target.value);
          const clamped = Number.isNaN(value) ? 1 : Math.min(Math.max(value, 1), maxQuantity);
          setQuantity(clamped);
        }}
        style={{ maxWidth: 120, textAlign: "left" }}
      />
      <div className="purchase_actions">
        <button type="button" onClick={handleBuyNow} className="btn_main">
          BUY NOW
        </button>
        <button type="button" onClick={handleAddToCart} className="btn_main btn_secondary">
          {added ? "ADDED ✓" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
