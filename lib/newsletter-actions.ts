"use server";

import { Resend } from "resend";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export type NewsletterState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const [inserted] = await db
    .insert(newsletterSubscribers)
    .values({ email })
    .onConflictDoNothing()
    .returning({ id: newsletterSubscribers.id });

  if (inserted && process.env.RESEND_API_KEY) {
    const adminEmails = process.env.ADMIN_EMAIL?.split(",")
      .map((addr) => addr.trim())
      .filter(Boolean);

    if (adminEmails && adminEmails.length > 0) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "ESUWORX Newsletter <noreply@esuworx.shop>",
          to: adminEmails,
          subject: "New newsletter subscriber",
          text: `${email} just subscribed to the newsletter.`,
        });
      } catch (err) {
        console.error("Failed to send newsletter subscriber notification email:", err);
      }
    }
  }

  return { status: "success" };
}
