import { describe, it, expect } from "vitest";
import { initialSampleDay, sampleCoachTip, updateSampleDay } from "@/lib/landing-demo";
import { feedbackSchema } from "@/lib/feedback-input";

describe("Isolated visitor sample", () => {
  it("toggles sample habits without changing the starting state", () => {
    const initial = initialSampleDay();
    const changed = updateSampleDay(initial, { kind: "habit", index: 2 });
    expect(changed.checked).toEqual([true, true, true, false]);
    expect(initial.checked).toEqual([true, true, false, false]);
    expect(updateSampleDay(changed, { kind: "habit", index: 2 }).checked).toEqual(initial.checked);
  });
  it("adds exactly 250 ml and changes the coach’s hydration calculation", () => {
    const day = updateSampleDay(initialSampleDay(), { kind: "water" });
    expect(day.water).toBe(1500);
    expect(sampleCoachTip(day)).toContain("1.00 L");
  });
  it("logs a 150 kcal sample snack and recalculates remaining calories", () => {
    const day = updateSampleDay(initialSampleDay(), { kind: "snack" });
    expect(day.calories).toBe(1600);
    expect(sampleCoachTip(day)).toContain("600 kcal");
  });
  it("does not suggest skipped meals after the sample goal is exceeded", () => {
    expect(sampleCoachTip({ ...initialSampleDay(), calories: 2300 })).toContain("no need to skip meals");
  });
});
describe("Feedback validation", () => {
  it("accepts an email and substantive message", () => {
    expect(feedbackSchema.safeParse({ topic: "feedback", email: "visitor@example.com", message: "Please add a reading reminder." }).success).toBe(true);
  });
  it("rejects invalid addresses and short messages", () => {
    expect(feedbackSchema.safeParse({ topic: "feedback", email: "not-an-email", message: "Please add a reading reminder." }).success).toBe(false);
    expect(feedbackSchema.safeParse({ topic: "help", email: "visitor@example.com", message: "short" }).success).toBe(false);
  });
});