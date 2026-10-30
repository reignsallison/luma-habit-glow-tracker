import { useSyncExternalStore } from "react";

export type Habit = { id: string; name: string; icon: string; color: "blue" | "violet" | "emerald" };
export type DayLog = { habits: string[]; water: number; calories: number };
export type State = {
  habits: Habit[];
  logs: Record<string, DayLog>;
  waterGoal: number;
  calorieGoal: number;
};

export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
export const shiftDay = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dayKey(d);
};

const seedHabits: Habit[] = [
  { id: "h1", name: "Morning meditation", icon: "🧘", color: "violet" },
  { id: "h2", name: "Read 20 pages", icon: "📖", color: "blue" },
  { id: "h3", name: "Workout 30 min", icon: "🏋️", color: "emerald" },
  { id: "h4", name: "No sugar", icon: "🍏", color: "emerald" },
  { id: "h5", name: "Journal", icon: "✍️", color: "blue" },
];

function seed(): State {
  const logs: Record<string, DayLog> = {};
  for (let i = 1; i <= 13; i++) {
    const r = (n: number) => Math.abs(Math.sin(i * 9.1 + n));
    logs[shiftDay(i)] = {
      habits: seedHabits.filter((_, j) => r(j) > 0.3).map((h) => h.id),
      water: 1200 + Math.round(r(7) * 1400 / 250) * 250,
      calories: 1600 + Math.round(r(11) * 700),
    };
  }
  logs[dayKey()] = { habits: ["h1"], water: 750, calories: 640 };
  return { habits: seedHabits, logs, waterGoal: 2500, calorieGoal: 2200 };
}

let state: State = seed();
const serverState = state;
const listeners = new Set<() => void>();
let userId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function notify() {
  listeners.forEach((l) => l());
}

function emit() {
  notify();
  if (!userId) return;
  const uid = userId;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("tracker_state").upsert({ user_id: uid, data: state as never, updated_at: new Date().toISOString() });
  }, 500);
}

function freshState(): State {
  return { habits: seedHabits, logs: {}, waterGoal: 2500, calorieGoal: 2200 };
}

/** Load the signed-in user's saved tracker and profile from the cloud. */
export async function bindUser(uid: string, email: string) {
  if (userId === uid) return;
  userId = uid;
  const { supabase } = await import("@/integrations/supabase/client");
  const [{ data: row }, { data: prof }] = await Promise.all([
    supabase.from("tracker_state").select("data").eq("user_id", uid).maybeSingle(),
    supabase.from("profiles").select("display_name").eq("id", uid).maybeSingle(),
  ]);
  const name = prof?.display_name || email.split("@")[0] || "Friend";
  profile.name = name;
  profile.handle = email;
  profile.avatar = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  state = (row?.data as State | undefined) ?? freshState();
  if (!row) emit();
  else notify();
}

export function unbindUser() {
  userId = null;
  state = seed();
  notify();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

export function today(s: State): DayLog {
  return s.logs[dayKey()] ?? { habits: [], water: 0, calories: 0 };
}

function setToday(fn: (d: DayLog) => DayLog) {
  const k = dayKey();
  state = { ...state, logs: { ...state.logs, [k]: fn(today(state)) } };
  emit();
}

export const actions = {
  toggleHabit(id: string) {
    setToday((d) => ({
      ...d,
      habits: d.habits.includes(id) ? d.habits.filter((h) => h !== id) : [...d.habits, id],
    }));
  },
  addHabit(name: string, icon: string, color: Habit["color"]) {
    state = { ...state, habits: [...state.habits, { id: crypto.randomUUID(), name, icon, color }] };
    emit();
  },
  removeHabit(id: string) {
    state = { ...state, habits: state.habits.filter((h) => h.id !== id) };
    emit();
  },
  addWater(ml: number) {
    setToday((d) => ({ ...d, water: Math.max(0, d.water + ml) }));
  },
  addCalories(kcal: number) {
    setToday((d) => ({ ...d, calories: Math.max(0, d.calories + kcal) }));
  },
};

/** A day counts toward the streak when every habit active that day is done (≥1 habit). */
export function streak(s: State) {
  let n = 0;
  const total = s.habits.length;
  if (!total) return 0;
  const done = (k: string) => (s.logs[k]?.habits.filter((h) => s.habits.some((x) => x.id === h)).length ?? 0) >= Math.ceil(total * 0.6);
  let i = done(dayKey()) ? 0 : 1;
  while (done(shiftDay(i))) {
    n++;
    i++;
  }
  return n;
}

export function lastDays(s: State, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const k = shiftDay(n - 1 - i);
    const l = s.logs[k] ?? { habits: [], water: 0, calories: 0 };
    const total = s.habits.length || 1;
    return {
      key: k,
      label: new Date(k + "T12:00:00").toLocaleDateString("en", { weekday: "short" }),
      habitPct: Math.round((l.habits.filter((h) => s.habits.some((x) => x.id === h)).length / total) * 100),
      water: l.water,
      calories: l.calories,
    };
  });
}

export const profile = {
  name: "Friend",
  handle: "",
  plan: "Pulse Free",
  avatar: "✦",
};
