export type GrowthSummary = {
  visitors: number;
  signups: number;
  logins: number;
  returning: number;
  totalAccounts: number;
  trackingSince: string | null;
  daily: { day: string; visitors: number; signups: number; logins: number }[];
};

export const growthRules = {
  isReturn(previousDay: string, currentDay: string) {
    return previousDay < currentDay;
  },
  dailyKey(kind: "visit" | "login" | "signup", actor: string, date: Date) {
    return `${kind}:${actor}:${date.toISOString().slice(0, 10)}`;
  },
};
