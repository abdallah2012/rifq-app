import { PHASE_CONFIG, type CyclePhase } from "@/domain/cycle";
import { PHASE_UI } from "./phase-system";

const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];

export function PhaseOverview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`phase-overview${compact ? " is-compact" : ""}`}>
      {phases.map((phase) => {
        const ui = PHASE_UI[phase];
        const config = PHASE_CONFIG[phase];
        return (
          <article className={`phase-overview-card ${ui.className}`} key={phase}>
            <div className="phase-overview-card__head"><span>{ui.number}</span><ui.Icon aria-hidden="true" /></div>
            <h3>{config.nameAr}</h3>
            {!compact && <p>{ui.shortNeed}</p>}
            <small>DEVI: {config.primary} · {config.frame}</small>
          </article>
        );
      })}
    </div>
  );
}
