import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Ring } from "@/components/AppShell";
import { actions, today, useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/intake")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Water & Calories — Pulse Daily Tracker" },
      { name: "description", content: "Log water and calories with animated progress rings." },
      { property: "og:title", content: "Water & Calories — Pulse Daily Tracker" },
      { property: "og:description", content: "Log water and calories with animated progress rings." },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  const s = useStore();
  const t = today(s);
  const [kcal, setKcal] = useState("");
  const wPct = t.water / s.waterGoal;
  const cPct = t.calories / s.calorieGoal;

  return (
    <AppShell title="Water & Calories" subtitle="Fuel your day">
      <div className="grid gap-5 md:grid-cols-2">
        <section className="glass p-6 flex flex-col items-center gap-5 animate-rise">
          <div className="self-start">
            <h2 className="text-xl font-semibold">Hydration</h2>
            <p className="text-sm text-muted-foreground">Goal {s.waterGoal / 1000} L</p>
          </div>
          <Ring pct={wPct} size={200} stroke={16} gradient={["var(--neon-emerald)", "var(--neon-blue)"]}>
            <div>
              <div className="text-3xl">💧</div>
              <div className="font-display text-3xl font-bold">{(t.water / 1000).toFixed(2)}L</div>
              <div className="text-xs text-muted-foreground">{Math.round(wPct * 100)}% of goal</div>
            </div>
          </Ring>
          <div className="grid w-full grid-cols-4 gap-2">
            {[150, 250, 500].map((ml) => (
              <button key={ml} onClick={() => actions.addWater(ml)}
                className="rounded-xl bg-muted py-3 text-sm font-semibold transition hover:bg-accent active:scale-95">+{ml}</button>
            ))}
            <button onClick={() => actions.addWater(-250)} className="rounded-xl bg-muted py-3 text-sm text-muted-foreground transition hover:bg-accent active:scale-95">−250</button>
          </div>
          <div className="flex w-full gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-md transition-all duration-500 ${i < Math.round(wPct * 10) ? "bg-fresh glow-emerald" : "bg-muted"}`} />
            ))}
          </div>
        </section>

        <section className="glass p-6 flex flex-col items-center gap-5 animate-rise" style={{ animationDelay: ".08s" }}>
          <div className="self-start">
            <h2 className="text-xl font-semibold">Calories</h2>
            <p className="text-sm text-muted-foreground">Goal {s.calorieGoal.toLocaleString()} kcal</p>
          </div>
          <Ring pct={cPct} size={200} stroke={16} gradient={["var(--neon-blue)", "var(--neon-violet)"]}>
            <div>
              <div className="text-3xl">⚡</div>
              <div className="font-display text-3xl font-bold">{t.calories.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{Math.max(0, s.calorieGoal - t.calories)} kcal left</div>
            </div>
          </Ring>
          <div className="grid w-full grid-cols-4 gap-2">
            {[["🥐", 250], ["🥗", 400], ["🍝", 650], ["🍎", 95]].map(([e, k]) => (
              <button key={e as string} onClick={() => actions.addCalories(k as number)}
                className="rounded-xl bg-muted py-2 text-sm transition hover:bg-accent active:scale-95">
                <div className="text-xl">{e}</div><div className="text-xs text-muted-foreground">{k}</div>
              </button>
            ))}
          </div>
          <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); const n = parseInt(kcal); if (n) { actions.addCalories(n); setKcal(""); } }}>
            <input type="number" inputMode="numeric" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="Custom kcal"
              className="flex-1 min-w-0 rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-xl bg-brand px-5 font-semibold text-primary-foreground glow-violet transition hover:scale-105 active:scale-95">Log</button>
          </form>
          <div className="w-full">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Daily budget</span><span>{Math.round(cPct * 100)}%</span></div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${Math.min(cPct, 1) * 100}%` }} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
