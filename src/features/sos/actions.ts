"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import { awardPresenceXp } from "@/features/presence-xp/service";

export async function startSOS(initialIntensity: number): Promise<ActionResult<{ id: string }>> {
  const intensity = z.number().int().min(0).max(10).safeParse(initialIntensity); if (!intensity.success) return { success: false, error: "Intensidade inválida." };
  const user = await requireUser(); const supabase = await createClient(); const { data, error } = await supabase.from("sos_sessions").insert({ user_id: user.id, initial_intensity: intensity.data }).select("id").single();
  return error ? { success: false, error: "Não foi possível iniciar o registro. O protocolo continua disponível." } : { success: true, data };
}
export async function finishSOS(input: { id: string; finalIntensity: number; environment: string; strategies: string[]; durationSeconds: number }): Promise<ActionResult<{ awardedXp: boolean; levelUp: boolean; level: number }>> {
  const parsed = z.object({ id: z.uuid(), finalIntensity: z.number().int().min(0).max(10), environment: z.string().max(80), strategies: z.array(z.string()).max(10), durationSeconds: z.number().int().min(0).max(7200) }).safeParse(input); if (!parsed.success) return { success: false, error: "Não foi possível validar o resultado." };
  const user = await requireUser(); const supabase = await createClient(); const { error } = await supabase.from("sos_sessions").update({ final_intensity: parsed.data.finalIntensity, environment: parsed.data.environment, strategies: parsed.data.strategies, duration_seconds: parsed.data.durationSeconds, finished_at: new Date().toISOString(), completed: true }).eq("id", parsed.data.id).eq("user_id", user.id);
  if (error) return { success: false, error: "Não foi possível salvar o resultado." };
  const xp = await awardPresenceXp("sos", parsed.data.id);
  if (!xp.success) return { success: false, error: "Protocolo salvo, mas não foi possível registrar o XP." };
  revalidatePath("/app/dashboard");
  revalidatePath("/app/progress");
  revalidatePath("/app/calendar");
  return { success: true, data: { awardedXp: xp.awarded, levelUp: xp.levelUp, level: xp.level } };
}
