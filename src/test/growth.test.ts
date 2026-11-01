import { describe, expect, it } from "vitest";
import { growthRules } from "@/lib/growth";
describe("Growth definitions", () => {
  it("counts a return only on a later UTC date", () => {
    expect(growthRules.isReturn("2026-11-01", "2026-11-01")).toBe(false);
    expect(growthRules.isReturn("2026-11-01", "2026-11-02")).toBe(true);
  });
  it("deduplicates repeated visits and sign-ins within one UTC day", () => {
    expect(growthRules.dailyKey("visit", "a", new Date("2026-11-01T01:00Z"))).toBe(
      growthRules.dailyKey("visit", "a", new Date("2026-11-01T23:00Z")),
    );
    expect(growthRules.dailyKey("login", "a", new Date("2026-11-01T23:00Z"))).not.toBe(
      growthRules.dailyKey("login", "a", new Date("2026-11-02T00:00Z")),
    );
  });
});
