import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicDocument } from "@/components/PublicShell";
import { publicPageHead } from "@/lib/page-head";
import { useAccount } from "@/components/AccountSession";
import { submitFeedback } from "@/lib/feedback.functions";
import { feedbackSchema } from "@/lib/feedback-input";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => publicPageHead("/contact", "Contact & Feedback — Pulse", "Send feedback, ask for help or make a privacy request about Pulse, the free online habit, water and calorie tracker with AI coach."),
  component: ContactPage,
});
function ContactPage() {
  const sendFeedback = useServerFn(submitFeedback);
  const { user, loading } = useAccount();
  const signedIn = Boolean(user);
  const loaded = !loading;
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<"feedback" | "help" | "privacy">("feedback");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => {
    setEmail((current) => current || user?.email || "");
  }, [user]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!signedIn) { setError("Please sign in before sending your message."); return; }
    const parsed = feedbackSchema.safeParse({ email, topic, message });
    if (!parsed.success) { setError("Enter a valid email and a message between 10 and 3,000 characters."); return; }
    setBusy(true);
    try { await sendFeedback({ data: parsed.data }); setSent(true); setMessage(""); }
    catch (err) { setError(err instanceof Error ? err.message : "Your message could not be saved. Please try again."); }
    finally { setBusy(false); }
  }
  const fieldClass = "min-h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring";
  return <PublicDocument title="Contact / Feedback" intro="An idea, a question, or something that could work better? We’d like to hear it.">
    {sent ? <section aria-live="polite"><CheckCircle2 className="mb-4 size-8 text-neon-emerald" /><h2>Message received</h2><p>Your message has been saved for Pulse to review. No reply time is guaranteed.</p><Button className="mt-5 h-12" variant="outline" onClick={() => setSent(false)}>Send another message</Button></section> : <form onSubmit={submit} className="space-y-5">
      {loaded && !signedIn && <div className="border-l-2 border-primary pl-4"><p>Sign in to send feedback securely. Your messages are not public.</p><Button asChild variant="outline" className="mt-3 h-12"><Link to="/auth" search={{ mode: "login" }}>Sign in</Link></Button></div>}
      <div><label htmlFor="feedback-topic" className="mb-2 block text-sm font-semibold">Topic</label><select id="feedback-topic" value={topic} onChange={(event) => { const value = event.target.value; if (value === "feedback" || value === "help" || value === "privacy") setTopic(value); }} className={fieldClass}><option value="feedback">Feedback / idea</option><option value="help">Help with Pulse</option><option value="privacy">Privacy request</option></select></div>
      <div><label htmlFor="feedback-email" className="mb-2 block text-sm font-semibold">Reply email</label><input id="feedback-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} /></div>
      <div><label htmlFor="feedback-message" className="mb-2 block text-sm font-semibold">Your message</label><textarea id="feedback-message" required minLength={10} maxLength={3000} rows={6} value={message} onChange={(event) => setMessage(event.target.value)} className={fieldClass} /><span className="mt-1 block text-right text-xs text-muted-foreground">{message.length.toLocaleString()} / 3,000</span></div>
      <p className="text-xs leading-relaxed text-muted-foreground">Please don’t include passwords, medical records or payment details. Messages are stored according to our <Link to="/privacy" className="underline">Privacy Policy</Link>. Up to five submissions per hour.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy || !loaded || !signedIn} className="h-12"><Send />{busy ? "Sending…" : "Send message"}</Button>
    </form>}
  </PublicDocument>;
}