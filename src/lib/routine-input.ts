import { z } from "zod";
import type { State } from "@/lib/store";

export const routineInputSchema = z.object({
  focus: z.enum(["balanced", "habits", "hydration"]),
  context: z.string().trim().max(1000),
  waterGoal: z.number().finite().positive().max(20000),
  calorieGoal: z.number().finite().positive().max(20000),
  habits: z.array(z.object({ id: z.string().max(100), name: z.string().min(1).max(100) })).max(100),
  logs: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    habits: z.array(z.string().max(100)).max(100),
    water: z.number().finite().min(0).max(100000),
    calories: z.number().finite().min(0).max(100000),
  })).max(14),
});
export type RoutineInput = z.infer<typeof routineInputSchema>;

export function routineSnapshot(state: State, now = new Date()) {
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 13);
  const from = start.toISOString().slice(0, 10);
  return {
    habits: state.habits.map(({ id, name }) => ({ id, name })),
    waterGoal: state.waterGoal,
    calorieGoal: state.calorieGoal,
    logs: Object.entries(state.logs).filter(([date]) => date >= from && date <= end)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, log]) => ({ date, ...log })),
  };
}

export type RoutineEvent =
  | { type: "text" | "reasoning"; text: string }
  | { type: "error"; message: string }
  | { type: "done" };