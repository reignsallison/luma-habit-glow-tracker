import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Ring } from "@/components/AppShell";
import { actions, profile, streak, today, useStore, type Habit } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/habits")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Habits — Pulse Daily Tracker" },
      { name: "description", content: "Track daily habits, build streaks, and stay consistent with Pulse." },
      { property: "og:title", content: "Habits — Pulse Daily Tracker" },
      { property: "og:description", content: "Track daily habits, build streaks, and stay consistent with Pulse." },
    ],
  }),
  component: HabitsPage,
});

const colorCls: Record<Habit["color"], string> = {
  blue: "bg-neon-blue glow-blue",
  violet: "bg-neon-violet glow-violet",
  emerald: "bg-neon-emerald glow-emerald",
};

function HabitsPage() {
  const s = useStore();
  const t = today(s);
  const done = s.habits.filter((h) => t.habits.includes(h.id)).length;
  const pct = s.habits.length ? done / s.habits.length : 0;
  const st = streak(s);
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell title="Daily Habits" subtitle={`${greet}, ${profile.name.split(" ")[0]} ✦`}>
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <section className="glass p-6 flex flex-col items-center gap-5 animate-rise">
          <Ring pct={pct} size={180} gradient={["var(--neon-blue)", "var(--neon-violet)"]}>
            <div>
              <div className="font-display text-4xl font-bold">{Math.round(pct * 100)}%</div>
              <div className="text-xs text-muted-foreground">{done} of {s.habits.length} done</div>
            </div>
          </Ring>
          <div className="w-full flex items-center justify-between rounded-2xl bg-muted p-4">
            <div>
              <div className="text-xs text-muted-foreground">Current streak</div>
              <div className="font-display text-3xl font-bold text-gradient">{st} days</div>
            </div>
            <div className={`text-4xl ${st > 0 ? "animate-pop" : "opacity-40"}`} key={st}>🔥</div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Complete 60% of your habits to keep the streak alive.</p>
        </section>

        <section className="glass p-4 md:p-6 animate-rise" style={{ animationDelay: ".08s" }}>
          <ul className="flex flex-col gap-2">
            {s.habits.map((h) => (
              <HabitRow key={h.id} h={h} checked={t.habits.includes(h.id)} />
            ))}
          </ul>
          <AddHabit />
        </section>
      </div>
    </AppShell>
  );
}

function HabitRow({ h, checked }: { h: Habit; checked: boolean }) {
  const [tick, setTick] = useState(0);
  return (
    <li className={`group flex items-center gap-3 rounded-2xl p-3 transition ${checked ? "bg-accent" : "hover:bg-muted"}`}>
      <button
        aria-label={`Toggle ${h.name}`}
        onClick={() => { actions.toggleHabit(h.id); setTick((x) => x + 1); }}
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-border transition"
      >
        {checked && <span key={tick} className={`absolute inset-0 rounded-full ${colorCls[h.color]} animate-pop`} />}
        {checked && tick > 0 && <span key={`b${tick}`} className={`absolute inset-0 rounded-full ${colorCls[h.color]} animate-burst`} />}
        <span className={`relative font-bold ${checked ? "text-primary-foreground" : "text-transparent"}`}>✓</span>
      </button>
      <span className="text-xl">{h.icon}</span>
      <span className={`flex-1 font-medium transition ${checked ? "text-muted-foreground line-through" : ""}`}>{h.name}</span>
      <button aria-label={`Delete ${h.name}`} onClick={() => actions.removeHabit(h.id)}
        className="opacity-60 md:opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive px-2 transition">✕</button>
    </li>
  );
}

const icons = ["💧", "🏃", "🧘", "📖", "🥗", "😴", "💻", "🎯"];
function AddHabit() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState<Habit["color"]>("blue");
  return (
    <form className="mt-4 rounded-2xl border border-dashed border-border p-4 flex flex-col gap-3"
      onSubmit={(e) => { e.preventDefault(); if (name.trim()) { actions.addHabit(name.trim(), icon, color); setName(""); } }}>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit…" maxLength={40}
          className="flex-1 min-w-0 rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        <button className="rounded-xl bg-brand px-5 font-semibold text-primary-foreground glow-violet transition hover:scale-105 active:scale-95">Add</button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {icons.map((i) => (
          <button type="button" key={i} onClick={() => setIcon(i)}
            className={`h-9 w-9 rounded-lg transition ${icon === i ? "bg-accent ring-2 ring-ring" : "hover:bg-muted"}`}>{i}</button>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        {(["blue", "violet", "emerald"] as const).map((c) => (
          <button type="button" key={c} aria-label={c} onClick={() => setColor(c)}
            className={`h-6 w-6 rounded-full ${colorCls[c]} transition ${color === c ? "ring-2 ring-foreground scale-110" : "opacity-60"}`} />
        ))}
      </div>
    </form>
  );
}
