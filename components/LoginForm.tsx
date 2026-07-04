"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { status: "idle" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="admin_form" style={{ margin: "0 auto" }}>
      <label className="admin_field_label" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        required
        autoFocus
        style={{ textAlign: "center" }}
      />

      {state.status === "error" && (
        <p style={{ color: "var(--brand_red)", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
          {state.message}
        </p>
      )}

      <button type="submit" className="admin_btn admin_btn_primary" style={{ width: "100%" }} disabled={isPending}>
        {isPending ? "Checking..." : "Log In"}
      </button>
    </form>
  );
}
