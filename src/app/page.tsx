import Link from "next/link";

export default function WelcomePage() {
  return (
    <main>
      <header className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: "1.25rem" }}>
        <strong style={{ fontSize: "1.4rem" }}>رِفق <small className="muted">RIFQ</small></strong>
        <Link className="button secondary" href="/login">تسجيل الدخول</Link>
      </header>
      <section className="shell" style={{ minHeight: "72vh", display: "grid", alignContent: "center", gap: "1.5rem", paddingBlock: "3rem" }}>
        <span className="pill" style={{ width: "fit-content", background: "var(--brand-soft)", color: "var(--brand)" }}>خاص، هادئ، وتقديري</span>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", lineHeight: 1.05, maxWidth: "13ch", margin: 0 }}>اهتمام أنسب، في الوقت الأنسب.</h1>
        <p className="muted" style={{ fontSize: "1.2rem", lineHeight: 1.8, maxWidth: "56ch" }}>مساعد ذكي لفهم إيقاع العلاقة وتقديم الاهتمام المناسب في الوقت المناسب، مع الحفاظ على الخصوصية واحترام اختلاف كل شخص.</p>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link className="button" href="/signup">ابدأ بخصوصية</Link>
          <Link className="button ghost" href="/login">لدي حساب</Link>
        </div>
        <p className="muted" style={{ fontSize: ".86rem", maxWidth: "72ch" }}>التواريخ والمراحل تقديرية، ولا يُستخدم التطبيق لتأكيد الإباضة أو منع الحمل أو التشخيص أو اتخاذ قرارات طبية.</p>
      </section>
    </main>
  );
}
