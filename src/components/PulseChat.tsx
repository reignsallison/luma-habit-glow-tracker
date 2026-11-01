import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Tool, ToolHeader, ToolContent, ToolOutput } from "@/components/ai-elements/tool";

export function PulseChat({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
}) {
  const queryClient = useQueryClient();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [stopped, setStopped] = useState(false);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { threadId },
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
        },
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          if (!response.ok) {
            const payload = await response
              .clone()
              .json()
              .catch(() => null);
            throw new Error(payload?.message || "Chat is unavailable. Please try again later.");
          }
          return response;
        },
      }),
    [threadId],
  );
  const { messages, sendMessage, status, error, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      void queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      void queryClient.invalidateQueries({ queryKey: ["chat-thread", threadId] });
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    textarea.current?.focus();
    if (window.matchMedia("(max-width: 767px)").matches) {
      textarea.current?.scrollIntoView({ block: "center" });
    }
  }, [threadId, busy]);
  return (
    <div className="flex min-w-0 h-[65vh] min-h-96 flex-col">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Activity className="size-5 text-neon-emerald" />
        <h2 className="font-semibold">Pulse Guide</h2>
        <span className="ml-auto text-xs text-muted-foreground">Private chat</span>
      </div>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="px-0 py-5 gap-6">
          {!messages.length && (
            <div className="py-8">
              <h3 className="font-display text-2xl mb-2">What’s on your mind?</h3>
              <p className="text-sm text-muted-foreground">
                A better routine, a tricky question, or a plan for tomorrow.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                {message.parts.map((part, index) => {
                  if (part.type === "text")
                    return <MessageResponse key={index}>{part.text}</MessageResponse>;
                  if (part.type === "reasoning" && part.text)
                    return (
                      <details key={index} className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer">Thinking notes</summary>
                        <MessageResponse>{part.text}</MessageResponse>
                      </details>
                    );
                  if (part.type === "tool-readTracker")
                    return (
                      <Tool key={index} defaultOpen={false}>
                        <ToolHeader title="Your tracker" type={part.type} state={part.state} />
                        <ToolContent>
                          <ToolOutput
                            output={part.state === "output-available" ? part.output : undefined}
                            errorText={part.state === "output-error" ? part.errorText : undefined}
                          />
                        </ToolContent>
                      </Tool>
                    );
                  return null;
                })}
              </MessageContent>
              {message.role === "assistant" &&
                message.parts.some((part) => part.type === "text") && (
                  <MessageActions>
                    <MessageAction
                      tooltip="Copy reply"
                      onClick={() =>
                        void navigator.clipboard.writeText(
                          message.parts
                            .filter((p) => p.type === "text")
                            .map((p) => p.text)
                            .join("\n"),
                        )
                      }
                    >
                      <Copy />
                    </MessageAction>
                  </MessageActions>
                )}
            </Message>
          ))}
          {busy && (
            <div role="status">
              <Shimmer>{status === "submitted" ? "Thinking…" : "Working on your reply…"}</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {error && (
        <p role="alert" className="text-sm text-destructive pb-3 break-words">
          {error.message}
        </p>
      )}
      {stopped && (
        <p role="status" className="text-xs text-muted-foreground pb-2">
          Stopped. Partial replies remain in this chat.
        </p>
      )}
      <PromptInput
        onSubmit={async ({ text }) => {
          if (!text.trim() || busy) return;
          setStopped(false);
          await sendMessage({ text });
          textarea.current?.focus();
        }}
      >
        <PromptInputTextarea
          ref={textarea}
          aria-label="Message Pulse Guide"
          placeholder="Message Pulse Guide…"
          maxLength={20000}
          disabled={busy}
          className="min-h-20 scroll-mb-32"
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            status={status}
            onStop={() => {
              setStopped(true);
              void stop();
              textarea.current?.focus();
            }}
          />
        </PromptInputFooter>
      </PromptInput>
      <p className="mt-2 text-xs text-muted-foreground">
        AI can make mistakes. For medical advice, speak with a qualified professional.
      </p>
    </div>
  );
}
