import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getPresenceProgress, type PresenceXpSource } from "@/lib/presence-xp";

export async function awardPresenceXp(source: PresenceXpSource, sourceKey: string) {
  const supabase = await createClient();
  const { data: beforeEvents, error: beforeError } = await supabase.from("presence_xp_events").select("points");
  if (beforeError) return { success: false as const };
  const before = getPresenceProgress((beforeEvents ?? []).reduce((total, event) => total + event.points, 0));
  const { data, error } = await supabase.rpc("award_presence_xp", { p_source: source, p_source_key: sourceKey });
  if (error) return { success: false as const };
  if (!data) return { success: true as const, awarded: false, levelUp: false, level: before.level };
  const { data: afterEvents, error: afterError } = await supabase.from("presence_xp_events").select("points");
  if (afterError) return { success: false as const };
  const after = getPresenceProgress((afterEvents ?? []).reduce((total, event) => total + event.points, 0));
  return { success: true as const, awarded: true, levelUp: after.level > before.level, level: after.level };
}
