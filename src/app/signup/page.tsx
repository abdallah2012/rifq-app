import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "حساب جديد" };
export default function Page() {
  return (
    <main className="shell" style={{ maxWidth: 480, paddingBlock: "4rem" }}>
      <h1>ابدأ مع رِفق</h1>
      <p className="muted">بياناتك خاصة بك، ويمكنك تصديرها أو حذفها.</p>
      <AuthForm mode="signup" />
      <p>
        <Link href="/login">لدي حساب بالفعل</Link>
      </p>
    </main>
  );
}
