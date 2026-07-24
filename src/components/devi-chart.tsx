const labels = {
  D: "القيادة الواثقة",
  E: "الاحتواء العاطفي",
  V: "التجدد والتنوع",
  I: "الاندماج والطمأنينة",
} as const;
export function DeviChart({
  values,
}: {
  values: Record<"D" | "E" | "V" | "I", number>;
}) {
  return (
    <div className="devi-chart" aria-label="مؤشرات DEVI">
      {(Object.keys(values) as (keyof typeof values)[]).map((key) => (
        <div className={`devi-item devi-${key.toLowerCase()}`} key={key}>
          <div className="devi-item__bar" aria-hidden="true">
            <span style={{ height: `${values[key] * 20}%` }} />
          </div>
          <strong>{key}</strong>
          <span className="devi-item__value">{values[key]} من 5</span>
          <small>{labels[key]}</small>
        </div>
      ))}
    </div>
  );
}
