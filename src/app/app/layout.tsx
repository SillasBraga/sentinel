import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WebMCPTools } from "@/components/webmcp-tools";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("discreet_mode,theme").eq("id", user.id).maybeSingle();
  return <AppShell discreetMode={data?.discreet_mode} theme={data?.theme === "dark" ? "dark" : "light"}>{children}<WebMCPTools /></AppShell>;
}
