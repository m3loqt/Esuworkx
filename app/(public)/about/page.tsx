import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Esuworx is an independent art toy practice by Ace De Leon, a Philippine-based artist exploring childhood memories, companionship, and everyday moments through hand-finished sculpture.",
};

export default function AboutPage() {
  return (
    <div className="tab">
      <div style={{ maxWidth: 800, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
            marginBottom: 25,
          }}
        >
          The Studio
        </h1>

        <div style={{ textAlign: "left", color: "var(--muted)", fontSize: 16, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            ESUWORX is an independent art toy practice by Ace De Leon, a
            Philippine-based artist exploring childhood memories, quiet
            emotions, and the beauty of everyday moments through sculpture.
          </p>
          <p style={{ marginBottom: 20 }}>
            Inspired by nature, his dogs, and the small experiences we often
            overlook, each piece reflects themes of companionship, growth,
            curiosity, and finding comfort in uncertainty. Every sculpture is
            thoughtfully developed and meticulously hand-finished in small
            batches, making each release intentionally limited.
          </p>
          <p style={{ marginBottom: 20 }}>
            Rather than creating mass-produced collectibles, ESUWORX creates
            story-driven objects meant to be lived with, collected, and
            remembered. Each release is produced in limited quantities, while
            select works are offered as made-to-order or one-of-one pieces.
          </p>
          <p>
            New collections, process updates, and behind-the-scenes work are
            shared on Instagram at{" "}
            <a href="https://instagram.com/esuworx" target="_blank" rel="noreferrer">
              @esuworx
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
