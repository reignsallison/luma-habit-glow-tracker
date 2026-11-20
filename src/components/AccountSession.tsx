import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { unbindUser } from "@/lib/store";
import { growthRules } from "@/lib/growth";

const AccountContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export function AccountSession({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: true });
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    let transition = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      transition++;
      setAccount({ user: session?.user ?? null, loading: false });
      // Run router work outside the auth callback, which holds the auth lock.
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!active) return;
        if (event === "SIGNED_OUT") { queryClient.clear(); unbindUser(); }
        else void queryClient.invalidateQueries();
        void router.invalidate();
      }, 0);
      timers.add(timer);
      if (event === "SIGNED_IN" && session && growthRules.isFreshLogin(session.user.last_sign_in_at, Date.now())) {
        void fetch("/api/public/activity", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ kind: "login" }) }).catch(() => {});
      }
    });
    const initialTransition = transition;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && initialTransition === transition) setAccount({ user: data.user, loading: false });
    }).catch(() => {
      if (active && initialTransition === transition) setAccount({ user: null, loading: false });
    });
    return () => { active = false; data.subscription.unsubscribe(); timers.forEach(clearTimeout); };
  }, [router, queryClient]);
  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
}

export const useAccount = () => useContext(AccountContext);

export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) return;
    unbindUser();
    await navigate({ to: "/auth", replace: true });
  };
}