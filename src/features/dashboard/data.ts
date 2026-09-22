import "server-only";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { calculateAlignedDaysRate, calculateAverageUrge, calculateCurrentStreak, calculateLongestStreak } from "@/lib/analytics/recovery";
import { calculateRiskScore, isTimeInRiskWindow } from "@/lib/risk-engine";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { summarizeDailyMissions } from "@/lib/daily-missions";

export async function getDashboardData() {
  const user = await requireUser();
  const supabase = await createClient();
  const [profileResult, recoveryResult, relapsesResult, checkinsResult, urgesResult, sosResult] = await Promise.all([
    supabase.from("profiles").select("display_name,timezone,hide_sensitive_numbers,onboarding_completed").eq("id", user.id).single(),
    supabase.from("recovery_profiles").select("started_at,risk_start,risk_end").eq("user_id", user.id).single(),
    supabase.from("relapse_events").select("occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: true }),
    supabase.from("daily_checkins").select("mood,urge_level,situations,occurred_at,local_date").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(100),
    supabase.from("urges").select("intensity,occurred_at,alone").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(100),
    supabase.from("sos_sessions").select("started_at").eq("user_id", user.id).eq("completed", true).order("started_at", { ascending: false }).limit(100),
  ]);

  const profile = profileResult.data;
  const recovery = recoveryResult.data;
  const timezone = profile?.timezone ?? "America/Sao_Paulo";
  const now = new Date();
  const localDate = formatInTimeZone(now.toISOString(), timezone);
  const [{ data: mission }, { data: habitLogs }] = await Promise.all([
    supabase.from("daily_missions").select("checkin_completed,habit_completed,protection_completed").eq("user_id", user.id).eq("local_date", localDate).maybeSingle(),
    supabase.from("habit_logs").select("id").eq("user_id", user.id).eq("local_date", localDate),
  ]);
  const thirtyDaysAgo = now.getTime() - 30 * 86_400_000;
  const relapses = relapsesResult.data ?? [];
  const checkins = checkinsResult.data ?? [];
  const urges = urgesResult.data ?? [];
  const events = [
    { type: "start" as const, occurredAt: recovery?.started_at ?? now.toISOString() },
    ...relapses.map((row) => ({ type: "relapse" as const, occurredAt: row.occurred_at })),
  ];

  const streak = calculateCurrentStreak(events, now, timezone);
  const longest = calculateLongestStreak(events, now, timezone);
  const aligned = calculateAlignedDaysRate(relapses.map((row) => row.occurred_at), now, timezone);
  const lastCheckin = checkins[0] ?? null;
  const lastUrge = urges[0] ?? null;
  const checkinAge = lastCheckin ? (now.getTime() - new Date(lastCheckin.occurred_at).getTime()) / 3_600_000 : null;
  const urgeAge = lastUrge ? (now.getTime() - new Date(lastUrge.occurred_at).getTime()) / 3_600_000 : null;
  const recentUrges = [
    checkinAge !== null && checkinAge < 36 ? lastCheckin?.urge_level : null,
    urgeAge !== null && urgeAge < 24 ? lastUrge?.intensity : null,
  ].filter((value): value is number => value != null);
  const localTime = new Intl.DateTimeFormat("pt-BR", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const risk = calculateRiskScore({
    isRiskHour: isTimeInRiskWindow(localTime, recovery?.risk_start, recovery?.risk_end),
    mood: lastCheckin?.mood,
    recentUrge: recentUrges.length ? Math.max(...recentUrges) : null,
    isAlone: Boolean((checkinAge !== null && checkinAge < 36 && lastCheckin?.situations?.includes("Sozinho")) || (urgeAge !== null && urgeAge < 24 && lastUrge?.alone)),
    hoursSinceCheckin: checkinAge,
  });
  const intensityValues = [
    ...checkins.filter((item) => new Date(item.occurred_at).getTime() >= thirtyDaysAgo).map((item) => item.urge_level),
    ...urges.filter((item) => new Date(item.occurred_at).getTime() >= thirtyDaysAgo).map((item) => item.intensity),
  ];
  const recentSosCount = (sosResult.data ?? []).filter((item) => new Date(item.started_at).getTime() >= thirtyDaysAgo).length;

  return {
    profile,
    streak,
    longest,
    aligned,
    risk,
    lastCheckin,
    recentAverageUrge: calculateAverageUrge(intensityValues),
    recentSosCount,
    missions: summarizeDailyMissions({
      checkinCompleted: Boolean(mission?.checkin_completed) || checkins.some((checkin) => checkin.local_date === localDate),
      habitCompleted: Boolean(mission?.habit_completed) || Boolean(habitLogs?.length),
      protectionCompleted: mission?.protection_completed ?? false,
    }),
  };
}
