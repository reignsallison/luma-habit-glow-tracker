import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { mode?: "signup" | "login" } => ({ mode: s["mode"] === "signup" ? "signup" : "login" }),
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { title: "Sign in or create your account — Pulse" },
      { name: "description", content: "Log in or sign up free to track habits, water and calories with Pulse." },
      { property: "og:title", content: "Sign in to Pulse" },
      { property: "og:description", content: "Log in or sign up free to track habits, water and calories with Pulse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/habits" }); });
    const { data } = supabase.auth.onAuthStateChange((e, session) => {
      if (e === "SIGNED_IN" && session) navigate({ to: "/habits" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
    if (signup) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/habits", data: { display_name: name.trim() } },
      });
      if (error) setMsg({ kind: "err", text: error.message });
      else if (!data.session) setMsg({ kind: "ok", text: "Check your email to confirm your account, then log in." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ kind: "err", text: error.message });
    }
    } catch {
      setMsg({ kind: "err", text: "Could not connect. Please check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setMsg(null); setBusy(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
      if (r.error) setMsg({ kind: "err", text: r.error.message ?? "Google sign-in failed" });
    } catch {
      setMsg({ kind: "err", text: "Could not connect to Google. Please try again." });
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center px-5 py-10">
      <div className="w-full max-w-md glass p-8 animate-rise">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Activity className="size-8 text-primary" />
          <span className="font-display text-xl font-bold">Pulse</span>
        </Link>
        <h1 className="text-3xl font-bold">{signup ? "Create your free account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{signup ? "Start building better days in under a minute." : "Log in to pick up your streak."}</p>

        <Button onClick={google} type="button" disabled={busy} variant="outline"
          className="mt-6 h-12 w-full">
          Continue with Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {signup && <input required aria-label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={50}
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />}
          <input required aria-label="Email" autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <input required aria-label="Password" autoComplete={signup ? "new-password" : "current-password"} type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`text-sm ${msg.kind === "err" ? "text-destructive" : "text-neon-emerald"}`}>{msg.text}</p>}
          <Button type="submit" disabled={busy} className="mt-1 h-12 w-full">
            {busy ? "Please wait…" : signup ? "Sign up free" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? "Already have an account? " : "New to Pulse? "}
          <Link to="/auth" search={{ mode: signup ? "login" : "signup" }} className="font-semibold text-primary">
            {signup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
