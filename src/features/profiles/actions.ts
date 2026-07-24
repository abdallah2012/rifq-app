"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { profileSchema, cycleRecordSchema } from "./schemas";

export async function createProfile(_previous: { error?: string } | undefined, formData: FormData) {
  const auth = await requireUser(); if (!auth) redirect("/login");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من البيانات." };
  const p = parsed.data;
  const { data, error } = await auth.client.from("profiles").insert({
    user_id: auth.user.id, display_name: p.displayName, nickname: p.nickname || null,
    theme_color: p.themeColor, expected_cycle_length: p.expectedCycleLength,
    expected_period_length: p.expectedPeriodLength, expected_luteal_length: p.expectedLutealLength,
    cycle_regularity: p.cycleRegularity
  }).select("id").single();
  if (error || !data) return { error: "تعذر حفظ الملف. حاول مرة أخرى." };
  if (p.latestPeriodStart) await auth.client.from("cycle_records").insert({ user_id: auth.user.id, profile_id: data.id, period_start_date: p.latestPeriodStart });
  revalidatePath("/app"); redirect(`/app/profiles/${data.id}`);
}

export async function addCycleRecord(_previous: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const auth = await requireUser(); if (!auth) redirect("/login");
  const parsed = cycleRecordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من التواريخ." };
  const value = parsed.data;
  const { error } = await auth.client.from("cycle_records").insert({
    user_id: auth.user.id, profile_id: value.profileId, period_start_date: value.periodStartDate,
    period_end_date: value.periodEndDate || null, notes: value.notes || null
  });
  if (error?.code === "23505") return { error: "يوجد سجل بهذا التاريخ بالفعل." };
  if (error) return { error: "تعذر حفظ السجل." };
  revalidatePath(`/app/profiles/${value.profileId}`); return { success: true };
}
