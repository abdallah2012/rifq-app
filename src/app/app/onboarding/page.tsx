import Link from "next/link";
import { PhaseOverview } from "@/components/phase-overview";

const steps = [
  [
    "1",
    "خصوصيتك أولاً",
    "كل ملف مستقل، ويمكنك تصدير بياناتك أو حذفها متى شئت.",
  ],
  ["2", "أنشئ الملف الأول", "يكفي اسم عرض ولون يساعدانك على تمييزه."],
  [
    "3",
    "أضف الإعدادات المعتادة",
    "يمكن تعديل طول الدورة والحيض والانتظام لاحقاً.",
  ],
  ["4", "سجّل آخر بداية", "هذا الحقل اختياري، والتقديرات تتحسن مع السجل."],
  [
    "5",
    "اختر ما يناسبكما",
    "تتعلم الاقتراحات من التفضيلات والتقييمات الحتمية فقط.",
  ],
] as const;

export default function Page() {
  return (
    <section className="grid" style={{ maxWidth: 760, marginInline: "auto" }}>
      <header>
        <span
          className="pill"
          style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
        >
          مرحباً بك
        </span>
        <h1>ابدأ بهدوء وخصوصية</h1>
        <p className="muted">لن نطلب معلومات حميمة أو غير ضرورية.</p>
      </header>
      <div className="grid">
        {steps.map(([number, title, description]) => (
          <article
            className="card"
            key={number}
            style={{
              padding: "1rem 1.25rem",
              display: "grid",
              gridTemplateColumns: "2rem 1fr",
              gap: ".8rem",
            }}
          >
            <strong>{number}</strong>
            <div>
              <h2 style={{ marginTop: 0 }}>{title}</h2>
              <p className="muted">{description}</p>
            </div>
          </article>
        ))}
      </div>
      <div>
        <p className="eyebrow">كيف يقرأ رِفق الدورة؟</p>
        <h2>أربع مراحل، وإشارات مختلفة</h2>
        <p className="muted">
          يعرض رِفق الاحتياجات المحتملة بلغة تقديرية، مع لون ورقم واسم لكل
          مرحلة.
        </p>
        <PhaseOverview />
      </div>
      <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
        <Link className="button" href="/app/profiles/new">
          إنشاء الملف الأول
        </Link>
        <Link className="button ghost" href="/app">
          التخطي الآن
        </Link>
      </div>
      <p className="muted">
        التواريخ والمراحل تقديرية، ولا يُستخدم التطبيق لتأكيد الإباضة أو منع
        الحمل أو التشخيص أو اتخاذ قرارات طبية.
      </p>
    </section>
  );
}
