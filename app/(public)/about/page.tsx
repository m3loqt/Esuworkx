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
            ESUWORX is an independent art toy label founded by Ace de Leon, based in
            Manila and specializing in industrial grade resin sculptures. Every piece
            starts on the workbench — sculpted, cast, and hand painted in small
            batches rather than mass produced, which is why runs are limited and
            some pieces are made strictly to order.
          </p>
          <p style={{ marginBottom: 20 }}>
            The studio&apos;s work sits somewhere between collectible art toy and
            industrial object: charcoal and matte resin finishes, heavy-set forms,
            and a focus on physical presence over disposable novelty. Limited
            releases open for a fixed window, and once a run closes, that mold is
            retired for good — no reissues, no reprints.
          </p>
          <p>
            Outside of scheduled drops, the studio keeps a small standing shop of
            in-stock pieces, and takes on inquiry-based commissions for larger or
            bespoke work. You can follow new drops and behind-the-scenes process on
            Instagram at{" "}
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
