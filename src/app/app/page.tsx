import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { ProfileCard } from "@/features/profiles/profile-card";
import { PhaseOverview } from "@/components/phase-overview";

export default async function Dashboard() {
  const auth = await requireUser();
  if (!auth) return null;
  const [{ data: profiles }, { data: cycles }, { data: prefs }] =
    await Promise.all([
      auth.client
        .from("profiles")
        .select("*")
        .eq("is_archived", false)
        .order("created_at"),
      auth.client.from("cycle_records").select("*").order("period_start_date"),
      auth.client
        .from("notification_preferences")
        .select("privacy_mode")
        .is("profile_id", null)
        .maybeSingle(),
    ]);
  return (
    <section className="grid">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            {format(new Date(), "EEEE، d MMMM", { locale: ar })}
          </p>
          <h1>أهلاً بك في رِفق</h1>
          <p className="muted">ملخص هادئ لكل ملف، دون مقارنات.</p>
        </div>
        <Link className="button" href="/app/profiles/new">
          <Plus size={18} aria-hidden="true" />
          إضافة ملف
        </Link>
      </header>
      <PhaseOverview compact />
      {profiles?.length ? (
        <div className="dashboard-grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              privateMode={Boolean(prefs?.privacy_mode)}
              records={(cycles ?? [])
                .filter((cycle) => cycle.profile_id === profile.id)
                .map((cycle) => ({
                  periodStartDate: cycle.period_start_date,
                  periodEndDate: cycle.period_end_date,
                }))}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>ابدأ بملفك الأول</h2>
          <p className="muted">كل ملف مستقل ببياناته وملاحظاته.</p>
          <Link className="button" href="/app/profiles/new">
            إنشاء ملف
          </Link>
        </div>
      )}
    </section>
  );
}
