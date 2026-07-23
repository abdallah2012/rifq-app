import { PHASE_CONFIG, type CyclePhase } from "@/domain/cycle";
export function PhaseBadge({phase}:{phase:CyclePhase}) { const c=PHASE_CONFIG[phase]; return <span className="pill" style={{background:`color-mix(in srgb, ${c.color} 15%, white)`,color:c.color}}>{c.nameAr}</span>; }
