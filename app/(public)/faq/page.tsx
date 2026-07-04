const faqs = [
  {
    q: "How do releases work?",
    a: "Each collection is announced in advance and made available for purchase during its release period. Most works are produced in limited editions or as made-to-order pieces, with edition sizes announced alongside each release. Once an edition is complete, it becomes part of the archive and is not reproduced.",
  },
  {
    q: "When will my order arrive?",
    a: "Production timelines vary depending on the collection. Made-to-order and pre-order pieces typically require 2–8 weeks to complete before shipping, while in-stock works are usually dispatched within 3–7 business days. You'll receive a shipping confirmation and tracking details via email once your order is on its way.",
  },
  {
    q: "How is shipping handled?",
    a: "Orders are shipped worldwide, with shipping costs calculated based on the destination. Delivery charges are shouldered by the collector. Each sculpture is securely packaged using premium protective materials, and tracking information is provided once your order has been dispatched.",
  },
  {
    q: "What if my piece arrives damaged?",
    a: "If your piece arrives damaged, please contact us within 48 hours of delivery. Include clear photos of the artwork, its packaging, and the shipping box. We'll review the situation and work with you to find the best possible solution.",
  },
  {
    q: "Do you accept returns?",
    a: "As each piece is produced in limited quantities or made to order, we do not accept returns or exchanges. If there is an issue with your order upon arrival, please contact us as soon as possible so we can assist you.",
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
