import {
  Droplets,
  MoonStar,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { PHASE_CONFIG, type Confidence, type CyclePhase } from "@/domain/cycle";

export const PHASE_UI: Record<
  CyclePhase,
  { number: number; Icon: LucideIcon; className: string; shortNeed: string }
> = {
  menstrual: {
    number: 1,
    Icon: Droplets,
    className: "phase-menstrual",
    shortNeed: "الراحة والاحتواء والأمان",
  },
  follicular: {
    number: 2,
    Icon: Sprout,
    className: "phase-follicular",
    shortNeed: "التجدد والانفتاح والنشاط",
  },
  ovulation: {
    number: 3,
    Icon: Sparkles,
    className: "phase-ovulation",
    shortNeed: "الثقة والحيوية والمبادرة",
  },
  luteal: {
    number: 4,
    Icon: MoonStar,
    className: "phase-luteal",
    shortNeed: "الطمأنة والتقدير والارتباط",
  },
};

export function PhaseBadge({
  phase,
  compact = false,
}: {
  phase: CyclePhase;
  compact?: boolean;
}) {
  const ui = PHASE_UI[phase];
  const phaseConfig = PHASE_CONFIG[phase];
  return (
    <span
      className={`phase-badge ${ui.className}`}
      aria-label={`المرحلة ${ui.number}: ${phaseConfig.nameAr}`}
    >
      <span className="phase-badge__number">{ui.number}</span>
      <ui.Icon size={compact ? 16 : 19} aria-hidden="true" />
      <span>{phaseConfig.nameAr}</span>
    </span>
  );
}

export function PhaseSummary({
  phase,
  cycleDay,
  confidence,
}: {
  phase: CyclePhase;
  cycleDay: number;
  confidence: Confidence;
}) {
  const ui = PHASE_UI[phase];
  const config = PHASE_CONFIG[phase];
  const confidenceAr =
    confidence === "low"
      ? "منخفض"
      : confidence === "medium"
        ? "متوسط"
        : "مرتفع";
  return (
    <article className={`phase-summary ${ui.className}`}>
      <div className="phase-summary__head">
        <div className="phase-icon">
          <ui.Icon aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">المرحلة الحالية المتوقعة</p>
          <h2>{config.nameAr}</h2>
          <p>اليوم {cycleDay} من الدورة</p>
        </div>
        <span className="phase-number" aria-hidden="true">
          {ui.number}
        </span>
      </div>
      <div className="phase-summary__need">
        <span>الاحتياج الأبرز</span>
        <strong>{ui.shortNeed}</strong>
      </div>
      <dl className="phase-facts">
        <div>
          <dt>الحالة</dt>
          <dd>{config.state}</dd>
        </div>
        <div>
          <dt>الإطار</dt>
          <dd>{config.frame}</dd>
        </div>
        <div>
          <dt>التركيز</dt>
          <dd>{config.primary}</dd>
        </div>
        <div>
          <dt>الثقة</dt>
          <dd>{confidenceAr}</dd>
        </div>
      </dl>
    </article>
  );
}

export function PhaseLegend() {
  return (
    <div className="phase-legend" aria-label="دليل ألوان المراحل">
      {(Object.keys(PHASE_UI) as CyclePhase[]).map((phase) => (
        <PhaseBadge key={phase} phase={phase} compact />
      ))}
    </div>
  );
}
