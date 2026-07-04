"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitOrder, type CheckoutState } from "@/app/(public)/checkout/actions";
import { paymentMethods } from "@/lib/payment-methods";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product";
import CartLineItem from "./CartLineItem";
import FileDropzone from "./FileDropzone";

const initialState: CheckoutState = { status: "idle" };

export default function CheckoutForm() {
  const { items, subtotal, clear } = useCart();
  const [activeMethod, setActiveMethod] = useState<(typeof paymentMethods)[number]>(
    paymentMethods[0],
  );
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);

  useEffect(() => {
    if (state.status === "success") clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="order_success_backdrop">
        <div className="order_success_card">
          <div className="order_success_icon">✓</div>
          <p className="order_success_title">Order received.</p>
          <p className="order_success_text">
            We&apos;ll verify and confirm your order shortly.
          </p>
          <Link href="/shop" className="btn_main" style={{ margin: "10px auto 0" }}>
            BACK TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="form_container" style={{ margin: "60px auto" }}>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>Your cart is empty.</p>
        <Link href="/shop" className="btn_main" style={{ margin: "0 auto" }}>
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="shop_container">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        )}
      />

      <div className="shop_gallery_side">
        <h2
          style={{
            fontWeight: 900,
            fontSize: 36,
            letterSpacing: "-1px",
            textTransform: "uppercase",
            marginBottom: 25,
          }}
        >
          CHECKOUT
        </h2>

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
          }}
        >
          Review Your Cart
        </div>

        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}

        <div className="cart_summary">
          <span>Total</span>
          <span>{formatPrice(String(subtotal))}</span>
        </div>

        <div className="checkout_subheading">Shipping Information</div>

        <div className="checkout_field">
          <label className="checkout_label" htmlFor="buyerName">
            Full Name <span className="checkout_required">*</span>
          </label>
          <input
            id="buyerName"
            className="checkout_input"
            type="text"
            name="buyerName"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="checkout_row">
          <div className="checkout_field">
            <label className="checkout_label" htmlFor="buyerEmail">
              Email Address <span className="checkout_required">*</span>
            </label>
            <input
              id="buyerEmail"
              className="checkout_input"
              type="email"
              name="buyerEmail"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="checkout_field">
            <label className="checkout_label" htmlFor="buyerPhone">
              Contact Number <span className="checkout_required">*</span>
            </label>
            <input
              id="buyerPhone"
              className="checkout_input"
              type="tel"
              name="buyerPhone"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div className="checkout_field">
          <label className="checkout_label" htmlFor="buyerAddress">
            Full Address <span className="checkout_required">*</span>
          </label>
          <input
            id="buyerAddress"
            className="checkout_input"
            type="text"
            name="buyerAddress"
            placeholder="Enter full address"
            required
          />
        </div>
      </div>

      <div className="shop_details_side">
        <div className="payment_box">
          <div className="payment_title">SECURE QR GATEWAY SCANNER</div>
          <div className="payment_row">
            <span>ACCOUNT NAME</span>
            <span>ESUWORX STUDIO</span>
          </div>

          <div className="qr_selector">
            <div className="qr_wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="qr_graphic"
                src={activeMethod.qrImage}
                alt={`Scan to pay via ${activeMethod.label}`}
              />
            </div>
            <div className="qr_options">
              {paymentMethods.map((method) => (
                <button
                  type="button"
                  key={method.key}
                  className={`qr_option${method.key === activeMethod.key ? " active" : ""}`}
                  onClick={() => setActiveMethod(method)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)", marginTop: 10, letterSpacing: 0.5 }}>
            SCAN CODE TO INITIATE TRANSFER
          </p>

          <div className="payment_title" style={{ marginTop: 25 }}>
            UPLOAD PROOF OF PAYMENT
          </div>
          <FileDropzone name="proofOfPayment" accept="image/*" required />

          <p className="payment_notice">
            * After paying, attach your payment screenshot above. Your order is
            logged as pending until the studio verifies payment and confirms it.
          </p>
        </div>

        {state.status === "error" && (
          <p style={{ color: "var(--brand_red)", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
            {state.message}
          </p>
        )}

        <button type="submit" className="btn_main" style={{ maxWidth: "none" }} disabled={isPending}>
          {isPending ? "GENERATING INVOICE..." : "COMPLETE PURCHASE"}
        </button>
        <Link
          href="/shop"
          style={{ display: "block", marginTop: 20, cursor: "pointer", fontSize: 11, fontWeight: 700, opacity: 0.5 }}
        >
          [ CANCEL ]
        </Link>
      </div>
    </form>
  );
}
