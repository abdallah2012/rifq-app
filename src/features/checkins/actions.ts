"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/server";

type CheckinState = { error?: string; success?: boolean } | undefined;

export async function saveCheckin(_previous: CheckinState, formData: FormData) {
  const auth = await requireUser();
  if (!auth) return { error: "انتهت الجلسة. سجّل الدخول مجدداً." };
  const profileId = String(formData.get("profileId"));
  const payload = {
    user_id: auth.user.id,
    profile_id: profileId,
    checkin_date: new Date().toISOString().slice(0, 10),
    energy_level: formData.get("energy") || null,
    mood: formData.get("mood") || null,
    communication_desire: formData.get("communication") || null,
    discomfort_level: formData.get("discomfort") || null,
    preferred_mode: formData.get("mode") || null,
    available_minutes: Number(formData.get("minutes")) || null,
    budget_level: formData.get("budget") || null,
    notes: formData.get("notes") || null,
  };
  const { error } = await auth.client
    .from("daily_checkins")
    .upsert(payload, { onConflict: "profile_id,checkin_date" });
  if (error) return { error: "تعذر حفظ الحالة." };
  revalidatePath(`/app/profiles/${profileId}`);
  return { success: true };
}
