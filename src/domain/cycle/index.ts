import { addDays, differenceInCalendarDays, isAfter, isBefore, parseISO, startOfDay, subDays } from "date-fns";
import type { Confidence, CycleEstimate, CyclePhase, CycleRecord, CycleSettings, DateRange } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const sortedStarts = (records: CycleRecord[]) => records.map(r => parseISO(r.periodStartDate)).sort((a, b) => a.getTime() - b.getTime());

export function calculateCycleLength(currentStart: string, nextStart: string): number {
  return differenceInCalendarDays(parseISO(nextStart), parseISO(currentStart));
}

export function cycleLengths(records: CycleRecord[]): number[] {
  const starts = sortedStarts(records);
  return starts.slice(1).map((date, i) => differenceInCalendarDays(date, starts[i])).filter(n => n >= 15 && n <= 60);
}

export function calculateAverageCycleLength(records: CycleRecord[]): number | null {
  const values = cycleLengths(records); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

export function calculateMedianCycleLength(records: CycleRecord[]): number | null {
  const values = cycleLengths(records).sort((a, b) => a - b);
  if (!values.length) return null;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}

export function calculateCycleVariability(records: CycleRecord[]): number {
  const values = cycleLengths(records);
  if (values.length < 2) return 0;
  return Math.max(...values) - Math.min(...values);
}

export function calculateAveragePeriodLength(records: CycleRecord[]): number | null {
  const lengths = records.flatMap(r => r.periodEndDate ? [differenceInCalendarDays(parseISO(r.periodEndDate), parseISO(r.periodStartDate)) + 1] : []).filter(n => n >= 1 && n <= 12);
  return lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : null;
}

export function estimateCurrentCycleDay(start: string, today = new Date()): number {
  return differenceInCalendarDays(startOfDay(today), parseISO(start)) + 1;
}

export function estimateOvulationWindow(start: string, cycleLength: number, lutealLength = 14, uncertainty = 1): DateRange {
  const center = addDays(parseISO(start), cycleLength - lutealLength - 1);
  return { start: subDays(center, uncertainty), end: addDays(center, uncertainty) };
}

export function estimatePhaseRanges(start: string, cycleLength: number, periodLength: number, lutealLength = 14, uncertainty = 1): Record<CyclePhase, DateRange> {
  const day1 = parseISO(start);
  const ovulation = estimateOvulationWindow(start, cycleLength, lutealLength, uncertainty);
  return {
    menstrual: { start: day1, end: addDays(day1, periodLength - 1) },
    follicular: { start: addDays(day1, periodLength), end: subDays(ovulation.start, 1) },
    ovulation,
    luteal: { start: addDays(ovulation.end, 1), end: addDays(day1, cycleLength - 1) }
  };
}

export function estimateCurrentPhase(day: number, cycleLength: number, periodLength: number, lutealLength = 14): CyclePhase {
  if (day <= periodLength) return "menstrual";
  const ovulationDay = cycleLength - lutealLength;
  if (day < ovulationDay - 1) return "follicular";
  if (day <= ovulationDay + 1) return "ovulation";
  return "luteal";
}

export function estimateNextPeriodDate(start: string, cycleLength: number, variability = 0): DateRange {
  const center = addDays(parseISO(start), cycleLength);
  const uncertainty = clamp(Math.ceil(variability / 2), 1, 7);
  return { start: subDays(center, uncertainty), end: addDays(center, uncertainty) };
}

export function detectPossiblyIrregularCycle(records: CycleRecord[]): boolean { return calculateCycleVariability(records) > 7; }

export function calculatePredictionConfidence(records: CycleRecord[], today = new Date()): Confidence {
  const completed = cycleLengths(records).length;
  if (completed < 2) return "low";
  const variability = calculateCycleVariability(records);
  const latest = sortedStarts(records).at(-1);
  const stale = !latest || differenceInCalendarDays(today, latest) > 90;
  const missingEnds = records.filter(r => !r.periodEndDate).length > records.length / 2;
  if (variability > 7 || stale) return "low";
  if (completed >= 5 && variability <= 3 && !missingEnds) return "high";
  return "medium";
}

export function validateCycleDates(record: CycleRecord, existing: CycleRecord[] = [], today = new Date()): string[] {
  const errors: string[] = [];
  const start = parseISO(record.periodStartDate);
  if (isAfter(start, startOfDay(today))) errors.push("لا يمكن أن يكون تاريخ البداية في المستقبل.");
  if (record.periodEndDate && isBefore(parseISO(record.periodEndDate), start)) errors.push("يجب أن تكون نهاية الحيض بعد البداية.");
  if (existing.some(r => r.periodStartDate === record.periodStartDate)) errors.push("يوجد سجل بهذا التاريخ بالفعل.");
  return errors;
}

export function estimateCycle(records: CycleRecord[], settings: CycleSettings = {}, today = new Date()): CycleEstimate | null {
  if (!records.length) return null;
  const latest = [...records].sort((a, b) => b.periodStartDate.localeCompare(a.periodStartDate))[0];
  const enough = cycleLengths(records).length >= 3;
  const cycleLength = Math.round(enough ? (calculateMedianCycleLength(records) ?? 28) : (settings.expectedCycleLength ?? 28));
  const periodLength = Math.round(calculateAveragePeriodLength(records) ?? settings.expectedPeriodLength ?? 5);
  const variability = calculateCycleVariability(records);
  const cycleDay = estimateCurrentCycleDay(latest.periodStartDate, today);
  const luteal = settings.expectedLutealLength ?? 14;
  return {
    cycleDay, phase: estimateCurrentPhase(cycleDay, cycleLength, periodLength, luteal),
    confidence: calculatePredictionConfidence(records, today),
    nextPeriod: estimateNextPeriodDate(latest.periodStartDate, cycleLength, variability),
    ovulation: estimateOvulationWindow(latest.periodStartDate, cycleLength, luteal, clamp(Math.ceil(variability / 4), 1, 4)),
    phaseRanges: estimatePhaseRanges(latest.periodStartDate, cycleLength, periodLength, luteal, clamp(Math.ceil(variability / 4), 1, 4)),
    expectedCycleLength: cycleLength, expectedPeriodLength: periodLength, irregular: detectPossiblyIrregularCycle(records)
  };
}

export * from "./types";
export { PHASE_CONFIG } from "./config";
