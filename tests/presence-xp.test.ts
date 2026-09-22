import { describe, expect, it } from "vitest";
import { getPresenceProgress, PRESENCE_XP_REWARDS, xpRequiredForLevel } from "@/lib/presence-xp";

describe("presence XP", () => {
  it("assigns 25 XP to a completed goal", () => expect(PRESENCE_XP_REWARDS.goal).toBe(25));
  it("starts at level one and reports the energy earned", () => expect(getPresenceProgress(35)).toEqual({ totalXp: 35, level: 1, energy: 35, energyNeeded: 100, energyToNextLevel: 65, energyPercent: 35 }));
  it("raises XP needed at every level without allowing negative totals", () => { expect(xpRequiredForLevel(2)).toBe(100); expect(xpRequiredForLevel(3)).toBe(300); expect(getPresenceProgress(300)).toMatchObject({ level: 3, energy: 0, energyNeeded: 300 }); expect(getPresenceProgress(-10)).toMatchObject({ totalXp: 0, level: 1 }); });
});
