import { describe, expect, it } from "vitest";
import {
  calculateCycleLength,
  calculateMedianCycleLength,
  estimateCycle,
  estimateCurrentPhase,
  validateCycleDates,
} from "@/domain/cycle";
describe("cycle engine", () => {
  it("calculates boundaries across months", () =>
    expect(calculateCycleLength("2026-01-20", "2026-02-17")).toBe(28));
  it("uses robust median", () =>
    expect(
      calculateMedianCycleLength([
        { periodStartDate: "2026-01-01" },
        { periodStartDate: "2026-01-29" },
        { periodStartDate: "2026-02-26" },
        { periodStartDate: "2026-04-10" },
      ]),
    ).toBe(28));
  it("maps phase boundaries", () => {
    expect(estimateCurrentPhase(5, 28, 5)).toBe("menstrual");
    expect(estimateCurrentPhase(14, 28, 5)).toBe("ovulation");
    expect(estimateCurrentPhase(18, 28, 5)).toBe("luteal");
  });
  it("returns low confidence for first entry", () =>
    expect(
      estimateCycle(
        [{ periodStartDate: "2026-07-01" }],
        {},
        new Date("2026-07-10"),
      )?.confidence,
    ).toBe("low"));
  it("rejects future and duplicates", () =>
    expect(
      validateCycleDates(
        { periodStartDate: "2026-07-24" },
        [{ periodStartDate: "2026-07-24" }],
        new Date("2026-07-23"),
      ),
    ).toHaveLength(2));
  it("handles leap year", () =>
    expect(calculateCycleLength("2024-02-01", "2024-02-29")).toBe(28));
});
