import { Clock3, Coins, Heart } from "lucide-react";
import type { CyclePhase } from "@/domain/cycle";
import { PHASE_UI } from "./phase-system";

export function RecommendationCard({
  title,
  description,
  category,
  minutes,
  budget,
  phase = "follicular",
}: {
  title: string;
  description: string;
  category: string;
  minutes: number;
  budget: string;
  phase?: CyclePhase;
}) {
  const ui = PHASE_UI[phase];
  return (
    <article className={`recommendation-card ${ui.className}`}>
      <div className="recommendation-card__top"><span className="chip">{category}</span><Heart size={19} aria-hidden="true" /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="recommendation-meta">
        <span><Clock3 size={16} aria-hidden="true" />{minutes} دقيقة</span>
        <span><Coins size={16} aria-hidden="true" />{budget === "free" ? "بدون تكلفة" : budget === "low" ? "تكلفة منخفضة" : "تكلفة متوسطة"}</span>
      </div>
      <button className="button secondary">حفظ الاقتراح</button>
    </article>
  );
}
