import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { UIMessage } from "ai";

export const listThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("chat_threads").select("id,title,updated_at").eq("user_id", context.userId).order("updated_at", { ascending: false });
  if (error) throw new Error("Your conversations could not be loaded.");
  return data;
});
export const createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("chat_threads").insert({ user_id: context.userId }).select("id").single();
  if (error || !data) throw new Error("A new conversation could not be created.");
  return data;
});
export const getThread = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data: input, context }) => {
  const { data, error } = await context.supabase.from("chat_threads").select("id,title,messages,updated_at").eq("id", input.id).eq("user_id", context.userId).single();
  if (error || !data) throw new Error("This conversation is unavailable.");
  return { ...data, messages: data.messages as unknown as UIMessage[] };
});
export const deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.id).eq("user_id", context.userId);
  if (error) throw new Error("Conversation could not be deleted.");
  return { ok: true };
});