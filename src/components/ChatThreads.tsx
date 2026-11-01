import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createThread, deleteThread, listThreads, getThread } from "@/lib/chat.functions";

export const threadsQuery = queryOptions({ queryKey: ["chat-threads"], queryFn: () => listThreads() });
export const threadQuery = (id: string) => queryOptions({ queryKey: ["chat-thread", id], queryFn: () => getThread({ data: { id } }), staleTime: 0 });

export function ChatThreads({ activeId }: { activeId?: string }) {
  const { data } = useSuspenseQuery(threadsQuery);
  const create = useServerFn(createThread);
  const remove = useServerFn(deleteThread);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function newChat() {
    setBusy(true); setError("");
    try { const thread = await create(); await queryClient.invalidateQueries({ queryKey: ["chat-threads"] }); await navigate({ to: "/chat/$threadId", params: { threadId: thread.id } }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create chat."); }
    finally { setBusy(false); }
  }
  async function deleteChat(id: string) {
    if (!window.confirm("Delete this conversation and its history?")) return;
    setBusy(true);
    try { await remove({ data: { id } }); await queryClient.invalidateQueries({ queryKey: ["chat-threads"] }); if (activeId === id) await navigate({ to: "/chat" }); }
    catch { setError("Conversation could not be deleted."); }
    finally { setBusy(false); }
  }
  return <aside className="min-w-0 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4">
    <Button onClick={() => void newChat()} disabled={busy} className="w-full mb-3"><Plus />New chat</Button>
    {error && <p role="alert" className="text-xs text-destructive mb-3">{error}</p>}
    <div className="max-h-40 lg:max-h-[55vh] overflow-y-auto space-y-1">
      {data.map((thread) => <div key={thread.id} className={`flex items-center gap-1 rounded-lg ${activeId === thread.id ? "bg-accent" : ""}`}>
        <Link to="/chat/$threadId" params={{ threadId: thread.id }} className="flex min-w-0 flex-1 items-center gap-2 p-2 text-sm"><MessageCircle className="size-4 shrink-0 text-primary" /><span className="truncate">{thread.title}</span></Link>
        <Button variant="ghost" size="icon-sm" title="Delete conversation" aria-label={`Delete ${thread.title}`} disabled={busy} onClick={() => void deleteChat(thread.id)}><Trash2 className="size-3" /></Button>
      </div>)}
    </div>
  </aside>;
}