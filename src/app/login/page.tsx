import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "الدخول" };
export default function Page() { return <main className="shell" style={{ maxWidth: 480, paddingBlock: "4rem" }}><h1>مرحباً بعودتك</h1><p className="muted">ادخل إلى مساحتك الخاصة.</p><AuthForm mode="login" /><p><Link href="/forgot-password">نسيت كلمة المرور؟</Link> · <Link href="/signup">حساب جديد</Link></p></main>; }
