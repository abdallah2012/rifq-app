import { DeleteAccountForm } from "@/features/privacy/delete-forms";
import { setPrivacyMode } from "@/features/privacy/actions";
import { requireUser } from "@/lib/supabase/server";

export default async function Page() {
  const auth = await requireUser();
  if (!auth) return null;
  const { data } = await auth.client.from("notification_preferences").select("privacy_mode").is("profile_id", null).maybeSingle();
  return (
    <section className="grid" style={{ maxWidth: 640 }}>
      <h1>الخصوصية</h1>
      <form action={setPrivacyMode} className="card grid" style={{ padding: "1.25rem" }}>
        <label style={{ display: "flex", gap: ".7rem" }}>
          <input name="enabled" type="checkbox" defaultChecked={Boolean(data?.privacy_mode)} />
          إخفاء تفاصيل لوحة التحكم افتراضياً
        </label>
        <button className="button">حفظ</button>
      </form>
      <p className="muted">لا تُرسل أسماء أو مراحل أو معلومات دورة في الإشعارات الافتراضية.</p>
      <DeleteAccountForm />
    </section>
  );
}
