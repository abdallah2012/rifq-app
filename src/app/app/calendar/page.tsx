import { CalendarDays, CircleDashed, Disc3 } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { PhaseLegend } from "@/components/phase-system";

export default async function Page() {
  const auth = await requireUser();
  if (!auth) return null;
  const { data } = await auth.client.from("cycle_records").select("id,period_start_date,period_end_date,profiles(display_name,theme_color)").order("period_start_date", { ascending: false }).limit(50);
  return (
    <section className="grid">
      <header className="page-header"><div><p className="eyebrow">نظرة شهرية</p><h1>التقويم</h1><p className="muted">فرّق دائماً بين ما سُجل وما هو متوقع.</p></div><CalendarDays size={30} color="var(--brand)" aria-hidden="true" /></header>
      <article className="card" style={{ padding: "1.25rem" }}>
        <h2>دليل المراحل</h2><PhaseLegend />
        <div className="recommendation-meta" style={{ marginTop: "1rem" }}><span><Disc3 size={15} aria-hidden="true" />مسجل</span><span><CircleDashed size={15} aria-hidden="true" />متوقع</span></div>
      </article>
      <article className="card" style={{ padding: "1.25rem" }}>
        <h2>السجلات الأخيرة</h2>
        {data?.length ? <div className="grid">{data.map((record) => <div key={record.id} style={{ borderInlineStart: "4px solid var(--menstrual)", borderBottom: "1px solid var(--border)", padding: ".75rem 1rem" }}><strong>{record.period_start_date}</strong><p className="muted">{record.period_end_date ? `حتى ${record.period_end_date}` : "بداية مسجلة"}</p></div>)}</div> : <p className="muted">ستظهر التواريخ هنا بعد إضافة أول سجل.</p>}
      </article>
    </section>
  );
}
