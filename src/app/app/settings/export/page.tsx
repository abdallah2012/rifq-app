export default function Page() {
  return (
    <section style={{ maxWidth: 640 }}>
      <h1>تصدير البيانات</h1>
      <div className="card" style={{ padding: "1.25rem" }}>
        <p>نزّل نسخة من كل بياناتك المملوكة بصيغة JSON.</p>
        <a className="button" href="/api/export" download>
          تنزيل النسخة
        </a>
      </div>
    </section>
  );
}
