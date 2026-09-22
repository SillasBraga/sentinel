"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { updateDailyMission } from "@/features/daily-missions/service";
import { awardPresenceXp } from "@/features/presence-xp/service";

function feedback(path: string, type: "toast" | "error", message: string): Route {
  return `${path}${path.includes("?") ? "&" : "?"}${type}=${encodeURIComponent(message)}` as Route;
}

function withLevelUp(path: Route, level?: number): Route {
  return level ? `${path}${path.includes("?") ? "&" : "?"}levelUp=${level}` as Route : path;
}

export async function completeProtectionMission() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const result = await updateDailyMission(user.id, localDate, { protectionCompleted: true });

  if (!result.success) redirect(feedback("/app/dashboard", "error", "Não foi possível registrar o power-up de hoje."));
  const xp = await awardPresenceXp("protection", localDate);
  if (!xp.success) redirect(feedback("/app/dashboard", "error", "Power-up concluído, mas não foi possível registrar o XP."));
  revalidatePath("/app/dashboard");
  redirect(withLevelUp(feedback("/app/dashboard", "toast", result.summary.isComplete ? "Missões de hoje concluídas. Um passo de cada vez." : `Power-up de proteção concluído.${xp.awarded ? " +10 XP." : ""}`), xp.levelUp ? xp.level : undefined));
}

export async function completePowerUp(formData: FormData) {
  const input = z.object({ powerUpId: z.uuid(), returnTo: z.enum(["dashboard", "plan"]).default("dashboard") }).safeParse({ powerUpId: formData.get("powerUpId"), returnTo: formData.get("returnTo") || "dashboard" });
  const path = input.success && input.data.returnTo === "plan" ? "/app/plan" : "/app/dashboard";
  if (!input.success) redirect(feedback(path, "error", "Não foi possível identificar este power-up."));
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const { data: completed, error } = await supabase.rpc("complete_power_up", { p_activity_id: input.data.powerUpId, p_local_date: localDate });
  if (error) redirect(feedback(path, "error", "Não foi possível concluir este power-up."));
  const result = await updateDailyMission(user.id, localDate, { protectionCompleted: true });
  if (!result.success) redirect(feedback(path, "error", "Power-up concluído, mas não foi possível atualizar as missões."));
  const xp = await awardPresenceXp("protection", localDate);
  if (!xp.success) redirect(feedback(path, "error", "Power-up concluído, mas não foi possível registrar o XP."));
  revalidatePath("/app/dashboard");
  revalidatePath("/app/plan");
  redirect(withLevelUp(feedback(path, "toast", completed ? `${input.data.returnTo === "plan" ? "Power-up concluído." : "Power-up concluído."}${xp.awarded ? " +10 XP." : ""}` : "Este power-up já foi concluído hoje."), xp.levelUp ? xp.level : undefined));
}
