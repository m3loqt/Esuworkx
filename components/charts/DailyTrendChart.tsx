export type DailyDatum = { day: string; count: number };

const MAX_BAR_HEIGHT = 96;

export default function DailyTrendChart({ data }: { data: DailyDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const allZero = data.every((d) => d.count === 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: MAX_BAR_HEIGHT }}>
        {data.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.count} order${d.count === 1 ? "" : "s"}`}
            style={{
              flex: 1,
              height: d.count > 0 ? Math.max((d.count / max) * MAX_BAR_HEIGHT, 6) : 2,
              background: d.count > 0 ? "#2a78d6" : "#e1e0d9",
              borderRadius: "3px 3px 0 0",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
        {data.map((d, i) => (
          <div key={d.day} style={{ flex: 1, fontSize: 9, color: "var(--muted)", textAlign: "center" }}>
            {i % 2 === 0 ? d.day.slice(5) : ""}
          </div>
        ))}
      </div>
      {allZero && (
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 10 }}>
          No orders in the last 14 days.
        </p>
      )}
    </div>
  );
}
