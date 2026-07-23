import { AuthForm } from "@/features/auth/auth-form";
export const metadata = { title: "استعادة الحساب" };
export default function Page() { return <main className="shell" style={{ maxWidth: 480, paddingBlock: "4rem" }}><h1>استعادة الحساب</h1><AuthForm mode="forgot" /></main>; }
