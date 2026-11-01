import { requestAuth } from "./request-auth.server";
import { growthRules } from "./growth";

export async function recordGrowth(request: Request) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ message: "Not allowed" }, { status: 403, headers });
  const body = (await request.json().catch(() => null)) as { kind?: string } | null;
  if (body?.kind !== "visit" && body?.kind !== "login")
    return Response.json({ message: "Invalid event" }, { status: 400, headers });
  let actor: string;
  if (body.kind === "login") {
    const auth = await requestAuth(request);
    if (!auth) return Response.json({ message: "Sign in required" }, { status: 401, headers });
    if (!growthRules.isFreshLogin(auth.user.last_sign_in_at, Date.now())) return Response.json({ ok: true }, { headers });
    actor = auth.user.id;
  } else {
    const existing = request.headers
      .get("cookie")
      ?.match(/(?:^|;\s*)pulse_visitor=([a-f0-9-]{36})(?:;|$)/)?.[1];
    actor = existing || crypto.randomUUID();
    if (!existing)
      headers.set(
        "Set-Cookie",
        `pulse_visitor=${actor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`,
      );
  }
  // Raw events never leave the server; signed-in users receive only the aggregate RPC.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("growth_events")
    .upsert({ kind: body.kind, actor }, { onConflict: "kind,actor,day", ignoreDuplicates: true });
  if (error)
    return Response.json({ message: "Activity could not be recorded" }, { status: 503, headers });
  return Response.json({ ok: true }, { headers });
}
