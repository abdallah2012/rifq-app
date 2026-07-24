import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/supabase/server";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await requireUser())) redirect("/login");
  return <AppShell>{children}</AppShell>;
}
