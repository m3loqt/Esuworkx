"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { orderConfirmedEmail } from "@/lib/order-email";

export async function confirmOrder(orderId: number, _formData: FormData): Promise<void> {
  // Guard against double-processing: only flip pending -> confirmed once.
  // RETURNING tells us whether this call actually performed the flip, so a
  // second click (or a stale form resubmit) is a no-op instead of
  // double-decrementing stock or re-sending the confirmation email.
  const [confirmedOrder] = await db
    .update(orders)
    .set({ status: "confirmed" })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending")))
    .returning();

  if (confirmedOrder) {
    await db.execute(sql`
      UPDATE products
      SET stock_count = GREATEST(products.stock_count - oi.quantity, 0),
          status = CASE WHEN products.stock_count - oi.quantity <= 0 THEN 'sold_out' ELSE products.status END
      FROM order_items oi
      WHERE products.id = oi.product_id AND oi.order_id = ${orderId}
    `);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");

  if (!confirmedOrder || !process.env.RESEND_API_KEY) return;

  try {
    const lineItems = await db
      .select({ item: orderItems, product: products })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const mail = orderConfirmedEmail({
      orderId: confirmedOrder.id,
      buyerName: confirmedOrder.buyerName,
      buyerAddress: confirmedOrder.buyerAddress,
      items: lineItems.map(({ item, product }) => ({
        name: product?.name ?? "Item",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "ESUWORX <onboarding@resend.dev>",
      to: confirmedOrder.buyerEmail,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
  } catch (err) {
    console.error("Failed to send buyer order-confirmed email:", err);
  }
}

export async function rejectOrder(orderId: number, _formData: FormData): Promise<void> {
  await db
    .update(orders)
    .set({ status: "rejected" })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending")));

  revalidatePath("/admin/orders");
}
