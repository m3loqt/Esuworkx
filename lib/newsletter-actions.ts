"use server";

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

  await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();

  return { status: "success" };
}
