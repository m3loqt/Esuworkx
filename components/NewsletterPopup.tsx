"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/newsletter-actions";

const initialState: NewsletterState = { status: "idle" };

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.status !== "success") return;
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, [state.status]);

  if (!visible) return null;

  return (
    <div className="newsletter_backdrop" onClick={() => setVisible(false)}>
      <div className="newsletter_card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="newsletter_close"
          onClick={() => setVisible(false)}
          aria-label="Close"
        >
          ✕
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="newsletter_image"
          src="/ui/newsletternew.svg"
          alt="ESUWORX mascots celebrating with a sealed letter"
        />

        {state.status === "success" ? (
          <>
            <h2 className="newsletter_title">You&apos;re In!</h2>
            <p className="newsletter_text">
              Welcome to the studio family! Keep an eye on your inbox
            </p>
          </>
        ) : (
          <>
            <h2 className="newsletter_title">For Collectors</h2>
            <p className="newsletter_text">
              Be the first to discover new collections, exhibition announcements,
              behind-the-scenes process, and occasional notes from the studio.
            </p>
            <form action={formAction} className="newsletter_form">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="checkout_input"
              />
              {state.status === "error" && <p className="newsletter_error">{state.message}</p>}
              <button
                type="submit"
                className="btn_main"
                style={{ maxWidth: "none" }}
                disabled={isPending}
              >
                {isPending ? "JOINING..." : "JOIN THE LIST"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
