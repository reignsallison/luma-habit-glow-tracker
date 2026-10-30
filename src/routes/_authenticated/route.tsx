import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { bindUser } from "@/lib/store";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    await bindUser(data.user.id, data.user.email ?? "");
    return { user: data.user };
  },
  component: () => <Outlet />,
});
