import { createFileRoute } from "@tanstack/react-router";
import { handleRoutine } from "@/lib/routine.server";

export const Route = createFileRoute("/api/routine")({
  staticData: { sitemap: false },
  server: { handlers: { POST: ({ request }) => handleRoutine(request) } },
});