import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "@/components/AccountSession";
import { Activity, ArrowRight, Check, CheckCheck, Droplets, Share2, ChartNoAxesCombined, MonitorSmartphone, Plus, Sprout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachPreview, SampleDayPreview } from "@/components/LandingExperience";
import { PublicHeader, PublicFooter } from "@/components/PublicShell";
import { publicPageHead } from "@/lib/page-head";
import desk from "@/assets/routine-desk.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    ...publicPageHead("/", "Pulse — Free Online Habit, Water & Calorie Tracker with AI Coach", "Pulse is a free online habit, water, and calorie tracker with AI coach. Build streaks and balanced routines with a no-download daily routine tracker."),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Pulse", url: "https://luma-habit-glow-tracker.lovable.app/", applicationCategory: "LifestyleApplication", operatingSystem: "Web browser", description: "Free online habit, water, and calorie tracker with AI coach. A no-download daily routine tracker.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }) },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: CheckCheck, title: "Habits that stick", text: "Make your routine your own. Add habits, check them off and build a daily streak.", accent: "text-neon-blue" },
  { icon: Droplets, title: "A little more balance", text: "Log water and calories throughout your day, with progress toward your daily goals.", accent: "text-neon-emerald" },
  { icon: ChartNoAxesCombined, title: "See the bigger picture", text: "Compare your last 7 or 14 days and see your consistency over time.", accent: "text-neon-violet" },
  { icon: MonitorSmartphone, title: "Your routine, anywhere", text: "Sign in on your phone or computer to keep your daily tracker with you.", accent: "text-neon-blue" },
  { icon: Sparkles, title: "An AI coach, included", text: "Pulse Guide helps you build achievable routines, reflect on your streaks and think through meal balance. No extra cost.", accent: "text-neon-emerald" },
];
const questions = [
  ["Is Pulse free?", "Yes. Pulse is a free online habit, water, and calorie tracker with AI coach included at no extra cost. No payment card is required."],
  ["Do I need to download anything?", "No. Pulse is a no-download daily routine tracker that runs in your web browser on your phone, tablet or computer."],
  ["Can I use Pulse on more than one device?", "Yes. Sign in to the same account on each device to access your saved tracker."],
  ["What can I track?", "Custom daily habits, habit streaks, water intake and calorie totals. Your statistics show your habits and intake over 7 or 14 days."],
  ["How do I create an account?", "Choose Sign up and use Google or your email and password. If you sign up by email, follow the confirmation link in your inbox before logging in."],
  ["How does the AI coach use my logs?", "After sign-in, Pulse Guide can use your saved habit and intake logs to suggest achievable routines and explain weekly patterns. Routine suggestions let you review the logs you share. AI can make mistakes and is not a medical professional."],
  ["Can I try Pulse before creating an account?", "Yes. The example day and coach examples on this page work without an account. Sample changes are not saved and cannot affect a real tracker."],
];

function Signup({ children = "Start my routine", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <Button asChild size="lg" className={`h-12 text-base ${className}`}><Link to="/auth" search={{ mode: "signup" }}>{children}<ArrowRight /></Link></Button>;
}

function Landing() {
  const { user } = useAccount();
  const navigate = useNavigate();
  useEffect(() => { if (user) void navigate({ to: "/habits", replace: true }); }, [user, navigate]);
  const [shared, setShared] = useState("");
  async function share() {
    const url = "https://luma-habit-glow-tracker.lovable.app/?utm_source=share&utm_medium=social";
    try {
      if (navigator.share) { await navigator.share({ title: "Pulse — Daily Routine Tracker with AI Coach", text: "A free, no-download tracker for habits, water and calories, with an AI coach included.", url }); setShared("Shared"); }
      else { await navigator.clipboard.writeText(url); setShared("Link copied"); }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setShared("Could not share. Please copy the website address."); }
  }
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
      <section className="welcome-hero overflow-hidden">
        <img src={desk} alt="Water, a notebook and a plant arranged on a daily routine workspace" width={1600} height={912} fetchPriority="high" />
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-neon-emerald"><Sprout className="size-4" />A fresh start. Every day.</p>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-tight md:text-6xl">Pulse.<br />Your daily<br />habit tracker.</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">Your free online habit, water, and calorie tracker with AI coach. Build a calmer daily routine with Pulse Guide’s thoughtful support—at no extra cost, with nothing to download.</p>
          <Signup className="mt-7" />
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 text-neon-emerald" />Free account · No card · No download</p>
        </div>
      </section>
      <div className="border-y border-border bg-secondary/40"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 py-5 text-xs font-medium text-muted-foreground"><span className="flex gap-2"><CheckCheck className="size-4 text-primary" />Daily habits</span><span className="flex gap-2"><Droplets className="size-4 text-neon-emerald" />Water & calories</span><span className="flex gap-2"><Sparkles className="size-4 text-neon-violet" />AI coach included</span><span className="flex gap-2"><MonitorSmartphone className="size-4 text-primary" />Across devices</span></div></div>
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase text-neon-emerald">ONE DAY AT A TIME</p><h2 className="text-3xl font-bold md:text-4xl">A little progress feels good.</h2></div><p className="text-sm text-muted-foreground">An example day in Pulse</p></div>
          <SampleDayPreview />
        </section>
        <CoachPreview />
        <section className="border-b border-border bg-secondary/30"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-3xl font-bold md:text-4xl">One routine. Everything together.</h2><p className="mt-4 text-muted-foreground">A no-download daily routine tracker, built around real life.</p><div className="mt-10 grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, text, accent }) => <article key={title}><Icon className={`mb-5 size-7 ${accent}`} /><h3 className="text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>
        <section className="mx-auto max-w-6xl px-5 py-16"><div className="grid gap-10 md:grid-cols-2"><div><p className="mb-3 text-xs font-semibold uppercase text-primary">YOUR NEXT CHAPTER</p><h2 className="text-3xl font-bold md:text-4xl">Keep it simple.<br />Make it yours.</h2><p className="mt-4 max-w-sm text-muted-foreground">Reading a few pages. Drinking enough water. Moving a little more. Start with the things that matter to you.</p><Signup className="mt-6" /></div><ol className="flex flex-col gap-7">{[["Create your free account", "Use Google or email to get started."], ["Choose your daily habits", "Add the small routines you want to build."], ["Show up for yourself", "Check in, log your intake and watch your progress."]].map(([title, text], i) => <li key={title} className="flex gap-5 border-b border-border pb-6"><span className="font-display text-2xl text-neon-emerald">0{i + 1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div></li>)}</ol></div></section>
        <section className="mx-auto max-w-3xl px-5 pb-16"><h2 className="mb-8 text-3xl font-bold">Good questions. Simple answers.</h2>{questions.map(([q, a]) => <details key={q} className="group border-b border-border py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{q}<Plus className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" /></summary><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</section>
        <section className="border-y border-border bg-secondary/40 text-center"><div className="mx-auto max-w-3xl px-5 py-14"><Activity className="mx-auto mb-5 size-9 text-neon-emerald" /><h2 className="text-3xl font-bold md:text-4xl">Better days start small.</h2><p className="mt-4 text-muted-foreground">Your next habit starts with showing up.</p><Signup className="mt-6" /><div className="mt-6"><Button variant="ghost" onClick={share}><Share2 />Share Pulse with a friend</Button><p role="status" className="mt-2 min-h-5 text-xs text-muted-foreground">{shared}</p></div></div></section>
      </main>
      <PublicFooter />
    </div>
  );
}

