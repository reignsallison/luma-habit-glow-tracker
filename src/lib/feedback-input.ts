import { z } from "zod";
export const feedbackSchema = z.object({
  topic: z.enum(["feedback", "help", "privacy"]),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(3000),
});