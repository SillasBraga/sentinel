import { describe, expect, it } from "vitest";
import { calculateRiskScore, isTimeInRiskWindow } from "@/lib/risk-engine";

describe("calculateRiskScore", () => {
  it("é explicável e limitado a 100", () => { const result = calculateRiskScore({ isRiskHour: true, mood: 1, recentUrge: 9, isAlone: true, hoursSinceCheckin: 48, isRiskWeekday: true }); expect(result.score).toBe(90); expect(result.level).toBe("critical"); expect(result.factors).toHaveLength(6); });
  it("não inventa risco sem fatores", () => { expect(calculateRiskScore({ hoursSinceCheckin: 2 })).toEqual({ score: 0, level: "low", factors: [] }); });
  it("reconhece janelas que atravessam a meia-noite",()=>{expect(isTimeInRiskWindow("23:40","22:00","01:00")).toBe(true);expect(isTimeInRiskWindow("00:30","22:00","01:00")).toBe(true);expect(isTimeInRiskWindow("15:00","22:00","01:00")).toBe(false)});
});
