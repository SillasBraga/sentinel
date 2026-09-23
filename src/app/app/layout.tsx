import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { createClient } from "@/lib/supabase/server";
import { WebMCPTools } from "@/components/webmcp-tools";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("discreet_mode,theme,cosmetic_style,timezone").eq("id", user.id).maybeSingle();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const { data: dailyFocus } = await supabase.from("daily_focuses").select("focus,completed_at").eq("user_id", user.id).eq("local_date", localDate).maybeSingle();
  return <AppShell discreetMode={profile?.discreet_mode} theme={profile?.theme === "dark" ? "dark" : "light"} cosmeticStyle={profile?.cosmetic_style === "aurora" || profile?.cosmetic_style === "constellation" ? profile.cosmetic_style : "base"} currentMission={dailyFocus?.focus} missionCompleted={Boolean(dailyFocus?.completed_at)}>{children}<WebMCPTools /></AppShell>;
}
