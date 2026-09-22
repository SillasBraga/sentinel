import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isPrivateMilestoneId, type PrivateMilestoneId } from "@/lib/private-milestones";

export async function awardPrivateMilestones() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("award_private_milestones");
  if (error) return { success: false as const };
  return {
    success: true as const,
    milestoneIds: (data ?? []).map((row: { achievement_id: string }) => row.achievement_id).filter(isPrivateMilestoneId) as PrivateMilestoneId[],
  };
}
