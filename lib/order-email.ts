import { formatPrice } from "@/lib/product";

export type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: string;
};

type OrderEmailInput = {
  orderId: number;
  buyerName: string;
  buyerAddress: string;
  items: OrderEmailItem[];
};

export const CONTACT_EMAIL = "collect@esuworx.shop";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemsTotal(items: OrderEmailItem[]): number {
  return items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
}

function itemRowsHtml(items: OrderEmailItem[]): string {
  return items
    .map(
      (item, i) => `
        <tr>
          <td style="padding:14px 0;border-top:${i === 0 ? "none" : "1px solid #e5e5e2"};font-size:14px;font-weight:700;color:#111111;">
            ${escapeHtml(item.name)}
            <div style="font-size:12px;font-weight:400;color:#666666;margin-top:2px;">
              Qty ${item.quantity} at ${formatPrice(item.unitPrice)} each
            </div>
          </td>
          <td style="padding:14px 0;border-top:${i === 0 ? "none" : "1px solid #e5e5e2"};font-size:14px;font-weight:700;color:#111111;text-align:right;white-space:nowrap;">
            ${formatPrice(String(Number(item.unitPrice) * item.quantity))}
          </td>
        </tr>`,
    )
    .join("");
}

function layout(opts: {
    heading: string;
  bodyHtml: string;
  input: OrderEmailInput;
  addressLabel?: string;
}): string {
  const { heading, bodyHtml, input, addressLabel = "Shipping address" } = opts;
  const total = itemsTotal(input.items);
  const year = new Date().getFullYear();

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:32px 16px;background-color:#f0f0ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e5e2;">
      <tr>
        <td style="background-color:#ffffff;padding:24px 28px 8px;">
          <span style="font-size:18px;font-weight:900;letter-spacing:1px;color:#111111;text-transform:uppercase;">ESUWORX</span>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 0;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#111111;">
            ${escapeHtml(heading)}
          </h1>
          <div style="font-size:14px;line-height:1.7;color:#111111;">
            ${bodyHtml}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 28px 0;">
          <div style="border-top:1px solid #e5e5e2;padding-top:16px;">
            <span style="font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:#666666;">
              Order #${input.orderId}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${itemRowsHtml(input.items)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 28px 0;">
          <div style="border-top:1px solid #e5e5e2;padding-top:14px;display:flex;justify-content:space-between;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;color:#111111;">Total</td>
                <td style="font-size:16px;font-weight:900;color:#111111;text-align:right;">${formatPrice(String(total))}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 32px;">
          <div style="border-top:1px solid #e5e5e2;padding-top:16px;font-size:12px;color:#666666;">
            <span style="font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(addressLabel)}</span>
            <div style="margin-top:4px;">${escapeHtml(input.buyerAddress)}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background-color:#f7f7f5;padding:20px 28px;border-top:1px solid #e5e5e2;text-align:center;font-size:12px;line-height:1.7;color:#666666;">
          Questions? <a href="mailto:${CONTACT_EMAIL}" style="color:#111111;">${CONTACT_EMAIL}</a><br />
          © ${year} Esuworx. Made in the Philippines.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function orderPendingEmail(input: OrderEmailInput): { subject: string; html: string; text: string } {
  const heading = "Order Received";
  const bodyHtml = `
    Hi ${escapeHtml(input.buyerName)},<br /><br />
    We've received your order and payment proof. It's now marked as
    <strong>pending</strong> while we verify your payment. We'll email you
    again as soon as it's confirmed.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    "We've received your order and payment proof. It's now marked as PENDING while we verify your payment. We'll email you again as soon as it's confirmed.",
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name}: ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping to:",
    input.buyerAddress,
    "",
    `Questions? ${CONTACT_EMAIL}`,
  ].join("\n");

  return {
    subject: "We've received your order, pending confirmation",
    html: layout({ heading, bodyHtml, input }),
    text,
  };
}

export function orderConfirmedEmail(input: OrderEmailInput): { subject: string; html: string; text: string } {
  const heading = "Order Confirmed";
  const bodyHtml = `
    Hi ${escapeHtml(input.buyerName)},<br /><br />
    Good news, we've verified your payment and confirmed your order.
    It's now being prepared for shipping.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    "Good news, we've verified your payment and confirmed your order. It's now being prepared for shipping.",
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name}: ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping to:",
    input.buyerAddress,
    "",
    `Questions? ${CONTACT_EMAIL}`,
  ].join("\n");

  return {
    subject: "Your order has been confirmed",
    html: layout({ heading, bodyHtml, input }),
    text,
  };
}

export function orderCompletedEmail(input: OrderEmailInput): { subject: string; html: string; text: string } {
  const heading = "Order Complete";
  const bodyHtml = `
    Hi ${escapeHtml(input.buyerName)},<br /><br />
    Your order is complete. Thank you for supporting Esuworx, we hope you
    love your piece. If anything isn't right, write to us at
    <a href="mailto:${CONTACT_EMAIL}" style="color:#111111;">${CONTACT_EMAIL}</a>.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    `Your order is complete. Thank you for supporting Esuworx, we hope you love your piece. If anything isn't right, write to us at ${CONTACT_EMAIL}.`,
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name}: ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping address:",
    input.buyerAddress,
    "",
    `Questions? ${CONTACT_EMAIL}`,
  ].join("\n");

  return {
    subject: "Your order is complete",
    html: layout({
      heading,
      bodyHtml,
      input,
    }),
    text,
  };
}

export function orderRejectedEmail(input: OrderEmailInput): { subject: string; html: string; text: string } {
  const heading = "Order Not Processed";
  const bodyHtml = `
    Hi ${escapeHtml(input.buyerName)},<br /><br />
    We weren't able to verify your payment, so we couldn't process this order.
    If you've already paid, please write to us at
    <a href="mailto:${CONTACT_EMAIL}" style="color:#111111;">${CONTACT_EMAIL}</a>
    with your order number and we'll sort it out.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    `We weren't able to verify your payment, so we couldn't process this order. If you've already paid, please write to us at ${CONTACT_EMAIL} with your order number and we'll sort it out.`,
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name}: ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping address:",
    input.buyerAddress,
    "",
    `Questions? ${CONTACT_EMAIL}`,
  ].join("\n");

  return {
    subject: "An update on your order",
    html: layout({ heading, bodyHtml, input }),
    text,
  };
}
