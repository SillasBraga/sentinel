"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { updateDailyMission } from "@/features/daily-missions/service";

function feedback(path: string, type: "toast" | "error", message: string): Route {
  return `${path}${path.includes("?") ? "&" : "?"}${type}=${encodeURIComponent(message)}` as Route;
}

export async function completeProtectionMission() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const result = await updateDailyMission(user.id, localDate, { protectionCompleted: true });

  if (!result.success) redirect(feedback("/app/dashboard", "error", "Não foi possível registrar o power-up de hoje."));
  revalidatePath("/app/dashboard");
  redirect(feedback("/app/dashboard", "toast", result.summary.isComplete ? "Missões de hoje concluídas. Um passo de cada vez." : "Power-up de proteção concluído."));
}
