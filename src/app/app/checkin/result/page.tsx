import { ArrowRight, CheckCircle2, Gauge, History, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getDashboardData } from "@/features/dashboard/data";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const moods = ["", "Em risco", "Vulnerável", "Neutro", "Bem", "Muito bem"];
const exposures: Record<string, string> = { none: "Nenhuma", light: "Leve", moderate: "Moderada", strong: "Forte" };
const riskLabels: Record<string, string> = { low: "Baixo", moderate: "Moderado", high: "Alto", critical: "Atenção" };

export default async function CheckinResultPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const user = await requireUser();
  const { id } = await searchParams;
  if (!id) redirect("/app/checkin?error=Check-in não encontrado.");
  const supabase = await createClient();
  const [{ data: checkin }, dashboard] = await Promise.all([
    supabase.from("daily_checkins").select("id,mood,urge_level,exposure,situations,small_win,occurred_at").eq("id", id).eq("user_id", user.id).maybeSingle(),
    getDashboardData()
  ]);
  if (!checkin) redirect("/app/checkin?error=Check-in não encontrado.");

  const vulnerableMood = checkin.mood <= 2;
  const highUrge = checkin.urge_level >= 7;
  const alone = checkin.situations.includes("Sozinho");
  const currentRisk = riskLabels[dashboard.risk.level] ?? dashboard.risk.level;

  return (
    <div className="mx-auto max-w-5xl p-5 py-8 sm:p-8 lg:p-12">
      <PageHeader eyebrow="Momento registrado" title="Seu registro já está nos indicadores." description="Humor, impulso e contexto agora alimentam Início, Progresso e Calendário." />

      <section className="mt-8 grid gap-3 rounded-[1.8rem] bg-white p-5 sm:grid-cols-3 sm:p-7">
        <ResultStat label="Estado emocional" value={moods[checkin.mood]} />
        <ResultStat label="Nível de desejo" value={`${checkin.urge_level} de 10`} />
        <ResultStat label="Risco atual" value={currentRisk} />
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.6rem] bg-white p-6">
          <div className="flex items-center gap-3"><span className="result-icon"><Gauge size={20} /></span><h2 className="text-xl font-extrabold">Impacto imediato no risco</h2></div>
          <ul className="mt-5 grid gap-4 text-sm leading-6 text-[var(--muted)]">
            <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[var(--teal-deep)]" size={18} /><span>O registro passa a ser considerado um <strong className="result-strong">check-in recente</strong>, evitando o acréscimo de 10 pontos por ausência de check-in.</span></li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--teal-deep)]" size={18} /><span>{vulnerableMood ? <>O estado emocional informado adiciona o fator de vulnerabilidade, com <strong className="result-strong">15 pontos</strong> no cálculo atual.</> : <>O estado emocional informado <strong className="result-strong">não adiciona</strong> o fator de vulnerabilidade ao risco atual.</>}</span></li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--teal-deep)]" size={18} /><span>{highUrge ? <>O desejo em {checkin.urge_level}/10 é considerado alto e adiciona <strong className="result-strong">25 pontos</strong> enquanto estiver recente.</> : <>O nível de desejo informado <strong className="result-strong">não adiciona</strong> o fator de impulso intenso.</>}</span></li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--teal-deep)]" size={18} /><span>{alone ? <>A situação “Sozinho” adiciona <strong className="result-strong">10 pontos</strong> enquanto este for o check-in recente.</> : <>Nenhum fator de solidão foi adicionado por este check-in.</>}</span></li>
          </ul>
        </article>

        <article className="rounded-[1.6rem] bg-white p-6">
          <div className="flex items-center gap-3"><span className="result-icon"><History size={20} /></span><h2 className="text-xl font-extrabold">Informações para o histórico</h2></div>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Exposição <strong className="result-strong">{exposures[checkin.exposure]}</strong>{checkin.situations.filter((item: string) => item !== "Sozinho").length ? ` e outros contextos: ${checkin.situations.filter((item: string) => item !== "Sozinho").join(", ")}` : " e nenhum outro contexto marcado"}. A exposição e esses outros contextos ajudam a revelar padrões, mas não alteram diretamente a pontuação atual.</p>
          {checkin.small_win && <p className="mt-4 rounded-2xl bg-[#d9eee7] p-4 text-sm"><strong>Pequena vitória:</strong> {checkin.small_win}</p>}
        </article>
      </div>

      <p className="mt-5 rounded-2xl border border-[var(--line)] p-4 text-sm leading-6 text-[var(--muted)]">O risco também considera horário vulnerável, impulsos registrados, contexto de solidão e padrões do histórico. Por isso, a pontuação final pode não mudar apenas com um check-in.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/app/dashboard" className="primary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold">Ver dashboard atualizado <ArrowRight size={17} /></Link>
        <Link href="/app/checkin" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 font-bold">Editar o momento de hoje</Link>
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[var(--line)] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p><strong className="mt-2 block text-xl">{value}</strong></div>;
}
