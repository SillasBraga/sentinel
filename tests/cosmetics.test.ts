import { describe, expect, it } from "vitest";
import { getCosmeticCollection, isCosmeticStyle } from "@/lib/cosmetics";

describe("cosmetic collection", () => {
  it("starts with only the base environment available", () => {
    expect(getCosmeticCollection(0).map(({ id, unlocked }) => ({ id, unlocked }))).toEqual([
      { id: "base", unlocked: true },
      { id: "aurora", unlocked: false },
      { id: "constellation", unlocked: false },
    ]);
  });

  it("unlocks visual environments from accumulated presence only", () => {
    expect(getCosmeticCollection(100)[1]?.unlocked).toBe(true);
    expect(getCosmeticCollection(299)[2]?.unlocked).toBe(false);
    expect(getCosmeticCollection(300)[2]?.unlocked).toBe(true);
  });

  it("accepts only catalog styles", () => {
    expect(isCosmeticStyle("aurora")).toBe(true);
    expect(isCosmeticStyle("coins")).toBe(false);
  });
});
