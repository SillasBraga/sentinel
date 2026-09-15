import { ArrowRight, CalendarCheck2, CirclePlus, HeartHandshake, LifeBuoy, Target } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { RiskIndicator } from "@/components/risk-indicator";
import { StreakCard } from "@/components/streak-card";
import { getDashboardData } from "@/features/dashboard/data";
import { redirect } from "next/navigation";

const factorCopy: Record<string,string> = { vulnerable_mood: "Seu último check-in indicou vulnerabilidade.", recent_high_urge: "Você registrou um impulso intenso recentemente.", alone: "Seu último registro aconteceu enquanto estava sozinho.", missing_checkin: "Faz algum tempo desde o último check-in.", risk_hour: "Este costuma ser um horário de maior atenção.", risk_weekday: "Este dia aparece com mais frequência no seu histórico." };

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data.profile?.onboarding_completed) redirect("/app/onboarding");
  const hour = new Date().getHours(); const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = data.profile.display_name?.split(" ")[0] ?? "";
  return <div className="mx-auto max-w-6xl p-5 py-8 sm:p-8 lg:p-12">
    <PageHeader eyebrow="Hoje" title={`${greeting}${firstName ? `, ${firstName}` : ""}.`} />
    <div className="relative mt-8 flex justify-end"><RiskIndicator level={data.risk.level} factors={data.risk.factors.map((factor) => factorCopy[factor.type])} /></div>
    <div className="mt-4 grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><StreakCard days={data.streak} alignedDays={data.aligned.alignedDays} hidden={data.profile.hide_sensitive_numbers} /><section className="rounded-[1.8rem] bg-[#d9eee7] p-6 sm:p-8"><p className="eyebrow text-[var(--teal-deep)]">Próxima ação</p><h2 className="display mt-3 text-3xl">Como você está agora?</h2><p className="mt-3 leading-6 text-[var(--muted)]">Um registro breve ajuda você a perceber mudanças antes que fiquem intensas.</p><Link href="/app/checkin" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ink)] px-5 font-bold text-white">Fazer check-in <ArrowRight size={17} /></Link></section></div>
    <div className="mt-5 grid gap-5 md:grid-cols-3">
      <Metric icon={<Target />} label="Maior período" value={data.profile.hide_sensitive_numbers ? "Oculto" : `${data.longest} dias`} />
      <Metric icon={<CalendarCheck2 />} label="Últimos 30 dias" value={data.profile.hide_sensitive_numbers ? "Oculto" : `${data.aligned.rate}% alinhados`} />
      <Metric icon={<HeartHandshake />} label="Hábitos ativos" value={`${data.habits.length}`} />
    </div>
    <section className="mt-8"><div className="flex items-end justify-between"><div><p className="eyebrow text-[var(--teal-deep)]">Atalhos</p><h2 className="display mt-2 text-3xl">O que ajudaria agora?</h2></div></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Quick href="/app/sos" icon={<LifeBuoy />} label="Preciso de ajuda" /><Quick href="/app/triggers" icon={<CirclePlus />} label="Registrar impulso" /><Quick href="/app/plan" icon={<Target />} label="Revisar meu plano" /><Quick href="/app/accountability" icon={<HeartHandshake />} label="Pedir apoio" /></div></section>
  </div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <article className="rounded-[1.5rem] border border-white bg-white/70 p-6"><span className="text-[var(--teal-deep)]">{icon}</span><p className="mt-5 text-sm text-[var(--muted)]">{label}</p><strong className="mt-1 block text-xl">{value}</strong></article>; }
function Quick({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) { return <Link href={href as never} className="flex min-h-32 flex-col justify-between rounded-[1.4rem] bg-white p-5 font-bold shadow-sm transition hover:-translate-y-0.5"><span className="text-[var(--teal-deep)]">{icon}</span><span>{label}</span></Link>; }
