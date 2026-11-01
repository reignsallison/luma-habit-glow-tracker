import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChatThreads, threadsQuery } from "@/components/ChatThreads";
import { Activity } from "lucide-react";
export const Route = createFileRoute("/_authenticated/chat/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Chat with Pulse Guide — Pulse" }, { name: "description", content: "Private AI conversations, saved across your devices." }, { property: "og:title", content: "Chat with Pulse Guide — Pulse" }, { property: "og:description", content: "Explore ideas and build achievable plans with Pulse Guide." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(threadsQuery),
  component: () => <AppShell title="Pulse Guide" subtitle="Your thinking partner"><div className="grid gap-6 lg:grid-cols-[220px_1fr]"><ChatThreads /><section className="py-8"><Activity className="size-10 text-neon-emerald mb-5" /><h2 className="text-2xl font-display mb-2">Space to think things through.</h2><p className="text-muted-foreground text-sm">Start a new conversation, or pick up where you left off.</p></section></div></AppShell>,
});