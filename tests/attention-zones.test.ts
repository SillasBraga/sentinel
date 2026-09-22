import { describe, expect, it } from "vitest";
import { summarizeAttentionZone } from "@/lib/attention-zones";

describe("attention zones", () => {
  it("summarizes only records associated with a zone", () => {
    expect(summarizeAttentionZone("night", [
      { attentionZoneId: "night", location: "Quarto", emotion: "Solidão", platform: null, strategy: "SOS" },
      { attentionZoneId: "night", location: "Quarto", emotion: "Tédio", platform: null, strategy: "SOS" },
      { attentionZoneId: "social", location: "Casa", emotion: "Estresse", platform: "Rede", strategy: "Power-up de proteção" },
    ])).toEqual({ frequency: 2, context: "Quarto", strategy: "SOS" });
  });
});
