"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatInTimeZone } from "@/lib/analytics/timezone";

function feedback(path: string, type: "toast" | "error", message: string): Route {
  return `${path}${path.includes("?") ? "&" : "?"}${type}=${encodeURIComponent(message)}` as Route;
}

const checkinSchema = z.object({ mood: z.coerce.number().int().min(1).max(5), urgeLevel: z.coerce.number().int().min(0).max(10), exposure: z.enum(["none", "light", "moderate", "strong"]), situations: z.array(z.string()).max(8), smallWin: z.string().trim().max(500).optional() });

export async function createCheckin(formData: FormData) {
  const user = await requireUser();
  const parsed = checkinSchema.safeParse({ mood: formData.get("mood"), urgeLevel: formData.get("urgeLevel"), exposure: formData.get("exposure"), situations: formData.getAll("situations"), smallWin: formData.get("smallWin") });
  if (!parsed.success) redirect(feedback("/app/checkin", "error", "Revise as respostas antes de salvar."));
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const { data, error } = await supabase.from("daily_checkins").upsert({ user_id: user.id, local_date: formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "UTC"), mood: parsed.data.mood, urge_level: parsed.data.urgeLevel, exposure: parsed.data.exposure, situations: parsed.data.situations, small_win: parsed.data.smallWin || null, occurred_at: new Date().toISOString() }, { onConflict: "user_id,local_date" }).select("id").single();
  if (error || !data) redirect(feedback("/app/checkin", "error", "Não foi possível salvar o check-in."));
  revalidatePath("/app/dashboard");
  redirect(feedback(`/app/checkin/result?id=${data.id}`, "toast", "Check-in salvo com sucesso."));
}

const urgeSchema = z.object({ intensity: z.coerce.number().int().min(0).max(10), emotion: z.string().max(80).optional(), context: z.string().max(80).optional(), location: z.string().max(80).optional(), platform: z.string().max(120).optional(), thought: z.string().max(2000).optional(), response: z.string().max(500).optional(), alone: z.boolean() });

export async function createUrge(formData: FormData) {
  const user = await requireUser();
  const parsed = urgeSchema.safeParse({ intensity: formData.get("intensity"), emotion: formData.get("emotion") || undefined, context: formData.get("context") || undefined, location: formData.get("location") || undefined, platform: formData.get("platform") || undefined, thought: formData.get("thought") || undefined, response: formData.get("response") || undefined, alone: formData.get("alone") === "on" });
  if (!parsed.success) redirect(feedback("/app/triggers", "error", "Revise os campos do registro."));
  const supabase = await createClient();
  const { error } = await supabase.from("urges").insert({ user_id: user.id, intensity: parsed.data.intensity, emotion: parsed.data.emotion, context: parsed.data.context, location_context: parsed.data.location, associated_platform: parsed.data.platform, thought: parsed.data.thought, response_taken: parsed.data.response, alone: parsed.data.alone });
  if (error) redirect(feedback("/app/triggers", "error", "Não foi possível salvar o registro."));
  revalidatePath("/app/dashboard");
  redirect(parsed.data.intensity >= 7 ? feedback("/app/sos?from=urge", "toast", "Registro salvo. O SOS foi aberto para apoiar você agora.") : feedback("/app/triggers", "toast", "Registro de impulso salvo."));
}

const relapseSchema = z.object({ occurredAt: z.string().datetime({ local: true }), trigger: z.string().max(1000).optional(), context: z.string().max(120).optional(), learning: z.string().max(2000).optional(), nextStep: z.string().max(1000).optional() });

export async function createRelapse(formData: FormData) {
  const user = await requireUser();
  const parsed = relapseSchema.safeParse({ occurredAt: formData.get("occurredAt"), trigger: formData.get("trigger") || undefined, context: formData.get("context") || undefined, learning: formData.get("learning") || undefined, nextStep: formData.get("nextStep") || undefined });
  if (!parsed.success) redirect(feedback("/app/relapse", "error", "Revise as informações da recaída."));
  const supabase = await createClient();
  const { error } = await supabase.from("relapse_events").insert({ user_id: user.id, occurred_at: new Date(parsed.data.occurredAt).toISOString(), trigger_summary: parsed.data.trigger, context: parsed.data.context, learning: parsed.data.learning, next_step: parsed.data.nextStep });
  if (error) redirect(feedback("/app/relapse", "error", "Não foi possível salvar o registro."));
  revalidatePath("/app/dashboard");
  redirect(feedback("/app/progress", "toast", "Registro salvo. Seu progresso anterior continua preservado."));
}

export async function createHabit(formData: FormData) {
  const user = await requireUser();
  const name = z.string().trim().min(1).max(100).safeParse(formData.get("name"));
  if (!name.success) redirect(feedback("/app/habits", "error", "Informe um nome para o hábito."));
  const supabase = await createClient();
  const { error } = await supabase.from("habits").insert({ user_id: user.id, name: name.data });
  if (error) redirect(feedback("/app/habits", "error", "Não foi possível criar o hábito."));
  revalidatePath("/app/habits");
  redirect(feedback("/app/habits", "toast", "Hábito criado com sucesso."));
}

export async function toggleHabit(formData: FormData) {
  const user = await requireUser();
  const id = z.uuid().safeParse(formData.get("habitId"));
  const date = z.string().date().safeParse(formData.get("date"));
  if (!id.success || !date.success) redirect(feedback("/app/habits", "error", "Não foi possível identificar o hábito."));
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from("habit_logs").select("id").eq("habit_id", id.data).eq("user_id", user.id).eq("local_date", date.data).maybeSingle();
  if (readError) redirect(feedback("/app/habits", "error", "Não foi possível atualizar o hábito."));
  const result = data ? await supabase.from("habit_logs").delete().eq("id", data.id).eq("user_id", user.id) : await supabase.from("habit_logs").insert({ habit_id: id.data, user_id: user.id, local_date: date.data });
  if (result.error) redirect(feedback("/app/habits", "error", "Não foi possível atualizar o hábito."));
  revalidatePath("/app/habits");
  redirect(feedback("/app/habits", "toast", data ? "Conclusão do hábito desmarcada." : "Hábito concluído hoje."));
}

export async function createJournalEntry(formData: FormData) {
  const user = await requireUser();
  const body = z.string().trim().min(1).max(10000).safeParse(formData.get("body"));
  if (!body.success) redirect(feedback("/app/journal", "error", "Escreva uma nota antes de salvar."));
  const supabase = await createClient();
  const { error } = await supabase.from("journal_entries").insert({ user_id: user.id, title: String(formData.get("title") || "").slice(0, 140) || null, body: body.data });
  if (error) redirect(feedback("/app/journal", "error", "Não foi possível salvar a nota."));
  revalidatePath("/app/journal");
  redirect(feedback("/app/journal", "toast", "Nota salva no seu diário privado."));
}

export async function addPlanItem(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ kind: z.enum(["trigger", "activity", "reason", "risk_item"]), value: z.string().trim().min(1).max(500), riskKind: z.enum(["domain", "app", "social", "term", "context"]).optional() }).safeParse({ kind: formData.get("kind"), value: formData.get("value"), riskKind: formData.get("riskKind") || undefined });
  if (!parsed.success) redirect(feedback("/app/plan", "error", "Revise o item do plano."));
  const supabase = await createClient();
  const result = parsed.data.kind === "trigger"
    ? await supabase.from("triggers").insert({ user_id: user.id, kind: "custom", label: parsed.data.value })
    : parsed.data.kind === "activity"
      ? await supabase.from("alternative_activities").insert({ user_id: user.id, label: parsed.data.value })
      : parsed.data.kind === "reason"
        ? await supabase.from("personal_reasons").insert({ user_id: user.id, reason: parsed.data.value })
        : await supabase.from("risk_items").insert({ user_id: user.id, kind: parsed.data.riskKind ?? "context", value: parsed.data.value });
  if (result.error) redirect(feedback("/app/plan", "error", "Não foi possível adicionar o item ao plano."));
  revalidatePath("/app/plan");
  redirect(feedback("/app/plan", "toast", "Item adicionado ao seu plano."));
}

export async function createGoal(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ title: z.string().trim().min(1).max(140), targetDate: z.string().date().optional() }).safeParse({ title: formData.get("title"), targetDate: formData.get("targetDate") || undefined });
  if (!parsed.success) redirect(feedback("/app/goals", "error", "Revise os dados da meta."));
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert({ user_id: user.id, title: parsed.data.title, target_date: parsed.data.targetDate });
  if (error) redirect(feedback("/app/goals", "error", "Não foi possível criar a meta."));
  revalidatePath("/app/goals");
  redirect(feedback("/app/goals", "toast", "Meta criada com sucesso."));
}

export async function toggleGoal(formData: FormData) {
  const user = await requireUser();
  const id = z.uuid().safeParse(formData.get("goalId"));
  if (!id.success) redirect(feedback("/app/goals", "error", "Meta inválida."));
  const done = formData.get("done") === "true";
  const supabase = await createClient();
  const { error } = await supabase.from("goals").update({ completed_at: done ? null : new Date().toISOString() }).eq("id", id.data).eq("user_id", user.id);
  if (error) redirect(feedback("/app/goals", "error", "Não foi possível atualizar a meta."));
  revalidatePath("/app/goals");
  redirect(feedback("/app/goals", "toast", done ? "Meta reaberta." : "Meta concluída. Muito bem!"));
}

export async function updateHabit(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ id: z.uuid(), name: z.string().trim().min(1).max(100) }).safeParse({ id: formData.get("habitId"), name: formData.get("name") });
  if (!parsed.success) redirect(feedback("/app/habits", "error", "Revise o nome do hábito."));
  const supabase = await createClient();
  const { error } = await supabase.from("habits").update({ name: parsed.data.name }).eq("id", parsed.data.id).eq("user_id", user.id);
  if (error) redirect(feedback("/app/habits", "error", "Não foi possível editar o hábito."));
  revalidatePath("/app/habits");
  redirect(feedback("/app/habits", "toast", "Hábito atualizado."));
}

export async function deleteHabit(formData: FormData) {
  const user = await requireUser();
  const id = z.uuid().safeParse(formData.get("habitId"));
  if (!id.success) redirect(feedback("/app/habits", "error", "Hábito inválido."));
  const supabase = await createClient();
  const { error } = await supabase.from("habits").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect(feedback("/app/habits", "error", "Não foi possível excluir o hábito."));
  revalidatePath("/app/habits");
  redirect(feedback("/app/habits", "toast", "Hábito excluído."));
}

export async function updateGoal(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ id: z.uuid(), title: z.string().trim().min(1).max(140), targetDate: z.string().date().optional() }).safeParse({ id: formData.get("goalId"), title: formData.get("title"), targetDate: formData.get("targetDate") || undefined });
  if (!parsed.success) redirect(feedback("/app/goals", "error", "Revise os dados da meta."));
  const supabase = await createClient();
  const { error } = await supabase.from("goals").update({ title: parsed.data.title, target_date: parsed.data.targetDate ?? null }).eq("id", parsed.data.id).eq("user_id", user.id);
  if (error) redirect(feedback("/app/goals", "error", "Não foi possível editar a meta."));
  revalidatePath("/app/goals");
  redirect(feedback("/app/goals", "toast", "Meta atualizada."));
}

export async function deleteGoal(formData: FormData) {
  const user = await requireUser();
  const id = z.uuid().safeParse(formData.get("goalId"));
  if (!id.success) redirect(feedback("/app/goals", "error", "Meta inválida."));
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect(feedback("/app/goals", "error", "Não foi possível excluir a meta."));
  revalidatePath("/app/goals");
  redirect(feedback("/app/goals", "toast", "Meta excluída."));
}
