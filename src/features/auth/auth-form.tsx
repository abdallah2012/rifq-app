"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const supabase = createClient();
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/app/settings` });
        if (error) throw error; setMessage("إذا كان البريد مسجلاً فستصلك رسالة الاستعادة.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback?next=/app/onboarding` } });
        if (error) throw error; setMessage("تحقق من بريدك لإكمال إنشاء الحساب.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error; router.replace("/app"); router.refresh();
      }
    } catch { setMessage("تعذر إكمال الطلب. تحقق من البيانات وحاول مرة أخرى."); }
    finally { setPending(false); }
  }
  return (
    <form className="card grid" onSubmit={submit} style={{ padding: "1.5rem" }}>
      <label className="field">البريد الإلكتروني<input name="email" type="email" autoComplete="email" required /></label>
      {mode !== "forgot" && <label className="field">كلمة المرور<input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>}
      <button className="button" disabled={pending}>{pending ? "جارٍ المتابعة…" : mode === "login" ? "دخول" : mode === "signup" ? "إنشاء الحساب" : "إرسال رابط الاستعادة"}</button>
      <p aria-live="polite" className="muted">{message}</p>
    </form>
  );
}
