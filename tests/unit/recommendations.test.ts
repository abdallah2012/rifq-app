import { expect, it } from "vitest";
import { rankRecommendations } from "@/domain/recommendations";
it("penalizes rejected activities deterministically", () => {
  const a = {
    id: "a",
    phase: ["luteal" as const],
    energy: "low" as const,
    minutes: 10,
    budget: "free" as const,
    indoorOutdoor: "indoor" as const,
  };
  const b = { ...a, id: "b" };
  expect(
    rankRecommendations([a, b], { phase: "luteal", rejectedIds: ["a"] })[0]
      .activity.id,
  ).toBe("b");
});
