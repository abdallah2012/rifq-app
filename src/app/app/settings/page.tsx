import Link from "next/link";
export default function Page() {
  return (
    <section>
      <h1>الإعدادات</h1>
      <div className="grid two">
        <Link
          className="card"
          style={{ padding: "1.25rem" }}
          href="/app/settings/privacy"
        >
          <h2>الخصوصية</h2>
          <p className="muted">إخفاء التفاصيل والتحكم في البيانات.</p>
        </Link>
        <Link
          className="card"
          style={{ padding: "1.25rem" }}
          href="/app/settings/export"
        >
          <h2>تصدير البيانات</h2>
          <p className="muted">تنزيل نسخة JSON من بياناتك.</p>
        </Link>
      </div>
      <aside className="card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
        <h2>مهم</h2>
        <p>
          التواريخ والمراحل المعروضة تقديرية، وتعتمد على البيانات المسجلة. لا
          يُستخدم التطبيق لتأكيد الإباضة، أو منع الحمل، أو التشخيص، أو اتخاذ
          قرارات طبية.
        </p>
        <p>
          يعرض التطبيق إطار DEVI وThe Rational Male بوصفهما إطارين تنظيميّين
          للمحتوى، ولا يفترض أن جميع الأشخاص يستجيبون بالطريقة نفسها.
        </p>
      </aside>
    </section>
  );
}
