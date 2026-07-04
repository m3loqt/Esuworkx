const faqs = [
  {
    q: "How do time limited releases work?",
    a: "Edition drops are pre announced via our private list and open for a strict 24 hour window. The final edition size is determined entirely by the number of units secured during this period. Everyone who places an order on sale day gets a piece. Once the window closes, the mold is retired. We never reissue archived resin casts.",
  },
  {
    q: "When will my figure arrive?",
    a: "Because our time limited sculptures are hand poured and finished to order after the window closes, please allow a lead time of 6 to 8 weeks for production. Standard studio inventory ships within 5 to 7 business days. Tracking details are sent via email once your piece ships.",
  },
  {
    q: "How is shipping handled?",
    a: "Rates are calculated at checkout based on your destination. We use premium, high quality materials to ensure your art toys arrive flawlessly. A minimal surcharge is applied to cover these specialized packing components.",
  },
  {
    q: "What if my piece arrives damaged?",
    a: "Contact us immediately. Retain all original packaging for transit investigations. Email the studio with high resolution photos of the damage, and we will coordinate a solution.",
  },
  {
    q: "Do you accept returns?",
    a: "Due to the custom, made to order nature of our sculpts, we cannot accept returns on any pieces purchased during a time limited sale.",
  },
];

export default function FaqPage() {
  return (
    <div className="tab">
      <h1
        style={{
          fontSize: 32,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.5px",
          textAlign: "center",
          marginTop: 60,
        }}
      >
        Frequently Asked Questions
      </h1>
      <div className="faq_container">
        {faqs.map((item, i) => (
          <div
            className="faq_item"
            key={item.q}
            style={{
              borderTop: i === 0 ? "1px solid var(--border)" : undefined,
              borderBottom: i === faqs.length - 1 ? "none" : undefined,
            }}
          >
            <div className="faq_question">{item.q}</div>
            <div className="faq_answer">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
