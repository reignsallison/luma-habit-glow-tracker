import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { profile, streak, useStore } from "@/lib/store";

const nav = [
  { to: "/", label: "Habits", icon: "◎" },
  { to: "/intake", label: "Intake", icon: "◐" },
  { to: "/stats", label: "Stats", icon: "▤" },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const s = useStore();
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-8 border-r border-border p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand glow-violet" />
          <span className="font-display text-xl font-bold">Pulse</span>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "!bg-accent !text-foreground" }}>
              <span className="text-lg text-primary">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto glass p-4 !rounded-2xl">
          <ProfileChip />
          <div className="mt-3 text-xs text-muted-foreground">🔥 {streak(s)}-day streak · {profile.plan}</div>
        </div>
      </aside>

      <main className="flex-1 px-5 pb-32 pt-6 md:px-10 md:pt-10 max-w-5xl">
        <header className="mb-6 flex items-start justify-between gap-4 animate-rise">
          <div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">{title}</h1>
          </div>
          <div className="md:hidden"><Avatar /></div>
        </header>
        {children}
      </main>

      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50 glass !rounded-2xl flex justify-around p-2">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs text-muted-foreground transition"
            activeProps={{ className: "!text-foreground bg-accent" }}>
            <span className="text-xl text-primary">{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-full bg-brand font-display font-bold text-primary-foreground glow-blue">
      {profile.avatar}
    </div>
  );
}

function ProfileChip() {
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div className="min-w-0">
        <div className="truncate font-semibold">{profile.name}</div>
        <div className="truncate text-xs text-muted-foreground">{profile.handle}</div>
      </div>
    </div>
  );
}

export function Ring({ pct, size = 160, stroke = 14, gradient, children }: { pct: number; size?: number; stroke?: number; gradient: [string, string]; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `g-${gradient.join("").replace(/\W/g, "")}`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id}><stop offset="0" stopColor={gradient[0]} /><stop offset="1" stopColor={gradient[1]} /></linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={`url(#${id})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 1))}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)", filter: `drop-shadow(0 0 8px ${gradient[1]})` }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
