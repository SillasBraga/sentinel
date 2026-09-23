import { describe, expect, it } from "vitest";
import { canPartnerView, defaultAccountabilityPermissions } from "@/lib/permissions/accountability";
import { supportRequestMessages } from "@/lib/support-request-messages";
describe("accountability permissions", () => { it("mantém diário privado por padrão", () => { expect(canPartnerView(defaultAccountabilityPermissions, "journal")).toBe(false); expect(canPartnerView(defaultAccountabilityPermissions, "streak")).toBe(true); }); it("oferece pedidos neutros de apoio", () => { expect(supportRequestMessages).toHaveLength(3); expect(supportRequestMessages[0]).toContain("momento difícil"); }); });
