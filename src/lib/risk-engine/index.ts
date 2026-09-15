export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type RiskFactorType = "risk_hour" | "vulnerable_mood" | "recent_high_urge" | "alone" | "missing_checkin" | "risk_weekday";
export type RiskInput = { isRiskHour?: boolean; mood?: number | null; recentUrge?: number | null; isAlone?: boolean; hoursSinceCheckin?: number | null; isRiskWeekday?: boolean };

const contributions: Record<RiskFactorType, number> = { risk_hour: 20, vulnerable_mood: 15, recent_high_urge: 25, alone: 10, missing_checkin: 10, risk_weekday: 10 };

export function calculateRiskScore(input: RiskInput) {
  const active: RiskFactorType[] = [];
  if (input.isRiskHour) active.push("risk_hour");
  if (input.mood != null && input.mood <= 2) active.push("vulnerable_mood");
  if (input.recentUrge != null && input.recentUrge >= 7) active.push("recent_high_urge");
  if (input.isAlone) active.push("alone");
  if (input.hoursSinceCheckin == null || input.hoursSinceCheckin >= 36) active.push("missing_checkin");
  if (input.isRiskWeekday) active.push("risk_weekday");
  const score = Math.min(100, active.reduce((sum, type) => sum + contributions[type], 0));
  const level: RiskLevel = score >= 80 ? "critical" : score >= 60 ? "high" : score >= 30 ? "moderate" : "low";
  return { score, level, factors: active.map((type) => ({ type, contribution: contributions[type] })) };
}

export function isTimeInRiskWindow(current: string, start?: string | null, end?: string | null) {
  if (!start || !end) return false;
  const minutes = (value: string) => { const [hour, minute] = value.slice(0, 5).split(":").map(Number); return hour * 60 + minute; };
  const now = minutes(current), from = minutes(start), to = minutes(end);
  return from <= to ? now >= from && now <= to : now >= from || now <= to;
}
