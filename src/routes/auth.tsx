import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Activity, LoaderCircle } from "lucide-react";
import { useAccount } from "@/components/AccountSession";
import { signUpAndSignIn } from "@/lib/account-access";

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
  const { user, loading } = useAccount();
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/habits", replace: true });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || loading) return;
    setBusy("email"); setMsg(null);
    try {
    if (signup) {
      const { data, error } = await signUpAndSignIn(supabase.auth, email, password, name, window.location.origin);
      if (error) setMsg({ kind: "err", text: error.message });
      else if (!data.session) setMsg({ kind: "err", text: "Your account was created, but sign-in did not finish. Please try logging in." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMsg({ kind: "err", text: error.message });
    }
    } catch {
      setMsg({ kind: "err", text: "Could not connect. Please check your connection and try again." });
    } finally {
      setBusy(null);
    }
  }

  async function google() {
    if (busy || loading) return;
    setMsg(null); setBusy("google");
    let redirecting = false;
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
      redirecting = Boolean(r.redirected);
      if (r.error) setMsg({ kind: "err", text: r.error.message ?? "Google sign-in failed" });
    } catch {
      setMsg({ kind: "err", text: "Could not connect to Google. Please try again." });
    } finally { if (!redirecting) setBusy(null); }
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

        <Button onClick={google} type="button" disabled={Boolean(busy) || loading} variant="outline"
          className="google-sign-in mt-6 h-12 w-full gap-2.5">
          {busy === "google" ? <LoaderCircle className="size-[18px] animate-spin" /> : <svg aria-hidden="true" className="size-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>}
          {busy === "google" ? "Connecting to Google…" : "Continue with Google"}
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {signup && <input aria-label="Your name (optional)" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" maxLength={50}
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />}
          <input required aria-label="Email" autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <input required aria-label="Password" autoComplete={signup ? "new-password" : "current-password"} type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="rounded-xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <Button type="submit" disabled={Boolean(busy) || loading} className="mt-1 h-12 w-full">
            {(busy === "email" || loading) && <LoaderCircle className="size-4 animate-spin" />}
            {loading ? "Please wait…" : busy === "email" ? "Please wait…" : signup ? "Sign up free" : "Log in"}
          </Button>
        </form>
        {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mt-3 text-sm ${msg.kind === "err" ? "text-destructive" : "text-neon-emerald"}`}>{msg.text}</p>}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? "Already have an account? " : "New to Pulse? "}
          <Link to="/auth" search={{ mode: signup ? "login" : "signup" }} className="font-semibold text-primary">
            {signup ? "Log in" : "Create an account"}
          </Link>
        </p>
        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">Stay signed in on this browser. On a shared device, log out when you’re done.</p>
      </div>
    </div>
  );
}
