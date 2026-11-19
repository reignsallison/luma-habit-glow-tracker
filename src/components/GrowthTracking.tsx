import { useEffect } from "react";

export function GrowthTracking() {
  useEffect(() => {
    if (navigator.doNotTrack !== "1") {
      void fetch("/api/public/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "visit" }),
      }).catch(() => {});
    }
  }, []);
  return null;
}
