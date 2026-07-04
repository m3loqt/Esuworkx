export type BarDatum = { label: string; value: number; color?: string; hint?: string };

export default function HorizontalBarChart({
  data,
  valueFormatter = (v: number) => String(v),
  emptyMessage = "No data yet.",
}: {
  data: BarDatum[];
  valueFormatter?: (v: number) => string;
  emptyMessage?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p style={{ color: "var(--muted)", fontSize: 13 }}>{emptyMessage}</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((d) => (
        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 150,
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              textAlign: "right",
              color: "var(--ink)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={d.hint ?? d.label}
          >
            {d.label}
          </div>
          <div style={{ flex: 1, background: "#f0efec", borderRadius: 4, height: 20 }}>
            <div
              title={`${d.label}: ${valueFormatter(d.value)}`}
              style={{
                width: `${d.value > 0 ? Math.max((d.value / max) * 100, 3) : 0}%`,
                background: d.color ?? "#2a78d6",
                height: "100%",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ width: 90, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
            {valueFormatter(d.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
