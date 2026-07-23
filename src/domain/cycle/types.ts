export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";
export type Confidence = "low" | "medium" | "high";

export interface CycleRecord {
  periodStartDate: string;
  periodEndDate?: string | null;
}

export interface CycleSettings {
  expectedCycleLength?: number;
  expectedPeriodLength?: number;
  expectedLutealLength?: number;
}

export interface DateRange { start: Date; end: Date; }

export interface CycleEstimate {
  cycleDay: number;
  phase: CyclePhase;
  confidence: Confidence;
  nextPeriod: DateRange;
  ovulation: DateRange;
  phaseRanges: Record<CyclePhase, DateRange>;
  expectedCycleLength: number;
  expectedPeriodLength: number;
  irregular: boolean;
}
