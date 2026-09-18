import { describe, expect, it } from "vitest";
import { calculateAlignedDaysRate, calculateCurrentStreak } from "@/lib/analytics/recovery";

describe("recovery analytics", () => {
  it("calcula streak por dia civil no fuso", () => { expect(calculateCurrentStreak([{ type: "start", occurredAt: "2026-09-13T23:30:00Z" }], new Date("2026-09-15T02:00:00Z"), "America/Sao_Paulo")).toBe(1); });
  it("reinicia a sequência a partir da recaída mais recente", () => { expect(calculateCurrentStreak([{ type: "start", occurredAt: "2026-09-01T12:00:00Z" }, { type: "relapse", occurredAt: "2026-09-14T12:00:00Z" }], new Date("2026-09-18T12:00:00Z"), "UTC")).toBe(4); });
  it("mostra zero no mesmo dia em que a recaída é registrada", () => { expect(calculateCurrentStreak([{ type: "start", occurredAt: "2026-09-01T12:00:00Z" }, { type: "relapse", occurredAt: "2026-09-18T08:00:00Z" }], new Date("2026-09-18T20:00:00Z"), "UTC")).toBe(0); });
  it("conta no máximo uma recaída por dia", () => { const result = calculateAlignedDaysRate(["2026-09-14T10:00:00Z", "2026-09-14T20:00:00Z"], new Date("2026-09-15T12:00:00Z"), "UTC"); expect(result.alignedDays).toBe(29); expect(result.rate).toBe(97); });
});
