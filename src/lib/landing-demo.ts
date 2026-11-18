export const sampleHabitNames = ["Read 10 pages", "Move for 20 minutes", "Take a quiet moment", "Get to bed on time"];
export const initialSampleDay = () => ({ checked: [true, true, false, false], water: 1250, calories: 1450 });
export type SampleDay = ReturnType<typeof initialSampleDay>;
export function updateSampleDay(day: SampleDay, action: { kind: "habit"; index: number } | { kind: "water" } | { kind: "snack" }): SampleDay {
  if (action.kind === "habit") return { ...day, checked: day.checked.map((value, index) => index === action.index ? !value : value) };
  if (action.kind === "water") return { ...day, water: day.water + 250 };
  return { ...day, calories: day.calories + 150 };
}
export function sampleCoachTip(day: SampleDay) {
  const count = day.checked.filter(Boolean).length;
  const remaining = 2200 - day.calories;
  const food = remaining > 0 ? `${remaining.toLocaleString("en-US")} kcal remain in this example goal. A balanced meal with protein, vegetables and a satisfying carbohydrate could fit your day.` : "You’ve met this example calorie goal. Your hunger and individual needs matter more than a number; no need to skip meals.";
  const water = day.water >= 2500 ? "You’ve reached the sample water goal; drink according to thirst and your needs." : `${((2500 - day.water) / 1000).toFixed(2)} L to the sample water goal. Keep a glass nearby.`;
  const habit = count === 4 ? "All four habits complete. Celebrate a steady day, not a perfect week." : `${count} of 4 habits complete. Next, try ${sampleHabitNames[day.checked.findIndex((value) => !value)]?.toLowerCase()}.`;
  return `${habit} ${water} ${food}`;
}