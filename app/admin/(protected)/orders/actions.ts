"use server";

import { logEmailResult } from "@/lib/email-log";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { CONTACT_EMAIL, orderCompletedEmail, orderConfirmedEmail, orderRejectedEmail } from "@/lib/order-email";

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
    logEmailResult("buyer order-confirmed email", await resend.emails.send({
      from: "ESUWORX <noreply@esuworx.shop>",
      to: confirmedOrder.buyerEmail,
      replyTo: CONTACT_EMAIL,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }));
  } catch (err) {
    console.error("Failed to send buyer order-confirmed email:", err);
  }
}

export async function rejectOrder(orderId: number, _formData: FormData): Promise<void> {
  // Same guard as confirm: only pending -> rejected, once, so a repeat click
  // never re-sends the email.
  const [rejectedOrder] = await db
    .update(orders)
    .set({ status: "rejected" })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending")))
    .returning();

  revalidatePath("/admin/orders");

  if (!rejectedOrder || !process.env.RESEND_API_KEY) return;

  try {
    const lineItems = await db
      .select({ item: orderItems, product: products })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const mail = orderRejectedEmail({
      orderId: rejectedOrder.id,
      buyerName: rejectedOrder.buyerName,
      buyerAddress: rejectedOrder.buyerAddress,
      items: lineItems.map(({ item, product }) => ({
        name: product?.name ?? "Item",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    logEmailResult("buyer order-rejected email", await resend.emails.send({
      from: "ESUWORX <noreply@esuworx.shop>",
      to: rejectedOrder.buyerEmail,
      replyTo: CONTACT_EMAIL,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }));
  } catch (err) {
    console.error("Failed to send buyer order-rejected email:", err);
  }
}

export async function completeOrder(orderId: number, _formData: FormData): Promise<void> {
  // Only confirmed -> completed, once. RETURNING makes a repeat click a no-op
  // so the buyer never gets the completion email twice.
  const [completedOrder] = await db
    .update(orders)
    .set({ status: "completed" })
    .where(and(eq(orders.id, orderId), eq(orders.status, "confirmed")))
    .returning();

  revalidatePath("/admin/orders");

  if (!completedOrder || !process.env.RESEND_API_KEY) return;

  try {
    const lineItems = await db
      .select({ item: orderItems, product: products })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const mail = orderCompletedEmail({
      orderId: completedOrder.id,
      buyerName: completedOrder.buyerName,
      buyerAddress: completedOrder.buyerAddress,
      items: lineItems.map(({ item, product }) => ({
        name: product?.name ?? "Item",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    logEmailResult("buyer order-completed email", await resend.emails.send({
      from: "ESUWORX <noreply@esuworx.shop>",
      to: completedOrder.buyerEmail,
      replyTo: CONTACT_EMAIL,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }));
  } catch (err) {
    console.error("Failed to send buyer order-completed email:", err);
  }
}
