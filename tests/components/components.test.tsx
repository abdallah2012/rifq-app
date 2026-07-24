import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeviChart } from "@/components/devi-chart";
import { CycleTimeline } from "@/components/cycle-timeline";
import { PhaseBadge, PhaseSummary } from "@/components/phase-system";
import { PhaseOverview } from "@/components/phase-overview";
import { RecommendationCard } from "@/components/recommendation-card";
import { ProfileCard } from "@/features/profiles/profile-card";

describe("infographic-inspired phase components", () => {
  it("shows phase number, icon label, and Arabic name", () => {
    render(<PhaseBadge phase="luteal" />);
    expect(
      screen.getByLabelText("المرحلة 4: الطور الأصفري"),
    ).toBeInTheDocument();
    expect(screen.getByText("الطور الأصفري")).toBeInTheDocument();
  });

  it("summarizes phase without relying on color", () => {
    render(<PhaseSummary phase="menstrual" cycleDay={3} confidence="medium" />);
    expect(screen.getByText("الاحتياج الأبرز")).toBeInTheDocument();
    expect(screen.getByText("الراحة والاحتواء والأمان")).toBeInTheDocument();
    expect(screen.getByText("متوسط")).toBeInTheDocument();
  });

  it("marks the current timeline step semantically", () => {
    render(<CycleTimeline currentPhase="ovulation" cycleDay={14} />);
    expect(
      screen.getByText("الإباضة").closest("[aria-current='step']"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("مسار الدورة؛ اليوم 14")).toBeInTheDocument();
  });

  it("provides accessible DEVI values and meanings", () => {
    render(<DeviChart values={{ D: 2, E: 5, V: 2, I: 5 }} />);
    expect(screen.getByLabelText("مؤشرات DEVI")).toBeInTheDocument();
    expect(screen.getByText("الاحتواء العاطفي")).toBeInTheDocument();
    expect(screen.getAllByText("5 من 5")).toHaveLength(2);
  });

  it("renders all four onboarding phases", () => {
    render(<PhaseOverview />);
    expect(screen.getByText("الحيض")).toBeInTheDocument();
    expect(screen.getByText("الطور الجرابي")).toBeInTheDocument();
    expect(screen.getByText("الإباضة")).toBeInTheDocument();
    expect(screen.getByText("الطور الأصفري")).toBeInTheDocument();
  });
});

describe("refined dashboard cards", () => {
  it("keeps profile cycle information together", () => {
    render(
      <ProfileCard
        profile={{
          id: "p1",
          display_name: "سارة",
          theme_color: "#286f66",
          expected_cycle_length: 28,
          expected_period_length: 5,
          expected_luteal_length: 14,
        }}
        records={[{ periodStartDate: "2026-07-01" }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "سارة" })).toBeInTheDocument();
    expect(screen.getByText("قد يناسبها اليوم")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "عرض التفاصيل" })).toHaveAttribute(
      "href",
      "/app/profiles/p1",
    );
  });

  it("renders recommendation metadata", () => {
    render(
      <RecommendationCard
        title="نزهة قصيرة"
        description="مشي هادئ"
        category="الخروج"
        minutes={30}
        budget="free"
        phase="follicular"
      />,
    );
    expect(screen.getByText("30 دقيقة")).toBeInTheDocument();
    expect(screen.getByText("بدون تكلفة")).toBeInTheDocument();
  });
});
