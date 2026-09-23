"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { z } from "zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { cosmeticStyles, getCosmeticCollection } from "@/lib/cosmetics";

function feedback(path: string, type: "toast" | "error", message: string): Route {
  return `${path}${path.includes("?") ? "&" : "?"}${type}=${encodeURIComponent(message)}` as Route;
}

export async function updatePrivacy(formData: FormData){const user=await requireUser();const supabase=await createClient();const [profile,privacy]=await Promise.all([supabase.from("profiles").update({discreet_mode:formData.get("discreetMode")==="on",hide_sensitive_numbers:formData.get("hideNumbers")==="on",spiritual_mode:z.enum(["off","christian","custom"]).parse(formData.get("spiritualMode"))}).eq("id",user.id),supabase.from("privacy_preferences").update({personal_analytics:formData.get("analytics")==="on",browser_notifications:formData.get("notifications")==="on",quick_exit:formData.get("quickExit")==="on"}).eq("user_id",user.id)]);if(profile.error||privacy.error)redirect(feedback("/app/settings","error","Não foi possível salvar as preferências."));redirect(feedback("/app/settings","toast","Preferências salvas com sucesso."))}

export async function updateTheme(value: "light" | "dark") {
  const theme = z.enum(["light", "dark"]).parse(value);
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ theme }).eq("id", user.id);
  if (error) throw new Error("Não foi possível salvar o tema.");
  revalidatePath("/app", "layout");
}

export async function updateCosmeticStyle(formData: FormData) {
  const cosmeticStyle = z.enum(cosmeticStyles).safeParse(formData.get("cosmeticStyle"));
  if (!cosmeticStyle.success) redirect(feedback("/app/settings", "error", "Escolha um ambiente visual válido."));

  const user = await requireUser();
  const supabase = await createClient();
  const { data: events, error: eventsError } = await supabase.from("presence_xp_events").select("points").eq("user_id", user.id);
  if (eventsError) redirect(feedback("/app/settings", "error", "Não foi possível verificar seus ambientes visuais."));

  const totalXp = (events ?? []).reduce((total, event) => total + event.points, 0);
  const selected = getCosmeticCollection(totalXp).find(({ id }) => id === cosmeticStyle.data);
  if (!selected?.unlocked) redirect(feedback("/app/settings", "error", "Este ambiente ainda será liberado pela sua presença."));

  const { error } = await supabase.from("profiles").update({ cosmetic_style: cosmeticStyle.data }).eq("id", user.id);
  if (error) redirect(feedback("/app/settings", "error", "Não foi possível salvar o ambiente visual."));

  revalidatePath("/app", "layout");
  redirect(feedback("/app/settings", "toast", "Ambiente visual aplicado."));
}
export async function deleteAccount(formData:FormData){const user=await requireUser();if(formData.get("confirmation")!=="EXCLUIR")redirect("/app/settings?error=Digite%20EXCLUIR%20para%20confirmar");const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!serviceKey)redirect("/app/settings?error=Exclusão%20indisponível%20neste%20ambiente");const env=getPublicEnv();const admin=createAdminClient(env.NEXT_PUBLIC_SUPABASE_URL,serviceKey,{auth:{autoRefreshToken:false,persistSession:false}});const {error}=await admin.auth.admin.deleteUser(user.id);if(error)redirect("/app/settings?error=Não%20foi%20possível%20excluir%20a%20conta");redirect("/")}
