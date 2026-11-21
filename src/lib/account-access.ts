import type { SupabaseClient } from "@supabase/supabase-js";

// Auto-confirm normally returns a session immediately. Older unconfirmed
// accounts/configuration may need an explicit password sign-in instead.
export async function signUpAndSignIn(
  auth: Pick<SupabaseClient["auth"], "signUp" | "signInWithPassword">,
  email: string,
  password: string,
  name: string,
  origin: string,
) {
  const result = await auth.signUp({
    email: email.trim(), password,
    options: { emailRedirectTo: origin, data: { display_name: name.trim() } },
  });
  if (result.error || result.data.session) return result;
  return auth.signInWithPassword({ email: email.trim(), password });
}