"use server";

import { inArray } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { paymentProofStore } from "@/lib/blobs";
import { orderPendingEmail } from "@/lib/order-email";
import { isAllowedImageFile, sanitizeFileName } from "@/lib/uploads";

export type CheckoutState = {
  status: "idle" | "error" | "success";
  message?: string;
};

type RequestedItem = { productId: number; quantity: number };

function parseRequestedItems(raw: string): RequestedItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i) =>
          i && Number.isInteger(i.productId) && Number.isInteger(i.quantity) && i.quantity > 0,
      )
      .map((i) => ({ productId: i.productId, quantity: i.quantity }));
  } catch {
    return [];
  }
}

export async function submitOrder(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const buyerName = String(formData.get("buyerName") ?? "").trim();
  const buyerEmail = String(formData.get("buyerEmail") ?? "").trim();
  const buyerPhone = String(formData.get("buyerPhone") ?? "").trim();
  const buyerAddress = String(formData.get("buyerAddress") ?? "").trim();
  const proofFile = formData.get("proofOfPayment");
  const requestedItems = parseRequestedItems(String(formData.get("items") ?? "[]"));

  if (
    !buyerName ||
    !buyerEmail ||
    !buyerPhone ||
    !buyerAddress ||
    requestedItems.length === 0 ||
    !(proofFile instanceof File) ||
    proofFile.size === 0
  ) {
    return {
      status: "error",
      message: "Please fill in all fields and attach a payment proof screenshot.",
    };
  }

  if (!isAllowedImageFile(proofFile)) {
    return {
      status: "error",
      message: "Payment proof must be an image file (JPG, PNG, WEBP, GIF, or HEIC).",
    };
  }

  const foundProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, requestedItems.map((i) => i.productId)));
  const productById = new Map(foundProducts.map((p) => [p.id, p]));

  const errors: string[] = [];
  for (const item of requestedItems) {
    const product = productById.get(item.productId);
    if (!product || product.status === "sold_out") {
      errors.push(`${product?.name ?? "An item in your cart"} is no longer available.`);
      continue;
    }
    if (item.quantity > product.stockCount) {
      errors.push(`Only ${product.stockCount} unit(s) of "${product.name}" left in stock.`);
    }
  }

  if (errors.length > 0) {
    return { status: "error", message: errors.join(" ") };
  }

  const key = `order-${Date.now()}-${sanitizeFileName(proofFile.name)}`;
  await paymentProofStore().set(key, await proofFile.arrayBuffer(), {
    metadata: { contentType: proofFile.type || "application/octet-stream" },
  });

  const [order] = await db
    .insert(orders)
    .values({
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      proofOfPaymentUrl: `/api/payment-proof/${encodeURIComponent(key)}`,
      status: "pending",
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    requestedItems.map((item) => {
      const product = productById.get(item.productId)!;
      return {
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    }),
  );

  const emailItems = requestedItems.map((item) => {
    const product = productById.get(item.productId)!;
    return { name: product.name, quantity: item.quantity, unitPrice: product.price };
  });

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (process.env.ADMIN_EMAIL) {
      try {
        const lines = emailItems.map((item) => `${item.quantity} x "${item.name}"`);
        await resend.emails.send({
          from: "ESUWORX Orders <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL,
          subject: `New order from ${buyerName}`,
          text: [
            `${buyerName} (${buyerEmail}, ${buyerPhone}) ordered:`,
            ...lines,
            "",
            "Shipping address:",
            buyerAddress,
            "",
            "Review and confirm this order in the admin panel.",
          ].join("\n"),
        });
      } catch (err) {
        console.error("Failed to send admin order notification email:", err);
      }
    }

    try {
      const buyerMail = orderPendingEmail({
        orderId: order.id,
        buyerName,
        buyerAddress,
        items: emailItems,
      });
      await resend.emails.send({
        from: "ESUWORX <onboarding@resend.dev>",
        to: buyerEmail,
        subject: buyerMail.subject,
        html: buyerMail.html,
        text: buyerMail.text,
      });
    } catch (err) {
      console.error("Failed to send buyer order-received email:", err);
    }
  }

  return { status: "success" };
}
