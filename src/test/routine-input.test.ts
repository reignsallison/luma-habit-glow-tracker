import { describe, expect, it } from "vitest";
import { routineInputSchema, routineSnapshot } from "@/lib/routine-input";

const state = { habits: [{ id: "h1", name: "Read", icon: "📖", color: "blue" as const }], waterGoal: 2500, calorieGoal: 2200,
  logs: { "2026-10-18": { habits: [], water: 500, calories: 0 }, "2026-10-19": { habits: ["h1"], water: 750, calories: 1200 }, "2026-11-01": { habits: [], water: 250, calories: 0 }, "2026-11-02": { habits: [], water: 0, calories: 0 } } };
describe("Routine log submission", () => {
  it("includes only the last 14 days, without inventing missing records", () => {
    expect(routineSnapshot(state, new Date("2026-11-01T12:00:00Z")).logs.map((log) => log.date)).toEqual(["2026-10-19", "2026-11-01"]);
  });
  it("keeps the user's real intake and habit values", () => {
    const snapshot = routineSnapshot(state, new Date("2026-11-01T12:00:00Z"));
    expect(snapshot.logs[0]).toEqual({ date: "2026-10-19", habits: ["h1"], water: 750, calories: 1200 });
    expect(snapshot.waterGoal).toBe(2500);
    expect(snapshot.calorieGoal).toBe(2200);
  });
  it("rejects invalid intake and oversized notes before calling AI", () => {
    const input = { ...routineSnapshot(state), focus: "balanced", context: "" };
    expect(routineInputSchema.safeParse({ ...input, context: "x".repeat(1001) }).success).toBe(false);
    expect(routineInputSchema.safeParse({ ...input, logs: [{ date: "2026-11-01", habits: [], water: -1, calories: 0 }] }).success).toBe(false);
  });
});