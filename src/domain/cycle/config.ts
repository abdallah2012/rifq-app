import type { CyclePhase } from "./types";

export const PHASE_CONFIG: Record<
  CyclePhase,
  {
    nameAr: string;
    guidance: string[];
    devi: Record<"D" | "E" | "V" | "I", number>;
    primary: string;
    state: string;
    frame: string;
    color: string;
  }
> = {
  menstrual: {
    nameAr: "الحيض",
    guidance: ["الراحة", "الاحتواء", "الأمان", "تخفيف الأعباء"],
    devi: { D: 2, E: 4, V: 1, I: 5 },
    primary: "I + E",
    state: "Recovery / Comfort",
    frame: "Calm Frame",
    color: "var(--menstrual)",
  },
  follicular: {
    nameAr: "الطور الجرابي",
    guidance: ["التجديد", "الانفتاح", "النشاط", "التواصل المرح"],
    devi: { D: 3, E: 3, V: 5, I: 4 },
    primary: "V",
    state: "Exploration",
    frame: "Fun Frame",
    color: "var(--follicular)",
  },
  ovulation: {
    nameAr: "الإباضة",
    guidance: ["المبادرة", "الثقة", "الحيوية", "القيادة الواضحة"],
    devi: { D: 5, E: 3, V: 4, I: 4 },
    primary: "D",
    state: "Sexual Selection",
    frame: "Dominant Frame",
    color: "var(--ovulation)",
  },
  luteal: {
    nameAr: "الطور الأصفري",
    guidance: ["الطمأنة", "التقدير", "الارتباط", "الدعم الهادئ"],
    devi: { D: 2, E: 5, V: 2, I: 5 },
    primary: "E + I",
    state: "Bonding & Security",
    frame: "Comfort Frame",
    color: "var(--luteal)",
  },
};
