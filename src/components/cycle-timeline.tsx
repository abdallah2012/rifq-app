import { PHASE_CONFIG, type CyclePhase } from "@/domain/cycle";
import { PHASE_UI } from "./phase-system";

const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];

export function CycleTimeline({ currentPhase, cycleDay }: { currentPhase: CyclePhase; cycleDay: number }) {
  return (
    <div className="cycle-timeline" aria-label={`مسار الدورة؛ اليوم ${cycleDay}`}>
      {phases.map((phase, index) => {
        const ui = PHASE_UI[phase];
        const active = phase === currentPhase;
        return (
          <div className={`timeline-step ${ui.className}${active ? " is-active" : ""}`} key={phase} aria-current={active ? "step" : undefined}>
            <span className="timeline-step__node"><ui.Icon size={19} aria-hidden="true" /></span>
            <span className="timeline-step__label">{PHASE_CONFIG[phase].nameAr}</span>
            <span className="timeline-step__number">{index + 1}</span>
          </div>
        );
      })}
    </div>
  );
}
