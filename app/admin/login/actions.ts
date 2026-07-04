"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminPasswordHash } from "@/lib/admin-password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

export type LoginState = { status: "idle" | "error"; message?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const hash = getAdminPasswordHash();

  if (!hash) {
    return { status: "error", message: "Admin password is not configured." };
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return { status: "error", message: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}
