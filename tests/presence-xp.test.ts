import { describe, expect, it } from "vitest";
import { getPresenceProgress, PRESENCE_XP_REWARDS } from "@/lib/presence-xp";

describe("presence XP", () => {
  it("assigns 25 XP to a completed goal", () => expect(PRESENCE_XP_REWARDS.goal).toBe(25));
  it("starts at level one and reports the energy earned", () => expect(getPresenceProgress(35)).toEqual({ totalXp: 35, level: 1, energy: 35, energyToNextLevel: 65, energyPercent: 35 }));
  it("advances at each 100 XP without allowing negative totals", () => { expect(getPresenceProgress(200)).toMatchObject({ level: 3, energy: 0, energyToNextLevel: 100 }); expect(getPresenceProgress(-10)).toMatchObject({ totalXp: 0, level: 1 }); });
});
