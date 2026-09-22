import { PageHeader } from "@/components/page-header";
import { PowerUpsCard } from "@/components/power-ups-card";
import { addPlanItem } from "@/features/recovery/actions";
import { requireUser } from "@/lib/auth";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { createClient } from "@/lib/supabase/server";

export default async function PlanPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const localDate = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const [triggers, activities, reasons, riskItems, powerUpLogs] = await Promise.all([
    supabase.from("triggers").select("id,label").eq("user_id", user.id),
    supabase.from("alternative_activities").select("id,label").eq("user_id", user.id).eq("active", true),
    supabase.from("personal_reasons").select("id,reason").eq("user_id", user.id).eq("active", true),
    supabase.from("risk_items").select("id,value").eq("user_id", user.id),
    supabase.from("power_up_logs").select("activity_id").eq("user_id", user.id).eq("local_date", localDate),
  ]);
  const powerUps = activities.data ?? [];
  return <div className="mx-auto max-w-5xl p-5 py-8 sm:p-8 lg:p-12"><PageHeader eyebrow="Meu plano" title="Decida antes do momento difícil." description="Seu plano reúne desafios, equipamento, motivos e ambiente digital em um só lugar." /><div className="mt-8 grid gap-4 md:grid-cols-2"><PlanCard title="Meus gatilhos" items={(triggers.data ?? []).map((value) => value.label)} /><PlanCard title="Meu equipamento" items={powerUps.map((value) => value.label)} /><PlanCard title="Minhas motivações" items={(reasons.data ?? []).map((value) => value.reason)} /><PlanCard title="Ambiente digital de risco" items={(riskItems.data ?? []).map((value) => value.value)} /></div><PowerUpsCard powerUps={powerUps} completedPowerUpIds={(powerUpLogs.data ?? []).map((log) => log.activity_id)} returnTo="plan" /><section id="cadastrar-power-up" className="mt-6 rounded-[1.5rem] border border-[var(--line)] bg-white p-5"><p className="eyebrow text-[var(--teal-deep)]">Novo equipamento</p><h2 className="display mt-2 text-2xl">Cadastrar power-up</h2><p className="mt-2 text-sm text-[var(--muted)]">Uma ação pequena e possível: caminhar, respirar, tomar banho ou falar com alguém.</p><form action={addPlanItem} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"><input type="hidden" name="kind" value="activity" /><input required name="value" placeholder="Ex.: caminhar por 10 minutos" className="min-h-12 rounded-xl border border-[var(--line)] px-4" /><button className="primary-action min-h-12 rounded-full px-5 font-bold">Cadastrar power-up</button></form></section><form action={addPlanItem} className="mt-6 grid gap-4 rounded-[1.5rem] bg-white p-5 sm:grid-cols-[180px_1fr_auto]"><select name="kind" className="min-h-12 rounded-xl border border-[var(--line)] px-3"><option value="trigger">Gatilho</option><option value="reason">Motivação</option><option value="risk_item">Item digital de risco</option></select><input required name="value" placeholder="Adicionar outro item ao meu plano" className="min-h-12 rounded-xl border border-[var(--line)] px-4" /><button className="primary-action min-h-12 rounded-full px-5 font-bold">Adicionar</button></form>{triggers.data?.length && powerUps.length ? <section className="mt-6 rounded-[1.8rem] bg-[var(--ink)] p-6 text-white sm:p-8"><p className="eyebrow text-[#71dbc6]">Resumo de emergência</p><p className="mt-4 text-lg leading-8 text-white/70">Se eu perceber <strong className="text-white">{triggers.data[0].label.toLowerCase()}</strong>, vou <strong className="text-white">{powerUps[0].label.toLowerCase()}</strong>, ativar o SOS e me aproximar de outras pessoas.</p></section> : null}</div>;
}

function PlanCard({ title, items }: { title: string; items: string[] }) { return <section className="rounded-[1.5rem] bg-white p-6"><h2 className="font-bold">{title}</h2>{items.length ? <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">{items.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Nenhum item identificado ainda.</p>}</section>; }
