import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, UserPlus, LogIn, Repeat2, RefreshCw, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { GrowthSummary } from "@/lib/growth";

const growthQuery = (days: number) => queryOptions({ queryKey: ["growth", days], queryFn: async () => {
  const { data, error } = await supabase.rpc("growth_summary", { days });
  if (error) throw new Error("Growth counts could not be loaded. Please refresh.");
  return data as unknown as GrowthSummary;
}, staleTime: 30000 });
export const Route = createFileRoute("/_authenticated/growth")({
  staticData: { sitemap: false },
  head: () => ({ meta: [ { title: "Real Growth — Pulse" }, { name: "description", content: "Real Pulse visitor, signup, login and return activity." }, { property: "og:title", content: "Real Growth — Pulse" }, { property: "og:description", content: "Follow aggregate Pulse community growth." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" } ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(growthQuery(30)),
  component: GrowthPage,
});
function GrowthPage() {
  const [days, setDays] = useState(30);
  const { data, refetch, isFetching } = useSuspenseQuery(growthQuery(days));
  const metrics = [
    { label: "Visitors", value: data.visitors, icon: Users, accent: "text-neon-blue", detail: "Unique browsers in this period" },
    { label: "Signups", value: data.signups, icon: UserPlus, accent: "text-neon-emerald", detail: "Accounts created in this period" },
    { label: "Logins", value: data.logins, icon: LogIn, accent: "text-neon-violet", detail: "Successful sign-in days per account" },
    { label: "Returning visitors", value: data.returning, icon: Repeat2, accent: "text-primary", detail: "Browsers visiting on a later UTC day" },
  ];
  const max = Math.max(1, ...data.daily.map((d) => Math.max(d.visitors, d.signups, d.logins)));
  return <AppShell title="Real growth" subtitle="Pulse community · Live recorded activity">
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div className="flex gap-2">{[7, 30, 90].map((n) => <Button key={n} variant={n === days ? "default" : "secondary"} aria-pressed={n === days} onClick={() => setDays(n)}>{n} days</Button>)}</div>
      <Button variant="outline" size="icon" aria-label="Refresh growth" title="Refresh growth" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className={isFetching ? "animate-spin" : ""} /></Button>
    </div>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {metrics.map(({ label, value, icon: Icon, accent, detail }) => <article key={label} className="rounded-lg border border-border bg-card p-4 min-w-0"><Icon className={`size-5 mb-4 ${accent}`} /><p className="font-display font-bold text-3xl">{value.toLocaleString()}</p><h2 className="font-semibold text-sm mt-1">{label}</h2><p className="text-xs text-muted-foreground mt-2">{detail}</p></article>)}
    </div>
    <section className="border-y border-border py-6">
      <h2 className="font-display text-xl flex items-center gap-2 mb-5"><TrendingUp className="size-5 text-neon-emerald" />Daily activity</h2>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4"><span className="text-neon-blue">● Visitors</span><span className="text-neon-emerald">● Signups</span><span className="text-neon-violet">● Logins</span></div>
      <div className="overflow-x-auto">
        <div className="flex items-end gap-2 h-48 min-w-max border-b border-border" role="img" aria-label="Daily visitor, signup and login counts">
          {data.daily.map((day) => <div key={day.day} title={`${day.day}: ${day.visitors} visitors, ${day.signups} signups, ${day.logins} login days`} className="w-5 h-full flex items-end gap-0.5">
            {([['visitors', 'bg-neon-blue'], ['signups', 'bg-neon-emerald'], ['logins', 'bg-neon-violet']] as const).map(([key, color]) => <div key={key} className={`w-1.5 rounded-t-sm ${color}`} style={{ height: `${day[key] / max * 100}%` }} />)}
          </div>)}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>{data.daily[0]?.day}</span><span>{data.daily.at(-1)?.day}</span></div>
      {!data.visitors && !data.signups && !data.logins && <p className="mt-4 text-sm text-muted-foreground">No recorded activity in this period yet.</p>}
    </section>
    <div className="mt-6 flex flex-wrap gap-6 text-sm"><p><strong>{data.totalAccounts}</strong> total accounts</p><p className="text-muted-foreground">Visitor tracking {data.trackingSince ? `since ${data.trackingSince.slice(0, 10)}` : "starts with the first visit"}</p></div>
    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">Aggregate counts only. Visits use a first-party browser identifier and respect Do Not Track. Repeat visits and logins on the same UTC day count once. Existing account creation dates are included; earlier visits and logins are unavailable. Preview checks also count.</p>
  </AppShell>;
}