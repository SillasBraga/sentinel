"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  displayName: z.string().trim().min(1).max(80), goals: z.array(z.string()).min(1), frequency: z.string().optional(), risks: z.array(z.string()), riskStart: z.string().optional(), riskEnd: z.string().optional(),
  motivation: z.string().trim().min(1).max(1000), accountability: z.enum(["yes","later","no"]), discreetMode: z.boolean(), reminders: z.boolean(), checkinTime: z.string(), spiritualMode: z.enum(["off","christian","custom"])
});

export async function completeOnboarding(formData: FormData) {
  const user = await requireUser();
  const parsed = schema.safeParse({ displayName: formData.get("displayName"), goals: formData.getAll("goals"), frequency: formData.get("frequency") || undefined, risks: formData.getAll("risks"), riskStart: formData.get("riskStart") || undefined, riskEnd: formData.get("riskEnd") || undefined, motivation: formData.get("motivation"), accountability: formData.get("accountability"), discreetMode: formData.get("discreetMode") === "on", reminders: formData.get("reminders") === "on", checkinTime: formData.get("checkinTime"), spiritualMode: formData.get("spiritualMode") });
  if (!parsed.success) redirect("/app/onboarding?error=Revise%20os%20campos%20antes%20de%20continuar");
  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_onboarding", { p_user_id: user.id, p_payload: parsed.data });
  if (error) redirect("/app/onboarding?error=Não%20foi%20possível%20salvar%20agora");
  redirect("/app/dashboard?welcome=1");
}
