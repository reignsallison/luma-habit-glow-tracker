import { createFileRoute, Link } from "@tanstack/react-router";
import { Ring } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse — Free Habit, Water & Calorie Tracker" },
      { name: "description", content: "Build streaks, drink more water and hit your calorie goal. Pulse is a free, beautiful daily tracker that works on any phone or computer." },
      { property: "og:title", content: "Pulse — Free Habit, Water & Calorie Tracker" },
      { property: "og:description", content: "Build streaks, drink more water and hit your calorie goal — free, on any device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: "◎", title: "Habits & streaks", text: "Tick off habits with a satisfying tap and watch your streak grow every day." },
  { icon: "◐", title: "Water & calories", text: "Log a glass or a meal in one tap. Glowing rings show how close you are." },
  { icon: "▤", title: "Weekly insights", text: "Charts reveal your consistency so you know exactly where to improve." },
  { icon: "☁", title: "Synced everywhere", text: "Your account keeps everything safe across your phone and computer." },
];

const steps = ["Create a free account in seconds", "Pick the habits you want to build", "Check in daily and grow your streak"];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand glow-violet" />
          <span className="font-display text-xl font-bold">Pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth" search={{ mode: "login" }} className="rounded-xl px-4 py-2 font-semibold text-muted-foreground transition hover:text-foreground">Log in</Link>
          <Link to="/auth" search={{ mode: "signup" }} className="rounded-xl bg-brand px-4 py-2 font-semibold text-primary-foreground glow-violet transition hover:scale-105">Sign up</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 md:grid-cols-2 md:pt-20">
        <div className="animate-rise">
          <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">✦ 100% free · no download needed</span>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] md:text-6xl">
            Small habits.<br /><span className="text-gradient">Brighter days.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Pulse is the beautiful daily tracker for your habits, water and calories — built to keep you consistent, one glowing streak at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth" search={{ mode: "signup" }} className="rounded-2xl bg-brand px-7 py-4 text-lg font-semibold text-primary-foreground glow-violet transition hover:scale-105">Start free →</Link>
            <Link to="/auth" search={{ mode: "login" }} className="rounded-2xl border border-border bg-muted px-7 py-4 text-lg font-semibold transition hover:bg-accent">I have an account</Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Works on any phone, tablet or computer.</p>
        </div>

        <div className="relative mx-auto animate-rise" style={{ animationDelay: ".1s" }}>
          <div className="glass flex flex-col items-center gap-5 p-8">
            <Ring pct={0.8} size={200} gradient={["var(--neon-blue)", "var(--neon-violet)"]}>
              <div><div className="font-display text-4xl font-bold">80%</div><div className="text-xs text-muted-foreground">4 of 5 habits</div></div>
            </Ring>
            <div className="flex gap-3">
              <div className="rounded-2xl bg-muted px-4 py-3 text-center"><div className="text-xs text-muted-foreground">Streak</div><div className="font-display text-xl font-bold text-gradient">12 days 🔥</div></div>
              <div className="rounded-2xl bg-muted px-4 py-3 text-center"><div className="text-xs text-muted-foreground">Water</div><div className="font-display text-xl font-bold">2.1 L 💧</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Everything for a better day</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass p-6">
              <div className="text-2xl text-primary">{f.icon}</div>
              <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Get started in 3 steps</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="glass p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display font-bold text-primary-foreground">{i + 1}</div>
              <p className="mt-4 font-semibold">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="glass p-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Your best routine starts today</h2>
          <p className="mt-3 text-muted-foreground">Join free — it takes less than a minute.</p>
          <Link to="/auth" search={{ mode: "signup" }} className="mt-6 inline-block rounded-2xl bg-brand px-8 py-4 text-lg font-semibold text-primary-foreground glow-violet transition hover:scale-105">Create my free account</Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Pulse · Daily Life & Routine Tracker</footer>
    </div>
  );
}
