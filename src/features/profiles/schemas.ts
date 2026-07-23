import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "أدخل اسماً للملف.").max(80),
  nickname: z.string().trim().max(80).optional(),
  themeColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  expectedCycleLength: z.coerce.number().int().min(15).max(60),
  expectedPeriodLength: z.coerce.number().int().min(1).max(12),
  expectedLutealLength: z.coerce.number().int().min(9).max(18),
  cycleRegularity: z.enum(["regular", "variable", "unknown"]),
  latestPeriodStart: z.string().date().optional().or(z.literal(""))
});

export const cycleRecordSchema = z.object({
  profileId: z.string().uuid(), periodStartDate: z.string().date(),
  periodEndDate: z.string().date().optional().or(z.literal("")), notes: z.string().max(2000).optional()
}).refine(v => !v.periodEndDate || v.periodEndDate >= v.periodStartDate, { message: "تاريخ النهاية يجب أن يلي البداية.", path: ["periodEndDate"] });
