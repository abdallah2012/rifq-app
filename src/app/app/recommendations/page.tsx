import { Lightbulb } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { RecommendationCard } from "@/components/recommendation-card";
import type { CyclePhase } from "@/domain/cycle";

export default async function Page() {
  const auth = await requireUser();
  if (!auth) return null;
  const { data } = await auth.client.from("activities").select("*").eq("is_active", true).limit(20);
  return (
    <section className="grid">
      <header className="page-header"><div><p className="eyebrow">أفكار قابلة للتخصيص</p><h1>اقتراحات عملية</h1><p className="muted">مبنية على المرحلة والبيانات السابقة. تحقق من تفضيلها أولاً.</p></div><Lightbulb size={30} color="var(--ovulation)" aria-hidden="true" /></header>
      <div className="grid two">{data?.map((activity) => <RecommendationCard key={activity.id} title={activity.title_ar} description={activity.description_ar} category={activity.category} minutes={activity.approximate_minutes} budget={activity.budget_level} phase={(activity.phase?.[0] as CyclePhase | undefined) ?? "follicular"} />)}</div>
    </section>
  );
}
