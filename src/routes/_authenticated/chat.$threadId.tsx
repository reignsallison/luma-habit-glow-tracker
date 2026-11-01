import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ChatThreads, threadsQuery, threadQuery } from "@/components/ChatThreads";
import { PulseChat } from "@/components/PulseChat";
import type { UIMessage } from "ai";
export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Your Conversation — Pulse Guide" },
      { name: "description", content: "Your private saved conversation with Pulse Guide." },
      { property: "og:title", content: "Your Conversation — Pulse Guide" },
      { property: "og:description", content: "A private space for thoughtful AI conversation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(threadsQuery),
      context.queryClient.fetchQuery(threadQuery(params.threadId)),
    ]);
  },
  component: ChatPage,
});
function ChatPage() {
  const { threadId } = Route.useParams();
  const { data } = useSuspenseQuery(threadQuery(threadId));
  return (
    <AppShell title="Pulse Guide" subtitle="Your thinking partner">
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <ChatThreads activeId={threadId} />
        <PulseChat
          key={threadId}
          threadId={threadId}
          initialMessages={data.messages as unknown as UIMessage[]}
        />
      </div>
    </AppShell>
  );
}
