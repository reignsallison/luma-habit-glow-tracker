import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Square, LoaderCircle, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { routineSnapshot, type RoutineEvent, type RoutineInput } from "@/lib/routine-input";

export const Route = createFileRoute("/_authenticated/routine")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Your AI Routine — Pulse Daily Tracker" },
    { name: "description", content: "Personalized, achievable routine suggestions based on your Pulse habit and intake logs." },
    { property: "og:title", content: "Your AI Routine — Pulse Daily Tracker" },
    { property: "og:description", content: "Find small next steps from your habit and intake logs with Pulse." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: RoutinePage,
});

function RoutinePage() {
  const state = useStore();
  const snapshot = routineSnapshot(state);
  const [focus, setFocus] = useState<RoutineInput["focus"]>("balanced");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stopped, setStopped] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  async function generate() {
    if (loading) return;
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true); setStopped(false); setError(""); setAnswer(""); setReasoning("");
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error("Please sign in again to get suggestions.");
      const response = await fetch("/api/routine", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ ...snapshot, focus, context }),
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.message || "Suggestions are unavailable. Please try again later.");
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Suggestions could not be received.");
      const decoder = new TextDecoder();
      let buffer = "";
      const apply = (line: string) => {
        if (!line.trim()) return;
        const event = JSON.parse(line) as RoutineEvent;
        if (event.type === "text") setAnswer((value) => value + event.text);
        if (event.type === "reasoning") setReasoning((value) => value + event.text);
        if (event.type === "error") setError(event.message);
      };
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
        lines.forEach(apply);
        if (done) { apply(buffer); break; }
      }
    } catch (cause) {
      if (controller.signal.aborted) setStopped(true);
      else setError(cause instanceof Error ? cause.message : "Suggestions could not be completed.");
    } finally { setLoading(false); abort.current = null; }
  }

  return <AppShell title="Your next small step" subtitle="Pulse AI · Routine suggestions">
    <div className="mb-7 flex items-center gap-3 border-b border-border pb-5">
      <Sparkles className="size-7 shrink-0 text-neon-emerald" />
      <p className="text-sm text-muted-foreground">A routine that fits your real life.</p>
    </div>
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form className="space-y-5 min-w-0" onSubmit={(event) => { event.preventDefault(); void generate(); }}>
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><ClipboardList className="size-4 text-primary" />Your last 14 days</h2>
          <div className="grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
            <div><strong className="block text-2xl font-display">{snapshot.logs.length}</strong><span className="text-muted-foreground">Days logged</span></div>
            <div><strong className="block text-2xl font-display">{snapshot.habits.length}</strong><span className="text-muted-foreground">Active habits</span></div>
          </div>
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-primary">Review logs to share</summary>
            <div className="mt-3 max-h-64 overflow-auto space-y-3 text-muted-foreground">
              <p>{snapshot.habits.map((habit) => habit.name).join(", ") || "No habits yet"}</p>
              <p>Current goals: {snapshot.waterGoal} ml · {snapshot.calorieGoal} kcal</p>
              {snapshot.logs.map((log) => <p key={log.date}>{log.date}: {log.habits.filter((id) => snapshot.habits.some((h) => h.id === id)).length} habits · {log.water} ml · {log.calories} kcal</p>)}
              {!snapshot.logs.length && <p>No intake or completion logs yet.</p>}
            </div>
          </details>
        </div>
        <fieldset disabled={loading}>
          <legend className="mb-2 text-sm font-semibold">Your priority</legend>
          <div className="flex flex-wrap gap-2">
            {([['balanced', 'Balance'], ['habits', 'Consistency'], ['hydration', 'Hydration']] as const).map(([value, label]) =>
              <Button key={value} type="button" variant={focus === value ? "default" : "secondary"} aria-pressed={focus === value} onClick={() => setFocus(value)}>{label}</Button>)}
          </div>
        </fieldset>
        <div>
          <label htmlFor="routine-context" className="block mb-2 text-sm font-semibold">What should your routine fit around? <span className="text-muted-foreground font-normal">(optional)</span></label>
          <textarea id="routine-context" value={context} onChange={(e) => setContext(e.target.value)} maxLength={1000} disabled={loading} rows={4} placeholder="Early shifts, a busy household, 10 spare minutes…" className="w-full rounded-lg border border-border bg-muted p-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-y" />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">Your reviewed logs and notes are sent to AI only when you request suggestions. Your tracker stays unchanged. General wellness guidance, not medical or dietary advice.</p>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={loading} className="h-11"><Sparkles />{answer ? "Get fresh suggestions" : "Suggest my routine"}</Button>
          {loading && <Button type="button" variant="outline" className="h-11" onClick={() => { setStopped(true); abort.current?.abort(); }}><Square />Stop</Button>}
        </div>
      </form>
      <section className="min-w-0 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8" aria-label="Routine suggestions">
        <h2 className="text-xl font-display font-semibold mb-4">Your routine</h2>
        {loading && <p role="status" className="mb-4 flex items-center gap-2 text-sm text-primary"><LoaderCircle className="size-4 animate-spin" />{answer ? "Writing your suggestions…" : "Reviewing your logs…"}</p>}
        {error && <p role="alert" className="mb-4 text-sm text-destructive break-words">{error}</p>}
        {reasoning && <details className="mb-4 text-sm text-muted-foreground"><summary className="cursor-pointer">AI notes</summary><p className="mt-2 whitespace-pre-wrap break-words">{reasoning}</p></details>}
        {answer ? <div className="whitespace-pre-wrap break-words text-sm leading-7">{answer}</div> : !loading && !error && <p className="text-muted-foreground text-sm">Small steps. A little more consistency. Room for life.</p>}
        {stopped && <p role="status" className="mt-4 text-xs text-muted-foreground">Stopped · Any partial suggestions are kept above.</p>}
      </section>
    </div>
  </AppShell>;
}