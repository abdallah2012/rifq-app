"use server";import{revalidatePath}from"next/cache";import{requireUser}from"@/lib/supabase/server";
export async function setPrivacyMode(formData:FormData){const a=await requireUser();if(!a)return;await a.client.from("notification_preferences").upsert({user_id:a.user.id,profile_id:null,privacy_mode:formData.get("enabled")==="on"},{onConflict:"user_id"});revalidatePath("/app");}
