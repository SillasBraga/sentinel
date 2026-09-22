"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const zoneNameSchema = z.string().trim().min(1).max(120);

export async function createAttentionZone(formData: FormData) {
  const name = zoneNameSchema.safeParse(formData.get("name"));
  if (!name.success) redirect("/app/triggers?error=Informe um nome de até 120 caracteres.");
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("attention_zones").insert({ user_id: user.id, name: name.data });
  if (error?.code === "23505") redirect("/app/triggers?error=Você já criou uma zona com esse nome.");
  if (error) redirect("/app/triggers?error=Não foi possível criar esta zona de atenção.");
  revalidatePath("/app/triggers");
  redirect("/app/triggers?toast=Zona de atenção criada.");
}

export async function updateAttentionZone(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("attentionZoneId"));
  const name = zoneNameSchema.safeParse(formData.get("name"));
  if (!id.success || !name.success) redirect("/app/triggers?error=Revise o nome da zona.");
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("attention_zones").update({ name: name.data }).eq("id", id.data).eq("user_id", user.id);
  if (error?.code === "23505") redirect("/app/triggers?error=Você já criou uma zona com esse nome.");
  if (error) redirect("/app/triggers?error=Não foi possível atualizar esta zona.");
  revalidatePath("/app/triggers");
  redirect("/app/triggers?toast=Zona de atenção atualizada.");
}

export async function deleteAttentionZone(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("attentionZoneId"));
  if (!id.success) redirect("/app/triggers?error=Zona de atenção inválida.");
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("attention_zones").delete().eq("id", id.data).eq("user_id", user.id);
  if (error) redirect("/app/triggers?error=Não foi possível excluir esta zona.");
  revalidatePath("/app/triggers");
  redirect("/app/triggers?toast=Zona de atenção excluída. Registros anteriores foram preservados.");
}
