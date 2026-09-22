import "server-only";
import { createClient } from "@/lib/supabase/server";
import { summarizeDailyMissions, type DailyMissionState } from "@/lib/daily-missions";

type MissionUpdate = Partial<DailyMissionState>;

export async function updateDailyMission(userId: string, localDate: string, update: MissionUpdate) {
  const supabase = await createClient();
  const [{ data: current, error: readError }, { data: checkin, error: checkinError }, { count: habitCount, error: habitError }] = await Promise.all([
    supabase.from("daily_missions").select("checkin_completed,habit_completed,protection_completed,completed_at").eq("user_id", userId).eq("local_date", localDate).maybeSingle(),
    supabase.from("daily_checkins").select("id").eq("user_id", userId).eq("local_date", localDate).maybeSingle(),
    supabase.from("habit_logs").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("local_date", localDate),
  ]);

  if (readError || checkinError || habitError) return { success: false as const };

  const summary = summarizeDailyMissions({
    checkinCompleted: update.checkinCompleted ?? (Boolean(checkin) || current?.checkin_completed || false),
    habitCompleted: update.habitCompleted ?? ((habitCount ?? 0) > 0),
    protectionCompleted: update.protectionCompleted ?? current?.protection_completed ?? false,
  });
  const { error } = await supabase.from("daily_missions").upsert({
    user_id: userId,
    local_date: localDate,
    checkin_completed: summary.checkinCompleted,
    habit_completed: summary.habitCompleted,
    protection_completed: summary.protectionCompleted,
    completed_at: summary.isComplete ? current?.completed_at ?? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,local_date" });

  return error ? { success: false as const } : { success: true as const, summary };
}
