import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function GrowthTracking() {
  useEffect(() => {
    if (navigator.doNotTrack !== "1") {
      void fetch("/api/public/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "visit" }) }).catch(() => {});
    }
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session) return;
      // Do not make another auth API call inside the auth callback.
      void fetch("/api/public/activity", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ kind: "login" }) }).catch(() => {});
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return null;
}