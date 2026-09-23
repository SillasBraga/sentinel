import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SubmitButton, TextAreaField } from "@/components/form-controls";
import { saveRestartPlan } from "@/features/recovery/actions";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function RestartPlanPage({ searchParams }: { searchParams: Promise<{ id?: string; error?: string }> }) {
  const user = await requireUser();
  const { id, error } = await searchParams;
  const supabase = await createClient();
  const restartPlans = supabase
    .from("relapse_events")
    .select("id,restart_what_happened,restart_barrier,restart_next_24h_action,restart_tomorrow_mission");
  const { data: relapse } = id
    ? await restartPlans.eq("id", id).eq("user_id", user.id).maybeSingle()
    : await restartPlans.eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(1).maybeSingle();
  if (!relapse) redirect("/app/relapse?error=Registro de recaída não encontrado.");

  return <div className="mx-auto max-w-3xl p-5 py-8 sm:p-8 lg:p-12">
    <PageHeader eyebrow="Plano de retomada" title="Recomece com cuidado." description="Nada aqui é punição. Escolha respostas honestas e um próximo passo possível." />
    <section className="mt-7 flex gap-4 rounded-[1.4rem] border border-[var(--line)] bg-white/65 p-5">
      <HeartHandshake className="mt-0.5 shrink-0 text-[var(--teal-deep)]" size={21} />
      <p className="text-sm leading-6 text-[var(--muted)]">Seu histórico continua com você. Este plano é privado e serve apenas para proteger as próximas horas.</p>
    </section>
    {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}
    <form action={saveRestartPlan} className="mt-6 grid gap-6 rounded-[1.8rem] bg-white p-6 sm:p-8">
      <input type="hidden" name="relapseId" value={relapse.id} />
      <TextAreaField label="O que aconteceu? (opcional)" name="whatHappened" placeholder="Descreva só o que for útil para você entender este momento." defaultValue={relapse.restart_what_happened ?? ""} />
      <TextAreaField label="Qual barreira falhou? (opcional)" name="barrier" placeholder="Ex.: deixar o celular fora do quarto, pedir apoio, sair do ambiente." defaultValue={relapse.restart_barrier ?? ""} />
      <TextAreaField label="Qual ação protege as próximas 24 horas? (opcional)" name="next24hAction" placeholder="Ex.: ativar um limite, ficar perto de alguém, abrir o SOS quando precisar." defaultValue={relapse.restart_next_24h_action ?? ""} />
      <TextAreaField label="Uma missão leve para amanhã. (opcional)" name="tomorrowMission" placeholder="Ex.: fazer um check-in pela manhã ou caminhar por 10 minutos." defaultValue={relapse.restart_tomorrow_mission ?? ""} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <a href="/app/dashboard" className="inline-flex min-h-13 items-center justify-center rounded-full border border-[var(--line)] px-6 font-bold">Pular por agora</a>
        <SubmitButton><span className="inline-flex items-center justify-center gap-2"><ShieldCheck size={18} /> Salvar plano de retomada</span></SubmitButton>
      </div>
    </form>
    <a href="/app/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--teal-deep)]">Voltar para início <ArrowRight size={16} /></a>
  </div>;
}
