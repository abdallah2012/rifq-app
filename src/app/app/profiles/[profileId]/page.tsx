import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, ClipboardCheck, History } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { estimateCycle, PHASE_CONFIG } from "@/domain/cycle";
import { DeviChart } from "@/components/devi-chart";
import { PhaseSummary } from "@/components/phase-system";
import { CycleTimeline } from "@/components/cycle-timeline";
import { PhaseOverview } from "@/components/phase-overview";

export default async function Page({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params;
  const auth = await requireUser();
  if (!auth) return null;
  const [{ data: profile }, { data: records }] = await Promise.all([
    auth.client.from("profiles").select("*").eq("id", profileId).maybeSingle(),
    auth.client.from("cycle_records").select("*").eq("profile_id", profileId).order("period_start_date"),
  ]);
  if (!profile) notFound();
  const estimate = estimateCycle(
    (records ?? []).map((record) => ({ periodStartDate: record.period_start_date, periodEndDate: record.period_end_date })),
    { expectedCycleLength: profile.expected_cycle_length, expectedPeriodLength: profile.expected_period_length, expectedLutealLength: profile.expected_luteal_length },
  );
  return (
    <section className="grid">
      <header className="page-header"><div><p className="eyebrow">الملف الشخصي</p><h1>{profile.display_name}</h1><p className="muted">تقدير اليوم وإرشاد عملي قابل للتعديل.</p></div><Link className="button ghost" href={`/app/profiles/${profile.id}/edit`}>إعدادات الملف</Link></header>
      {estimate ? (
        <>
          <div className="grid two">
            <PhaseSummary phase={estimate.phase} cycleDay={estimate.cycleDay} confidence={estimate.confidence} />
            <article className="card" style={{ padding: "1.25rem" }}><div className="page-header"><div><p className="eyebrow">المؤشرات الحالية</p><h2>DEVI</h2></div><span className="chip">{PHASE_CONFIG[estimate.phase].primary}</span></div><DeviChart values={PHASE_CONFIG[estimate.phase].devi} /></article>
          </div>
          <article className="card" style={{ padding: "1.25rem" }}><p className="eyebrow">المسار التقديري</p><h2>دورة المراحل</h2><CycleTimeline currentPhase={estimate.phase} cycleDay={estimate.cycleDay} /></article>
          <div className="grid two">
            <article className="card" style={{ padding: "1.25rem" }}><p className="eyebrow">قد يناسبها اليوم</p><h2>احتياجات مقترحة</h2><ul>{PHASE_CONFIG[estimate.phase].guidance.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="card" style={{ padding: "1.25rem" }}><p className="eyebrow">الإطار المقترح</p><h2>{PHASE_CONFIG[estimate.phase].frame}</h2><p>{PHASE_CONFIG[estimate.phase].state}</p><p className="muted">تحقق من تفضيلها أولاً؛ هذه إشارة تنظيمية وليست حكماً قطعياً.</p></article>
          </div>
        </>
      ) : <article className="card" style={{ padding: "1.5rem" }}><h2>لا توجد بيانات دورة بعد</h2><p className="muted">يمكنك استعراض النظام العام أو إضافة أول تاريخ للحصول على تقدير شخصي.</p><PhaseOverview /></article>}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}><Link className="button" href={`/app/profiles/${profile.id}/cycle`}><CalendarPlus size={18} aria-hidden="true" />بدأت الدورة</Link><Link className="button secondary" href={`/app/profiles/${profile.id}/check-in`}><ClipboardCheck size={18} aria-hidden="true" />تسجيل الحالة</Link><Link className="button ghost" href={`/app/profiles/${profile.id}/history`}><History size={18} aria-hidden="true" />السجل</Link></div>
      <p className="muted">التواريخ والمراحل المعروضة تقديرية، ولا يُستخدم التطبيق لتأكيد الإباضة أو منع الحمل أو التشخيص أو اتخاذ قرارات طبية.</p>
    </section>
  );
}
