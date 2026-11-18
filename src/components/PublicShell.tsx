import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function PublicHeader() {
  return <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5">
    <Link to="/" aria-label="Pulse home" className="flex items-center gap-2 font-display text-2xl font-bold"><Activity className="size-7 text-primary" />Pulse<span className="hidden font-sans text-xs font-normal text-muted-foreground sm:inline">DAILY ROUTINE</span></Link>
    <nav className="flex gap-2" aria-label="Account"><Button variant="ghost" className="min-h-11" asChild><Link to="/auth" search={{ mode: "login" }}>Log in</Link></Button><Button className="min-h-11" asChild><Link to="/auth" search={{ mode: "signup" }}>Sign up<ArrowRight /></Link></Button></nav>
  </header>;
}
export function PublicFooter() {
  return <footer className="border-t border-border"><div className="mx-auto max-w-6xl px-5 py-8">
    <div className="flex flex-wrap items-center justify-between gap-5"><Link to="/" className="flex items-center gap-2 font-display text-xl font-bold"><Activity className="size-5 text-neon-emerald" />Pulse</Link><nav aria-label="Legal and contact" className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground"><Link className="inline-flex min-h-11 items-center hover:text-foreground" to="/privacy">Privacy Policy</Link><Link className="inline-flex min-h-11 items-center hover:text-foreground" to="/terms">Terms of Service</Link><Link className="inline-flex min-h-11 items-center hover:text-foreground" to="/contact">Contact / Feedback</Link></nav></div>
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">© {new Date().getFullYear()} Pulse · Free, no-download daily routine tracker.</p>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Pulse Guide offers general wellness support, not medical advice. Your goals should suit your individual needs.</p>
  </div></footer>;
}
export function PublicDocument({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <div className="min-h-screen"><PublicHeader /><main className="mx-auto max-w-3xl px-5 py-12 md:py-16"><p className="mb-3 text-xs font-semibold uppercase text-neon-emerald">PULSE</p><h1 className="text-4xl font-bold">{title}</h1><p className="mt-5 text-base leading-relaxed text-muted-foreground">{intro}</p><div className="public-document mt-10 space-y-9">{children}</div></main><PublicFooter /></div>;
}