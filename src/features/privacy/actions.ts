"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/server";

export async function setPrivacyMode(formData: FormData) {
  const auth = await requireUser();
  if (!auth) return;
  const privacyMode = formData.get("enabled") === "on";
  const { data: existing } = await auth.client.from("notification_preferences").select("id").eq("user_id", auth.user.id).is("profile_id", null).maybeSingle();
  if (existing) {
    await auth.client.from("notification_preferences").update({ privacy_mode: privacyMode }).eq("id", existing.id);
  } else {
    await auth.client.from("notification_preferences").insert({ user_id: auth.user.id, profile_id: null, privacy_mode: privacyMode });
  }
  revalidatePath("/app");
}
