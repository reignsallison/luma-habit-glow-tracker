import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowRight, Check, CheckCheck, Droplets, Flame, Share2, ChartNoAxesCombined, MonitorSmartphone, Plus, RotateCcw, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ring } from "@/components/AppShell";
import desk from "@/assets/routine-desk.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Pulse — Free Online Habit, Water & Calorie Tracker" },
      { name: "description", content: "Track daily habits, build streaks and log water and calories with Pulse. A free online routine tracker with weekly insights and account access across devices." },
      { property: "og:title", content: "Pulse — Free Online Habit, Water & Calorie Tracker" },
      { property: "og:description", content: "Your habits, water and calories. One free daily tracker, across your devices." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://luma-habit-glow-tracker.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://luma-habit-glow-tracker.lovable.app/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Pulse", url: "https://luma-habit-glow-tracker.lovable.app/", applicationCategory: "LifestyleApplication", operatingSystem: "Web browser", description: "A free online tracker for daily habits, water, calories and weekly consistency.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }],
  }),
  component: Landing,
});

const features = [
  { icon: CheckCheck, title: "Habits that stick", text: "Make your routine your own. Add habits, check them off and build a daily streak.", accent: "text-neon-blue" },
  { icon: Droplets, title: "A little more balance", text: "Log water and calories throughout your day, with progress toward your daily goals.", accent: "text-neon-emerald" },
  { icon: ChartNoAxesCombined, title: "See the bigger picture", text: "Compare your last 7 or 14 days and see your consistency over time.", accent: "text-neon-violet" },
  { icon: MonitorSmartphone, title: "Your routine, anywhere", text: "Sign in on your phone or computer to keep your daily tracker with you.", accent: "text-neon-blue" },
];
const questions = [
  ["Is Pulse free?", "Yes. You can create a free account and track your habits, water and calories without a payment card."],
  ["Do I need to download anything?", "No. Pulse runs in your web browser on your phone, tablet or computer."],
  ["Can I use Pulse on more than one device?", "Yes. Sign in to the same account on each device to access your saved tracker."],
  ["What can I track?", "Custom daily habits, habit streaks, water intake and calorie totals. Your statistics show your habits and intake over 7 or 14 days."],
  ["How do I create an account?", "Choose Sign up and use Google or your email and password. If you sign up by email, follow the confirmation link in your inbox before logging in."],
];

function Signup({ children = "Start my routine", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <Button asChild size="lg" className={`h-12 text-base ${className}`}><Link to="/auth" search={{ mode: "signup" }}>{children}<ArrowRight /></Link></Button>;
}

function Landing() {
  const [shared, setShared] = useState("");
  async function share() {
    const url = "https://luma-habit-glow-tracker.lovable.app/?utm_source=share&utm_medium=social";
    try {
      if (navigator.share) { await navigator.share({ title: "Pulse — Daily Routine Tracker", text: "A free tracker for habits, water and calories.", url }); setShared("Shared"); }
      else { await navigator.clipboard.writeText(url); setShared("Link copied"); }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setShared("Could not share. Please copy the website address."); }
  }
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold"><Activity className="size-7 text-primary" />Pulse<span className="hidden text-xs font-sans font-normal text-muted-foreground sm:inline">DAILY ROUTINE</span></Link>
        <nav className="flex gap-2" aria-label="Account"><Button variant="ghost" asChild><Link to="/auth" search={{ mode: "login" }}>Log in</Link></Button><Button asChild><Link to="/auth" search={{ mode: "signup" }}>Sign up<ArrowRight /></Link></Button></nav>
      </header>
      <section className="welcome-hero overflow-hidden">
        <img src={desk} alt="Water, a notebook and a plant arranged on a daily routine workspace" width={1600} height={912} fetchPriority="high" />
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-neon-emerald"><Sprout className="size-4" />A fresh start. Every day.</p>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-tight md:text-6xl">Pulse.<br />Your daily<br />habit tracker.</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">Small habits. More balance. Track your routine, water and calories in one place—and make room for a better day.</p>
          <Signup className="mt-7" />
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 text-neon-emerald" />Free account · No card · No download</p>
        </div>
      </section>
      <div className="border-y border-border bg-secondary/40"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 py-5 text-xs font-medium text-muted-foreground"><span className="flex gap-2"><CheckCheck className="size-4 text-primary" />Daily habits</span><span className="flex gap-2"><Droplets className="size-4 text-neon-emerald" />Water & calories</span><span className="flex gap-2"><ChartNoAxesCombined className="size-4 text-neon-violet" />Weekly insights</span><span className="flex gap-2"><MonitorSmartphone className="size-4 text-primary" />Across devices</span></div></div>
      <main>
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase text-neon-emerald">ONE DAY AT A TIME</p><h2 className="text-3xl font-bold md:text-4xl">A little progress feels good.</h2></div><p className="text-sm text-muted-foreground">An example day in Pulse</p></div>
          <Demo />
        </section>
        <section className="border-y border-border bg-secondary/30"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-3xl font-bold md:text-4xl">One routine. Everything together.</h2><div className="mt-10 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text, accent }) => <article key={title}><Icon className={`mb-5 size-7 ${accent}`} /><h3 className="text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>
        <section className="mx-auto max-w-6xl px-5 py-16"><div className="grid gap-10 md:grid-cols-2"><div><p className="mb-3 text-xs font-semibold uppercase text-primary">YOUR NEXT CHAPTER</p><h2 className="text-3xl font-bold md:text-4xl">Keep it simple.<br />Make it yours.</h2><p className="mt-4 max-w-sm text-muted-foreground">Reading a few pages. Drinking enough water. Moving a little more. Start with the things that matter to you.</p><Signup className="mt-6" /></div><ol className="flex flex-col gap-7">{[["Create your free account", "Use Google or email to get started."], ["Choose your daily habits", "Add the small routines you want to build."], ["Show up for yourself", "Check in, log your intake and watch your progress."]].map(([title, text], i) => <li key={title} className="flex gap-5 border-b border-border pb-6"><span className="font-display text-2xl text-neon-emerald">0{i + 1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div></li>)}</ol></div></section>
        <section className="mx-auto max-w-3xl px-5 pb-16"><h2 className="mb-8 text-3xl font-bold">Good questions. Simple answers.</h2>{questions.map(([q, a]) => <details key={q} className="group border-b border-border py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{q}<Plus className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" /></summary><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</section>
        <section className="border-y border-border bg-secondary/40 text-center"><div className="mx-auto max-w-3xl px-5 py-14"><Activity className="mx-auto mb-5 size-9 text-neon-emerald" /><h2 className="text-3xl font-bold md:text-4xl">Better days start small.</h2><p className="mt-4 text-muted-foreground">Your next habit starts with showing up.</p><Signup className="mt-6" /><div className="mt-6"><Button variant="ghost" onClick={share}><Share2 />Share Pulse with a friend</Button><p role="status" className="mt-2 min-h-5 text-xs text-muted-foreground">{shared}</p></div></div></section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground"><span>© {new Date().getFullYear()} Pulse · Daily routine tracker</span><div className="flex gap-5"><Link to="/auth" search={{ mode: "login" }}>Log in</Link><Link to="/auth" search={{ mode: "signup" }}>Create an account</Link></div></footer>
    </div>
  );
}

function Demo() {
  const [checked, setChecked] = useState([true, true, false, false]);
  const [water, setWater] = useState(1250);
  const names = ["Read 10 pages", "Move for 20 minutes", "Take a quiet moment", "Get to bed on time"];
  const count = checked.filter(Boolean).length;
  return <div className="grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[1.25fr_1fr]">
    <div className="p-5 md:p-8"><div className="mb-5 flex items-center justify-between"><h3 className="font-semibold">Today's habits</h3><span className="text-xs text-muted-foreground">{count} / 4 complete</span></div><ul className="space-y-2">{names.map((name, i) => <li key={name}><Button variant="ghost" aria-pressed={checked[i]} aria-label={`Try ${name}`} className="h-12 w-full justify-start whitespace-normal text-left" onClick={() => setChecked((old) => old.map((v, j) => i === j ? !v : v))}><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${checked[i] ? 'border-neon-emerald bg-neon-emerald text-primary-foreground' : 'border-border'}`}>{checked[i] && <Check />}</span><span className={checked[i] ? 'text-muted-foreground line-through' : ''}>{name}</span></Button></li>)}</ul><div className="mt-6 flex items-center justify-between border-t border-border pt-4"><span className="flex items-center gap-2 text-xs text-muted-foreground"><Flame className="size-4 text-neon-violet" />A sample day, not your saved tracker</span><Button variant="ghost" size="icon" title="Reset example" aria-label="Reset example" onClick={() => { setChecked([true, true, false, false]); setWater(1250); }}><RotateCcw /></Button></div></div>
    <div className="flex items-center justify-center gap-8 border-t border-border bg-secondary/30 p-6 md:border-l md:border-t-0"><div className="flex flex-col items-center gap-4"><Ring size={150} pct={water / 2500} gradient={["var(--neon-emerald)", "var(--neon-blue)"]}><div><Droplets className="mx-auto mb-2 size-5 text-neon-emerald" /><p className="font-display text-2xl font-bold">{(water / 1000).toFixed(2)} L</p><p className="text-xs text-muted-foreground">of 2.5 L</p></div></Ring><Button variant="outline" disabled={water >= 2500} onClick={() => setWater((w) => Math.min(2500, w + 250))}><Plus />250 ml</Button></div><div className="space-y-5"><div><p className="text-xs text-muted-foreground">Habits</p><p className="font-display text-3xl font-bold text-primary">{count * 25}%</p></div><div><p className="text-xs text-muted-foreground">Calories</p><p className="font-display text-2xl font-bold">1,450</p><p className="text-xs text-muted-foreground">of 2,200 kcal</p></div></div></div>
  </div>;
}
