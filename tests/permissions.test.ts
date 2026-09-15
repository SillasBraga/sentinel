import { describe, expect, it } from "vitest";
import { canPartnerView, defaultAccountabilityPermissions } from "@/lib/permissions/accountability";
describe("accountability permissions", () => { it("mantém diário privado por padrão", () => { expect(canPartnerView(defaultAccountabilityPermissions, "journal")).toBe(false); expect(canPartnerView(defaultAccountabilityPermissions, "streak")).toBe(true); }); });
