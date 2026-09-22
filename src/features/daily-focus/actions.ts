"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const focusSchema = z.string().trim().min(1).max(160);

export async function saveDailyFocus(formData: FormData) {
  const focus = focusSchema.safeParse(formData.get("focus"));
  if (!focus.success) redirect("/app/dashboard?error=Escreva um foco de até 160 caracteres.");

  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const { error } = await supabase.from("daily_focuses").upsert({ user_id: user.id, local_date: localDate, focus: focus.data, completed_at: null, updated_at: new Date().toISOString() }, { onConflict: "user_id,local_date" });
  if (error) redirect("/app/dashboard?error=Não foi possível salvar o foco de hoje.");

  revalidatePath("/app/dashboard");
  redirect("/app/dashboard?toast=Foco de hoje salvo.");
}

export async function toggleDailyFocusCompletion(formData: FormData) {
  const completed = z.enum(["true", "false"]).safeParse(formData.get("completed"));
  if (!completed.success) redirect("/app/dashboard?error=Não foi possível atualizar o foco de hoje.");

  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const { error } = await supabase.from("daily_focuses").update({ completed_at: completed.data === "true" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("user_id", user.id).eq("local_date", localDate);
  if (error) redirect("/app/dashboard?error=Não foi possível atualizar o foco de hoje.");

  revalidatePath("/app/dashboard");
  redirect(`/app/dashboard?toast=${completed.data === "true" ? "Foco concluído. Bom trabalho." : "Foco marcado como pendente."}`);
}
