import { createFileRoute } from "@tanstack/react-router";
import { recordGrowth } from "@/lib/growth.server";
export const Route = createFileRoute("/api/public/activity")({ staticData: { sitemap: false }, server: { handlers: { POST: ({ request }) => recordGrowth(request) } } });