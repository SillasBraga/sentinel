import { ArrowRight, Compass, Crosshair, HeartPulse, LifeBuoy, RotateCcw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { DailyMissionsCard } from "@/components/daily-missions-card";
import { RiskIndicator } from "@/components/risk-indicator";
import { getDashboardData } from "@/features/dashboard/data";
import { redirect } from "next/navigation";

const factorCopy: Record<string, string> = {
  vulnerable_mood: "Último momento indicou vulnerabilidade.",
  recent_high_urge: "Houve um impulso intenso recentemente.",
  alone: "Um registro recente aconteceu em contexto de isolamento.",
  missing_checkin: "Faz algum tempo desde o último check-in.",
  risk_hour: "Este costuma ser um horário de maior atenção.",
  risk_weekday: "Este dia pede atenção extra pelo seu histórico.",
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data.profile?.onboarding_completed) redirect("/app/onboarding");

  const firstName = data.profile.display_name?.split(" ")[0] ?? "";
  const mission = data.dailyFocus?.text ?? "Proteja sua noite";
  const hidden = data.profile.hide_sensitive_numbers;
  const missionProgress = Math.round((data.missions.completedCount / 3) * 100);

  return <div className="mission-page mx-auto max-w-6xl p-5 py-7 sm:p-8 lg:p-12">
    <header className="mission-topbar"><div><p className="hud-kicker">Central de jornada</p><h1>{firstName ? `Olá, ${firstName}.` : "Sua jornada, hoje."}</h1></div><div className="mission-level"><Sparkles size={18} /><span>Nível {data.presenceXp.level}</span><strong>{data.presenceXp.totalXp} XP</strong></div></header>

    <section className="mission-hero">
      <div className="mission-hero-grid">
        <div className="mission-hero-copy"><p className="hud-kicker">Jornada de hoje</p><h2>{mission}</h2><p>Uma ação possível já ajuda a proteger o próximo momento. Sem perfeição, sem punição.</p><div className="mission-progress"><div className="mission-progress-label"><span>Missões concluídas</span><strong>{data.missions.completedCount}/3</strong></div><div className="hud-progress" aria-label={`${data.missions.completedCount} de 3 missões concluídas`}><span style={{ width: `${missionProgress}%` }} /></div></div></div>
        <div className="mission-orbit" aria-hidden><span className="orbit-core"><ShieldCheck size={31} /></span><i /><i /><i /></div>
      </div>
      <div className="mission-actions"><Link href="/app/checkin" className="hud-primary-action"><HeartPulse size={19} />Fazer check-in <ArrowRight size={16} /></Link><Link href="/app/relapse" className="hud-secondary-action"><RotateCcw size={18} />Registrar recomeço</Link><Link href="/app/sos" className="hud-sos-action"><LifeBuoy size={18} />SOS</Link></div>
    </section>

    <section className="mission-snapshot" aria-label="Resumo da jornada">
      <Metric icon={<Compass />} label="Sequência atual" value={hidden ? "Oculto" : `${data.streak} dias`} detail="dias sem recaída registrada" />
      <Metric icon={<Zap />} label="Melhor sequência" value={hidden ? "Oculto" : `${data.longest} dias`} detail="histórico preservado" />
      <Metric icon={<Sparkles />} label="Energia" value={hidden ? "Oculto" : `${data.presenceXp.energy}/${data.presenceXp.energyNeeded}`} detail={`${data.presenceXp.energyToNextLevel} XP até o próximo nível`} />
    </section>

    <div className="mission-grid">
      <DailyMissionsCard missions={data.missions} hasPowerUps={data.powerUps.length > 0} />
      <section className="journey-radar"><div className="journey-radar-head"><div><p className="hud-kicker">Radar de jornada</p><h2>Zonas de atenção</h2><p>Um resumo leve de padrões recentes, não um julgamento.</p></div><Crosshair size={24} /></div><RiskIndicator level={data.risk.level} factors={data.risk.factors.map((factor) => factorCopy[factor.type] ?? "Um fator de atenção foi identificado.")} /><Link href="/app/triggers" className="journey-radar-link">Abrir mapa de atenção <ArrowRight size={15} /></Link></section>
    </div>
    <p className="mission-footnote">Um recomeço só reinicia a sequência de abstinência. Seus registros, XP, hábitos, SOS e conquistas continuam com você.</p>
  </div>;
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className="hud-metric"><span>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>;
}
