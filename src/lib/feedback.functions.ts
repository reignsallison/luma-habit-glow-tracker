import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { feedbackSchema } from "@/lib/feedback-input";

export const submitFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(feedbackSchema)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("feedback_submissions").insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message.includes("wait") ? "Please wait before sending more feedback." : "Your message could not be saved. Please try again.");
    return { ok: true };
  });