"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product";
import CartLineItem from "./CartLineItem";

export default function CartModal() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  return (
    <div
      className={`cart_drawer_backdrop${isCartOpen ? " cart_drawer_visible" : ""}`}
      onClick={closeCart}
      aria-hidden={!isCartOpen}
    >
      <div className="cart_drawer_panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart_drawer_header">
          <h2 className="cart_title">Your Cart</h2>
          <button type="button" className="cart_close" onClick={closeCart} aria-label="Close cart">
            Close ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart_empty">Your cart is empty.</p>
        ) : (
          <>
            {items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                onQuantityChange={(quantity) => updateQuantity(item.productId, quantity)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
            <div className="cart_summary">
              <span>Subtotal</span>
              <span>{formatPrice(String(subtotal))}</span>
            </div>
            <Link href="/checkout" className="btn_main" onClick={closeCart}>
              PROCEED TO CHECKOUT
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
