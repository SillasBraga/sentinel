import { describe, expect, it } from "vitest";
import { summarizeDailyMissions } from "@/lib/daily-missions";

describe("daily missions", () => {
  it("conta missões pendentes sem tratar o dia como concluído", () => {
    expect(summarizeDailyMissions({ checkinCompleted: true, habitCompleted: false, protectionCompleted: true })).toMatchObject({ completedCount: 2, isComplete: false });
  });

  it("conclui somente quando as três missões estiverem completas", () => {
    expect(summarizeDailyMissions({ checkinCompleted: true, habitCompleted: true, protectionCompleted: true })).toMatchObject({ completedCount: 3, isComplete: true });
  });
});
