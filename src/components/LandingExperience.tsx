import { useState } from "react";
import { Check, Droplets, Flame, Plus, RotateCcw, Sparkles, ArrowRight, CalendarCheck, Utensils, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { initialSampleDay, sampleHabitNames, sampleCoachTip, updateSampleDay } from "@/lib/landing-demo";

function Meter({ value, goal, label, unit, accent }: { value: number; goal: number; label: string; unit: string; accent: string }) {
  return <div><div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h3 className="flex items-center gap-2 text-sm font-semibold">{label === "Water" ? <Droplets className={`size-4 ${accent}`} /> : <Flame className={`size-4 ${accent}`} />}{label}</h3><span className="text-xs text-muted-foreground">{value.toLocaleString("en-US")} / {goal.toLocaleString("en-US")} {unit}</span></div>
    <svg className={`h-2 w-full ${accent}`} role="progressbar" aria-label={`Sample ${label.toLowerCase()} progress`} aria-valuenow={value} aria-valuemin={0} aria-valuemax={Math.max(goal, value)} viewBox="0 0 100 2" preserveAspectRatio="none"><rect width="100" height="2" rx="1" className="fill-muted" /><rect width={Math.min(100, value / goal * 100)} height="2" rx="1" fill="currentColor" className="transition-all duration-500" /></svg>
  </div>;
}

export function SampleDayPreview() {
  const [day, setDay] = useState(initialSampleDay);
  const count = day.checked.filter(Boolean).length;
  return <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div className="grid md:grid-cols-2"><div className="p-5 md:p-8"><div className="mb-5 flex items-center justify-between gap-3"><h3 className="font-semibold">Today's habits</h3><span className="text-xs text-muted-foreground">{count} / 4 complete</span></div>
      <ul className="space-y-2">{sampleHabitNames.map((name, index) => <li key={name}><Button variant="ghost" aria-pressed={day.checked[index]} aria-label={`Try ${name}`} className="min-h-12 w-full justify-start whitespace-normal py-3 text-left" onClick={() => setDay((old) => updateSampleDay(old, { kind: "habit", index }))}><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${day.checked[index] ? "border-neon-emerald bg-neon-emerald text-primary-foreground" : "border-border"}`}>{day.checked[index] && <Check className="animate-pop" />}</span><span className={day.checked[index] ? "text-muted-foreground line-through" : ""}>{name}</span></Button></li>)}</ul>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4"><span className="text-xs text-muted-foreground">Example day · Nothing is saved</span><Button variant="ghost" className="size-11" size="icon" title="Reset example" aria-label="Reset example" onClick={() => setDay(initialSampleDay())}><RotateCcw /></Button></div>
    </div><div className="flex flex-col justify-center gap-8 border-t border-border bg-secondary/30 p-5 md:border-l md:border-t-0 md:p-8">
      <div><Meter label="Water" value={day.water} goal={2500} unit="ml" accent="text-neon-emerald" /><Button variant="outline" className="mt-4 h-12" onClick={() => setDay((old) => updateSampleDay(old, { kind: "water" }))}><Plus />250 ml</Button></div>
      <div><Meter label="Calories" value={day.calories} goal={2200} unit="kcal" accent="text-primary" /><Button variant="outline" className="mt-4 h-12" onClick={() => setDay((old) => updateSampleDay(old, { kind: "snack" }))}><Plus />Sample snack · 150 kcal</Button></div>
    </div></div>
    <div className="border-t border-border px-5 py-5 md:px-8"><p className="mb-2 flex items-center gap-2 text-sm font-semibold text-neon-emerald"><Sparkles className="size-4" />Pulse Guide · Example insight</p><p role="status" aria-live="polite" className="min-h-24 text-sm leading-relaxed text-muted-foreground md:min-h-16">{sampleCoachTip(day)}</p></div>
  </div>;
}

const coachExamples = [
  { icon: CalendarCheck, label: "Daily routine", prompt: "My days are busy. Can you help me start a realistic routine?", answer: "Let’s keep it small and attach each step to something you already do.", steps: ["After breakfast: read two pages, not a whole chapter.", "At lunch: take a five-minute walk if that feels comfortable.", "Before bed: take a quiet minute and choose tomorrow’s one priority."], closing: "Try this for a week. If a day is hard, keep just one step—consistency doesn’t require perfection." },
  { icon: Utensils, label: "Meal balance", prompt: "I logged 1,600 kcal against a 2,200 kcal goal. What could dinner look like?", answer: "That leaves 600 kcal in your logged goal. Calories are estimates, not a rule about what you’re allowed to eat.", steps: ["Try a bowl with beans or chicken, rice and vegetables.", "Adjust portions and add a dressing or healthy fat you enjoy.", "Log your own portion estimate, and stay attentive to hunger and fullness."], closing: "Needs vary. Don’t skip a meal to match the tracker; ask a qualified professional about goals that suit you." },
  { icon: TrendingUp, label: "Weekly streak", prompt: "I completed three of my four habits on five days this week. Is that enough?", answer: "That’s meaningful progress: you showed up on five days, and completed 75% of your habits on those days.", steps: ["Keep the habits that already fit naturally into your day.", "Make the missed habit smaller, or move it to a better time.", "Pick one achievable intention for next week rather than adding more."], closing: "A missed day doesn’t undo your effort. Your routine is there to support you, not to grade you." },
];
export function CoachPreview() {
  const [selected, setSelected] = useState(0);
  const example = coachExamples[selected] ?? coachExamples[0];
  if (!example) return null;
  return <section className="border-y border-border bg-secondary/20"><div className="mx-auto max-w-6xl px-5 py-16">
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-neon-emerald"><Sparkles className="size-4" />MEET PULSE GUIDE</p>
    <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">A little guidance.<br />A routine that feels like you.</h2>
    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">Your built-in AI coach turns your habit, water and calorie logs into thoughtful next steps. Ask questions, find a realistic daily routine, or reflect on your week—at no extra cost.</p>
    <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="AI coach examples">{coachExamples.map(({ icon: Icon, label }, index) => <Button key={label} role="tab" id={`coach-tab-${index}`} aria-controls="coach-panel" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} variant={selected === index ? "default" : "outline"} className="h-12" onClick={() => setSelected(index)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = (index + (event.key === "ArrowRight" ? 1 : -1) + coachExamples.length) % coachExamples.length; setSelected(next); document.getElementById(`coach-tab-${next}`)?.focus(); } }}><Icon />{label}</Button>)}</div>
    <div id="coach-panel" role="tabpanel" aria-labelledby={`coach-tab-${selected}`} className="mt-4 max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4 text-sm md:px-7"><p className="mb-2 text-xs text-muted-foreground">YOU · EXAMPLE QUESTION</p><p>{example.prompt}</p></div>
      <div className="px-5 py-6 md:px-7"><h3 className="mb-4 flex items-center gap-2 font-semibold text-neon-emerald"><Sparkles className="size-5" />Pulse Guide</h3><p className="text-sm leading-relaxed">{example.answer}</p><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">{example.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="mt-5 text-sm leading-relaxed text-muted-foreground">{example.closing}</p></div>
      <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground md:px-7">Illustrative examples, not live AI replies. Personalized coaching uses your saved logs after sign-in.</p>
    </div>
    <Button asChild className="mt-6 h-12"><Link to="/auth" search={{ mode: "signup" }}>Meet your AI coach<ArrowRight /></Link></Button>
  </div></section>;
}