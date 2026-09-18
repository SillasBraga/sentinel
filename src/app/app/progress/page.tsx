import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { calculateAlignedDaysRate, calculateAverageUrge, calculateCurrentStreak, calculateSOSSuccessRate } from "@/lib/analytics/recovery";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type IntensityRecord = { intensity: number; date: string };

export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ relapse?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const params = await searchParams;
  const [profile, recovery, relapses, checkins, urges, sos] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("id", user.id).single(),
    supabase.from("recovery_profiles").select("started_at").eq("user_id", user.id).single(),
    supabase.from("relapse_events").select("occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: false }),
    supabase.from("daily_checkins").select("urge_level,local_date,occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(100),
    supabase.from("urges").select("intensity,occurred_at").eq("user_id", user.id).order("occurred_at", { ascending: false }).limit(100),
    supabase.from("sos_sessions").select("started_at,initial_intensity,final_intensity").eq("user_id", user.id).eq("completed", true).not("final_intensity", "is", null),
  ]);
  const now = new Date();
  const timezone = profile.data?.timezone ?? "America/Sao_Paulo";
  const relapseDates = (relapses.data ?? []).map((item) => item.occurred_at);
  const events = [
    { type: "start" as const, occurredAt: recovery.data?.started_at ?? now.toISOString() },
    ...relapseDates.map((occurredAt) => ({ type: "relapse" as const, occurredAt })),
  ];
  const intensityRecords: IntensityRecord[] = [
    ...(checkins.data ?? []).map((item) => ({ intensity: item.urge_level, date: item.local_date })),
    ...(urges.data ?? []).map((item) => ({ intensity: item.intensity, date: formatInTimeZone(item.occurred_at, timezone) })),
  ];
  const aligned = calculateAlignedDaysRate(relapseDates, now, timezone);
  const streak = calculateCurrentStreak(events, now, timezone);
  const averageIntensity = calculateAverageUrge(intensityRecords.map((item) => item.intensity));
  const sosSessions = (sos.data ?? []).map((item) => ({ initial: item.initial_intensity, final: item.final_intensity! }));
  const sosSuccess = calculateSOSSuccessRate(sosSessions);
  const lastThirtyDays = new Set(Array.from({ length: 30 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - index);
    return formatInTimeZone(date.toISOString(), timezone);
  }));
  const recentRestarts = relapseDates.filter((date) => lastThirtyDays.has(formatInTimeZone(date, timezone))).length;
  const recentMoments = intensityRecords.filter((item) => lastThirtyDays.has(item.date)).length;
  const recentSos = (sos.data ?? []).filter((item) => lastThirtyDays.has(formatInTimeZone(item.started_at, timezone))).length;
  const chartDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - index));
    const key = formatInTimeZone(date.toISOString(), timezone);
    return { key, label: new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: timezone }).format(date), count: intensityRecords.filter((item) => item.date === key).length };
  });
  const chartMax = Math.max(1, ...chartDays.map((item) => item.count));

  return <div className="mx-auto max-w-6xl p-5 py-8 sm:p-8 lg:p-12">
    <PageHeader eyebrow="Progresso" title="Veja o caminho inteiro." description="Momentos, recomeços e sessões SOS alimentam esta visão. A sequência é apenas uma parte do seu progresso." />
    {params.relapse && <p className="mt-6 rounded-2xl bg-[#d9eee7] p-5 font-semibold">Sua sequência recomeçou na data registrada. O histórico anterior continua preservado nos indicadores e no calendário.</p>}

    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat value={`${streak} dias`} label="Sequência atual" />
      <Stat value={`${aligned.rate}%`} label="Dias sem recaída · 30 dias" />
      <Stat value={averageIntensity === null ? "—" : `${averageIntensity}/10`} label="Intensidade média registrada" />
      <Stat value={sosSuccess === null ? "—" : `${sosSuccess}%`} label="Sessões SOS com redução" />
    </div>

    <section className="mt-6 grid gap-3 rounded-[1.6rem] border border-[var(--line)] bg-white/60 p-5 sm:grid-cols-3 sm:p-6">
      <Summary label="Momentos · 30 dias" value={recentMoments} />
      <Summary label="Sessões SOS · 30 dias" value={recentSos} />
      <Summary label="Recomeços · 30 dias" value={recentRestarts} />
    </section>

    <section className="mt-6 rounded-[1.8rem] bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold">Registros de momento · 7 dias</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Cada registro inclui a intensidade do impulso informada naquele momento.</p>
      <div className="mt-8 flex h-48 items-end gap-3">{chartDays.map((item) => <div key={item.key} className="flex h-full flex-1 flex-col justify-end gap-2 text-center"><span className="text-xs font-bold text-[var(--muted)]">{item.count}</span><div className="min-h-1 rounded-t-xl bg-[var(--teal)]" style={{ height: `${Math.max(5, item.count / chartMax * 100)}%` }} /><span className="text-xs text-[var(--muted)]">{item.label}</span></div>)}</div>
      {intensityRecords.length < 5 && <p className="mt-6 rounded-2xl bg-[#f3f7f4] p-4 text-sm text-[var(--muted)]">Registre pelo menos 5 momentos para enxergar tendências mais confiáveis.</p>}
    </section>

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Link href={"/app/records" as never} className="primary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold">Fazer um registro <ArrowRight size={17} /></Link>
      <Link href="/app/calendar" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 font-bold">Ver no calendário</Link>
    </div>
  </div>;
}

function Stat({ value, label }: { value: string; label: string }) { return <article className="rounded-[1.5rem] bg-[var(--ink)] p-6 text-white"><strong className="display text-4xl text-[#71dbc6]">{value}</strong><p className="mt-2 text-sm text-white/50">{label}</p></article>; }
function Summary({ value, label }: { value: number; label: string }) { return <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] p-4"><span className="text-sm font-bold text-[var(--muted)]">{label}</span><strong className="text-2xl">{value}</strong></div>; }
