import { describe, expect, it } from "vitest";
import { PRIVATE_MILESTONES, isPrivateMilestoneId } from "@/lib/private-milestones";

describe("private milestones", () => {
  it("defines milestones for presence, self-care and conscious restart", () => {
    expect(Object.keys(PRIVATE_MILESTONES)).toEqual(["first_checkin", "seven_days_present", "three_sos_completed", "five_checkins_week", "conscious_restart"]);
  });

  it("accepts only private milestone identifiers", () => {
    expect(isPrivateMilestoneId("first_checkin")).toBe(true);
    expect(isPrivateMilestoneId("public_ranking")).toBe(false);
  });
});
