import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PresenceXpSource } from "@/lib/presence-xp";

export async function awardPresenceXp(source: PresenceXpSource, sourceKey: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("award_presence_xp", { p_source: source, p_source_key: sourceKey });
  return error ? { success: false as const } : { success: true as const, awarded: Boolean(data) };
}
