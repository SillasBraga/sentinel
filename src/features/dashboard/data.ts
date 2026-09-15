import "server-only";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { calculateAlignedDaysRate, calculateCurrentStreak, calculateLongestStreak } from "@/lib/analytics/recovery";
import { calculateRiskScore, isTimeInRiskWindow } from "@/lib/risk-engine";

export async function getDashboardData() {
  const user = await requireUser(); const supabase = await createClient();
  const [profileResult, recoveryResult, relapsesResult, checkinResult, urgeResult, habitsResult] = await Promise.all([
    supabase.from("profiles").select("display_name,timezone,hide_sensitive_numbers,onboarding_completed").eq("id", user.id).single(),
    supabase.from("recovery_profiles").select("started_at,risk_start,risk_end").eq("user_id", user.id).single(),
    supabase.from("relapse_events").select("occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: true }),
    supabase.from("daily_checkins").select("mood,urge_level,situations,occurred_at,local_date").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("urges").select("intensity,occurred_at,alone").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("habits").select("id,name").eq("user_id", user.id).eq("active", true).limit(3)
  ]);
  const profile = profileResult.data; const recovery = recoveryResult.data;
  const timezone = profile?.timezone ?? "America/Sao_Paulo"; const now = new Date();
  const events = [{ type: "start" as const, occurredAt: recovery?.started_at ?? now.toISOString() }, ...(relapsesResult.data ?? []).map((row) => ({ type: "relapse" as const, occurredAt: row.occurred_at }))];
  const streak = calculateCurrentStreak(events, now, timezone); const longest = calculateLongestStreak(events, now, timezone);
  const aligned = calculateAlignedDaysRate((relapsesResult.data ?? []).map((row) => row.occurred_at), now, timezone);
  const lastCheckin = checkinResult.data; const lastUrge = urgeResult.data;
  const checkinAge = lastCheckin ? (Date.now() - new Date(lastCheckin.occurred_at).getTime()) / 3_600_000 : null;
  const urgeAge = lastUrge ? (Date.now() - new Date(lastUrge.occurred_at).getTime()) / 3_600_000 : null;
  const recentUrges = [checkinAge !== null && checkinAge < 36 ? lastCheckin?.urge_level : null, urgeAge !== null && urgeAge < 24 ? lastUrge?.intensity : null].filter((value): value is number => value != null);
  const localTime = new Intl.DateTimeFormat("pt-BR", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const risk = calculateRiskScore({ isRiskHour: isTimeInRiskWindow(localTime,recovery?.risk_start,recovery?.risk_end), mood: lastCheckin?.mood, recentUrge: recentUrges.length ? Math.max(...recentUrges) : null, isAlone: Boolean((checkinAge !== null && checkinAge < 36 && lastCheckin?.situations?.includes("Sozinho")) || (urgeAge !== null && urgeAge < 24 && lastUrge?.alone)), hoursSinceCheckin: checkinAge });
  return { profile, streak, longest, aligned, risk, lastCheckin, habits: habitsResult.data ?? [] };
}
