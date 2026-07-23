import { notFound } from "next/navigation";
import { DeleteProfileForm } from "@/features/privacy/delete-forms";
import { requireUser } from "@/lib/supabase/server";
export default async function Page({params}:{params:Promise<{profileId:string}>}){const{profileId}=await params;const auth=await requireUser();if(!auth)return null;const{data}=await auth.client.from("profiles").select("display_name").eq("id",profileId).maybeSingle();if(!data)notFound();return <section style={{maxWidth:680}}><h1>إعدادات {data.display_name}</h1><DeleteProfileForm profileId={profileId}/></section>;}
