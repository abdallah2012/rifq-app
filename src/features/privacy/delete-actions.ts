"use server";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

type DeleteState = { error?: string } | undefined;

export async function deleteProfile(
  _previous: DeleteState,
  formData: FormData,
) {
  const auth = await requireUser();
  if (!auth) redirect("/login");
  if (String(formData.get("confirmation")) !== "حذف الملف")
    return { error: "اكتب «حذف الملف» للتأكيد." };
  const { error } = await auth.client
    .from("profiles")
    .delete()
    .eq("id", String(formData.get("profileId")));
  if (error) return { error: "تعذر حذف الملف." };
  redirect("/app/profiles");
}

export async function deleteAccountData(
  _previous: DeleteState,
  formData: FormData,
) {
  const auth = await requireUser();
  if (!auth) redirect("/login");
  if (String(formData.get("confirmation")) !== "حذف كل بياناتي")
    return { error: "اكتب عبارة التأكيد كاملة." };
  const tables = [
    "activity_feedback",
    "profile_activity_preferences",
    "profile_phase_preferences",
    "daily_checkins",
    "cycle_records",
    "notification_preferences",
    "user_settings",
    "audit_events",
    "profiles",
  ] as const;
  for (const table of tables) {
    const { error } = await auth.client
      .from(table)
      .delete()
      .eq("user_id", auth.user.id);
    if (error) return { error: "لم يكتمل الحذف. حاول مرة أخرى." };
  }
  await auth.client.auth.signOut();
  redirect("/");
}
