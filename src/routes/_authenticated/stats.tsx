import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { lastDays, streak, useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/stats")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Statistics — Pulse Daily Tracker" },
      { name: "description", content: "Weekly consistency charts for habits, hydration and calories." },
      { property: "og:title", content: "Statistics — Pulse Daily Tracker" },
      { property: "og:description", content: "Weekly consistency charts for habits, hydration and calories." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const s = useStore();
  const [range, setRange] = useState<7 | 14>(7);
  const days = lastDays(s, range);
  const avg = (f: (d: (typeof days)[0]) => number) => Math.round(days.reduce((a, d) => a + f(d), 0) / days.length);

  const kpis = [
    { label: "Habit consistency", value: `${avg((d) => d.habitPct)}%`, cls: "text-neon-violet" },
    { label: "Avg water", value: `${(avg((d) => d.water) / 1000).toFixed(1)}L`, cls: "text-neon-emerald" },
    { label: "Avg calories", value: avg((d) => d.calories).toLocaleString(), cls: "text-neon-blue" },
    { label: "Streak", value: `${streak(s)}🔥`, cls: "text-foreground" },
  ];

  return (
    <AppShell title="Statistics" subtitle="Your consistency at a glance">
      <div className="mb-5 inline-flex rounded-xl bg-muted p-1">
        {([7, 14] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${range === r ? "bg-brand text-primary-foreground" : "text-muted-foreground"}`}>
            {r} days
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
        {kpis.map((k, i) => (
          <div key={k.label} className="glass !rounded-2xl p-4 animate-rise" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className={`mt-1 font-display text-2xl font-bold ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Habit completion" sub="Daily % of habits done">
          <Bars data={days.map((d) => ({ label: d.label, v: d.habitPct, display: `${d.habitPct}%` }))} max={100} />
        </Card>
        <Card title="Hydration trend" sub={`Goal ${s.waterGoal / 1000}L`}>
          <Line data={days.map((d) => ({ label: d.label, v: d.water, display: `${(d.water / 1000).toFixed(2)}L` }))} goal={s.waterGoal} color="var(--neon-emerald)" />
        </Card>
        <Card title="Calories trend" sub={`Goal ${s.calorieGoal} kcal`} className="md:col-span-2">
          <Line data={days.map((d) => ({ label: d.label, v: d.calories, display: `${d.calories} kcal` }))} goal={s.calorieGoal} color="var(--neon-blue)" />
        </Card>
        <Card title="Consistency heatmap" sub="Habit completion intensity" className="md:col-span-2">
          <div className="grid grid-cols-7 gap-2">
            {lastDays(s, 28).map((d) => (
              <div key={d.key} title={`${d.key}: ${d.habitPct}%`} className="aspect-square rounded-lg bg-neon-violet transition hover:scale-110"
                style={{ opacity: 0.12 + (d.habitPct / 100) * 0.88 }} />
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ title, sub, children, className = "" }: { title: string; sub: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`glass p-5 animate-rise ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{sub}</p>
      {children}
    </section>
  );
}

type Pt = { label: string; v: number; display: string };

function Bars({ data, max }: { data: Pt[]; max: number }) {
  const [hi, setHi] = useState<number | null>(null);
  return (
    <div className="flex h-48 items-end gap-1.5">
      {data.map((d, i) => (
        <div key={i} className="relative flex flex-1 flex-col items-center gap-2 h-full justify-end" onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} onClick={() => setHi(i)}>
          {hi === i && <div className="absolute -top-1 rounded-md bg-accent px-2 py-0.5 text-xs">{d.display}</div>}
          <div className={`w-full rounded-t-lg bg-brand transition-all duration-700 ${hi === i ? "glow-violet" : ""}`} style={{ height: `${Math.max(4, (d.v / max) * 80)}%` }} />
          <span className="text-[10px] text-muted-foreground">{d.label.slice(0, 2)}</span>
        </div>
      ))}
    </div>
  );
}

function Line({ data, goal, color }: { data: Pt[]; goal: number; color: string }) {
  const [hi, setHi] = useState<number | null>(null);
  const W = 600, H = 180, P = 10;
  const max = Math.max(goal * 1.2, ...data.map((d) => d.v));
  const x = (i: number) => P + (i * (W - 2 * P)) / (data.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - 2 * P);
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.v)}`).join(" ");
  const gid = `lg${color.replace(/\W/g, "")}`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="none" onMouseLeave={() => setHi(null)}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={P} x2={W - P} y1={y(goal)} y2={y(goal)} stroke="var(--muted-foreground)" strokeDasharray="6 6" opacity=".4" />
        <path d={`${path} L${x(data.length - 1)},${H} L${x(0)},${H} Z`} fill={`url(#${gid})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHi(i)} onClick={() => setHi(i)}>
            <rect x={x(i) - 20} y={0} width={40} height={H} fill="transparent" />
            {hi === i && <line x1={x(i)} x2={x(i)} y1={0} y2={H} stroke={color} opacity=".3" />}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {data.map((d, i) => <span key={i} className={hi === i ? "text-foreground" : ""}>{d.label.slice(0, 2)}</span>)}
      </div>
      <div className="mt-2 h-5 text-sm">{hi !== null && <span><span className="text-muted-foreground">{data[hi]?.label}:</span> <b>{data[hi]?.display}</b></span>}</div>
    </div>
  );
}
