import { differenceInCalendarDays, formatInTimeZone } from "./timezone";

export type RecoveryEvent = { occurredAt: string; type: "start" | "relapse" };

export function calculateCurrentStreak(events: RecoveryEvent[], now: Date, timezone: string) {
  const latest = [...events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0];
  if (!latest) return 0;
  return Math.max(0, differenceInCalendarDays(now.toISOString(), latest.occurredAt, timezone));
}

export function calculateLongestStreak(events: RecoveryEvent[], now: Date, timezone: string) {
  const ordered = [...events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  if (!ordered.length) return 0;
  return ordered.reduce((longest, event, index) => {
    const end = ordered[index + 1]?.occurredAt ?? now.toISOString();
    return Math.max(longest, differenceInCalendarDays(end, event.occurredAt, timezone));
  }, 0);
}

export function calculateAlignedDaysRate(relapseDates: string[], now: Date, timezone: string, windowDays = 30) {
  const today = formatInTimeZone(now.toISOString(), timezone);
  const uniqueRelapseDays = new Set(relapseDates.map((date) => formatInTimeZone(date, timezone)));
  const relevant = [...uniqueRelapseDays].filter((date) => {
    const age = differenceInCalendarDays(`${today}T12:00:00Z`, `${date}T12:00:00Z`, "UTC");
    return age >= 0 && age < windowDays;
  }).length;
  const alignedDays = Math.max(0, windowDays - relevant);
  return { alignedDays, totalDays: windowDays, rate: Math.round((alignedDays / windowDays) * 100) };
}

export function calculateAverageUrge(values: number[]) {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null;
}

export function calculateSOSSuccessRate(sessions: { initial: number; final: number }[]) {
  if (!sessions.length) return null;
  const improved = sessions.filter((session) => session.final < session.initial).length;
  return Math.round((improved / sessions.length) * 100);
}
