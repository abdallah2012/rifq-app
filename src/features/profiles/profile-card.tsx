import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Eye, ShieldCheck } from "lucide-react";
import { estimateCycle, PHASE_CONFIG, type CycleRecord } from "@/domain/cycle";
import { PhaseBadge, PHASE_UI } from "@/components/phase-system";
import { CycleTimeline } from "@/components/cycle-timeline";

interface ProfileCardProps {
  profile: {
    id: string;
    display_name: string;
    theme_color: string;
    expected_cycle_length: number;
    expected_period_length: number;
    expected_luteal_length: number;
  };
  records: CycleRecord[];
  privateMode?: boolean;
}

export function ProfileCard({
  profile,
  records,
  privateMode = false,
}: ProfileCardProps) {
  const estimate = estimateCycle(records, {
    expectedCycleLength: profile.expected_cycle_length,
    expectedPeriodLength: profile.expected_period_length,
    expectedLutealLength: profile.expected_luteal_length,
  });
  if (privateMode) {
    return (
      <article className="card profile-card">
        <div className="profile-card__identity">
          <div className="profile-avatar">
            <ShieldCheck aria-hidden="true" />
          </div>
          <div>
            <h2>{profile.display_name}</h2>
            <p className="muted">التفاصيل مخفية حفاظاً على الخصوصية.</p>
          </div>
        </div>
        <Link className="button secondary" href={`/app/profiles/${profile.id}`}>
          <Eye size={17} aria-hidden="true" />
          إظهار التفاصيل
        </Link>
      </article>
    );
  }
  const phaseUi = estimate ? PHASE_UI[estimate.phase] : null;
  const confidence =
    estimate?.confidence === "low"
      ? "منخفض"
      : estimate?.confidence === "medium"
        ? "متوسط"
        : "مرتفع";
  return (
    <article className={`card profile-card ${phaseUi?.className ?? ""}`}>
      <div className="profile-card__head">
        <div className="profile-card__identity">
          <div className="profile-avatar">
            {profile.display_name.slice(0, 1)}
          </div>
          <h2>{profile.display_name}</h2>
        </div>
        {estimate && <PhaseBadge phase={estimate.phase} compact />}
      </div>
      {estimate ? (
        <>
          <div className="profile-card__metrics">
            <div>
              <span>اليوم</span>
              <strong>{estimate.cycleDay} من الدورة</strong>
            </div>
            <div>
              <span>التركيز</span>
              <strong>{PHASE_CONFIG[estimate.phase].primary}</strong>
            </div>
            <div>
              <span>الثقة</span>
              <strong>{confidence}</strong>
            </div>
          </div>
          <CycleTimeline
            currentPhase={estimate.phase}
            cycleDay={estimate.cycleDay}
          />
          <div className="phase-summary__need">
            <span>قد يناسبها اليوم</span>
            <strong>
              {PHASE_CONFIG[estimate.phase].guidance.slice(0, 2).join(" و")}
            </strong>
          </div>
          <p className="muted">
            الدورة القادمة المتوقعة:{" "}
            {format(estimate.nextPeriod.start, "d MMM", { locale: ar })} –{" "}
            {format(estimate.nextPeriod.end, "d MMM", { locale: ar })}
          </p>
        </>
      ) : (
        <div className="phase-summary__need">
          <span>لا توجد بيانات دورة</span>
          <strong>أضف تاريخ البداية للحصول على تقدير.</strong>
        </div>
      )}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        <Link className="button" href={`/app/profiles/${profile.id}/check-in`}>
          تسجيل الحالة
        </Link>
        <Link className="button secondary" href={`/app/profiles/${profile.id}`}>
          عرض التفاصيل
        </Link>
      </div>
    </article>
  );
}
