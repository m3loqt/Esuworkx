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
          <td style="padding:14px 0;border-top:${i === 0 ? "none" : "1px solid #e8e8e5"};font-size:14px;font-weight:700;color:#111111;">
            ${escapeHtml(item.name)}
            <div style="font-size:12px;font-weight:400;color:#666666;margin-top:2px;">
              × ${item.quantity} — ${formatPrice(item.unitPrice)}
            </div>
          </td>
          <td style="padding:14px 0;border-top:${i === 0 ? "none" : "1px solid #e8e8e5"};font-size:14px;font-weight:700;color:#111111;text-align:right;white-space:nowrap;">
            ${formatPrice(String(Number(item.unitPrice) * item.quantity))}
          </td>
        </tr>`,
    )
    .join("");
}

function layout(opts: {
  badgeLabel: string;
  badgeYellow?: boolean;
  heading: string;
  bodyHtml: string;
  input: OrderEmailInput;
}): string {
  const { badgeLabel, badgeYellow, heading, bodyHtml, input } = opts;
  const badgeBg = badgeYellow ? "#ffea00" : "#111111";
  const badgeColor = badgeYellow ? "#111111" : "#ffffff";
  const total = itemsTotal(input.items);

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:32px 16px;background-color:#f0f0ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#fcfcfa;border:3px solid #111111;">
      <tr>
        <td style="background-color:#111111;padding:20px 28px;">
          <span style="font-size:18px;font-weight:900;letter-spacing:1px;color:#ffffff;text-transform:uppercase;">ESUWORX</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px 8px;">
          <span style="display:inline-block;background-color:${badgeBg};color:${badgeColor};border:2px solid #111111;font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;">
            ${escapeHtml(badgeLabel)}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 0;">
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
          <div style="border-top:2px solid #111111;padding-top:16px;">
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
          <div style="border-top:2px solid #111111;padding-top:14px;display:flex;justify-content:space-between;">
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
          <div style="border-top:1px solid #e8e8e5;padding-top:16px;font-size:12px;color:#666666;">
            <span style="font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.5px;">Shipping to</span>
            <div style="margin-top:4px;">${escapeHtml(input.buyerAddress)}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background-color:#111111;padding:16px 28px;">
          <span style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999999;">
            Independent art toy label · Manila
          </span>
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
    <strong>pending</strong> while the studio verifies your payment —
    we'll email you again the moment it's confirmed.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    "We've received your order and payment proof. It's now marked as PENDING while the studio verifies your payment — we'll email you again the moment it's confirmed.",
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name} — ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping to:",
    input.buyerAddress,
  ].join("\n");

  return {
    subject: `We've received your order — pending confirmation`,
    html: layout({ badgeLabel: "Pending", badgeYellow: true, heading, bodyHtml, input }),
    text,
  };
}

export function orderConfirmedEmail(input: OrderEmailInput): { subject: string; html: string; text: string } {
  const heading = "Order Confirmed";
  const bodyHtml = `
    Hi ${escapeHtml(input.buyerName)},<br /><br />
    Good news — we've verified your payment and confirmed your order.
    It's now being prepared for shipping.`;

  const text = [
    `Hi ${input.buyerName},`,
    "",
    "Good news — we've verified your payment and confirmed your order. It's now being prepared for shipping.",
    "",
    `Order #${input.orderId}`,
    ...input.items.map(
      (item) => `${item.quantity} x ${item.name} — ${formatPrice(String(Number(item.unitPrice) * item.quantity))}`,
    ),
    "",
    `Total: ${formatPrice(String(itemsTotal(input.items)))}`,
    "",
    "Shipping to:",
    input.buyerAddress,
  ].join("\n");

  return {
    subject: "Your order has been confirmed",
    html: layout({ badgeLabel: "Confirmed", heading, bodyHtml, input }),
    text,
  };
}
