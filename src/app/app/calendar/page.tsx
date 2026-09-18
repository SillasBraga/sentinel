import { PageHeader } from "@/components/page-header";
import { CalendarFilter, CalendarMetric, RecoveryCalendar, RecoveryCalendarDay } from "@/components/recovery-calendar";
import { formatInTimeZone } from "@/lib/analytics/timezone";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const filterSchema = z.enum(["all", "moment", "habit", "sos", "restart", "goal"]);

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function clampMonth(value: string | undefined, fallback: string) {
  const parsed = monthSchema.safeParse(value);
  if (!parsed.success) return fallback;
  const year = Number(parsed.data.slice(0, 4));
  return year >= 2000 && year <= 2100 ? parsed.data : fallback;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string; filter?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const params = await searchParams;

  const [{ data: profile }, { data: recovery }] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("id", user.id).single(),
    supabase.from("recovery_profiles").select("started_at").eq("user_id", user.id).maybeSingle(),
  ]);

  const timezone = profile?.timezone ?? "America/Sao_Paulo";
  const now = new Date();
  const todayKey = formatInTimeZone(now.toISOString(), timezone);
  const selectedMonth = clampMonth(params.month, todayKey.slice(0, 7));
  const initialFilter: CalendarFilter = filterSchema.safeParse(params.filter).data ?? "all";
  const [year, monthNumber] = selectedMonth.split("-").map(Number);
  const monthStart = new Date(Date.UTC(year, monthNumber - 1, 1));
  const monthEnd = new Date(Date.UTC(year, monthNumber, 0));
  const gridStart = new Date(monthStart);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
  const gridEnd = new Date(gridStart);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + 41);

  const gridStartKey = dateKey(gridStart);
  const gridEndKey = dateKey(gridEnd);
  const paddedTimestampStart = new Date(gridStart);
  paddedTimestampStart.setUTCDate(paddedTimestampStart.getUTCDate() - 1);
  const paddedTimestampEnd = new Date(gridEnd);
  paddedTimestampEnd.setUTCDate(paddedTimestampEnd.getUTCDate() + 2);

  const [
    checkinsResult,
    relapsesResult,
    urgesResult,
    sosResult,
    habitsResult,
    goalsResult,
    checkinsTotal,
    urgesTotal,
    habitsTotal,
    sosTotal,
    relapsesTotal,
  ] = await Promise.all([
    supabase
      .from("daily_checkins")
      .select("local_date,mood,urge_level")
      .eq("user_id", user.id)
      .gte("local_date", gridStartKey)
      .lte("local_date", gridEndKey),
    supabase
      .from("relapse_events")
      .select("occurred_at")
      .eq("user_id", user.id)
      .gte("occurred_at", paddedTimestampStart.toISOString())
      .lt("occurred_at", paddedTimestampEnd.toISOString()),
    supabase
      .from("urges")
      .select("intensity,occurred_at")
      .eq("user_id", user.id)
      .gte("occurred_at", paddedTimestampStart.toISOString())
      .lt("occurred_at", paddedTimestampEnd.toISOString()),
    supabase
      .from("sos_sessions")
      .select("started_at,initial_intensity,final_intensity,completed")
      .eq("user_id", user.id)
      .gte("started_at", paddedTimestampStart.toISOString())
      .lt("started_at", paddedTimestampEnd.toISOString()),
    supabase
      .from("habit_logs")
      .select("local_date")
      .eq("user_id", user.id)
      .gte("local_date", gridStartKey)
      .lte("local_date", gridEndKey),
    supabase
      .from("goals")
      .select("title,target_date,completed_at")
      .eq("user_id", user.id)
      .or(`and(target_date.gte.${gridStartKey},target_date.lte.${gridEndKey}),and(completed_at.gte.${paddedTimestampStart.toISOString()},completed_at.lt.${paddedTimestampEnd.toISOString()})`),
    supabase.from("daily_checkins").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("urges").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("habit_logs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("sos_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true),
    supabase.from("relapse_events").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const days = Array.from({ length: 42 }, (_, index): RecoveryCalendarDay => {
    const date = new Date(gridStart);
    date.setUTCDate(date.getUTCDate() + index);
    const key = dateKey(date);
    return {
      date: key,
      dayNumber: date.getUTCDate(),
      inSelectedMonth: key.startsWith(selectedMonth),
      isToday: key === todayKey,
      checkin: null,
      habits: 0,
      urges: { count: 0, average: 0 },
      sos: { count: 0, averageReduction: null },
      restarts: 0,
      goalsDue: [],
      goalsCompleted: [],
    };
  });

  const byDate = new Map(days.map((day) => [day.date, day]));

  for (const checkin of checkinsResult.data ?? []) {
    const day = byDate.get(checkin.local_date);
    if (day) day.checkin = { mood: checkin.mood, urge: checkin.urge_level };
  }
  for (const habit of habitsResult.data ?? []) {
    const day = byDate.get(habit.local_date);
    if (day) day.habits += 1;
  }

  const urgeValues = new Map<string, number[]>();
  for (const urge of urgesResult.data ?? []) {
    const key = formatInTimeZone(urge.occurred_at, timezone);
    urgeValues.set(key, [...(urgeValues.get(key) ?? []), urge.intensity]);
  }
  for (const [key, values] of urgeValues) {
    const day = byDate.get(key);
    if (day) day.urges = { count: values.length, average: average(values) ?? 0 };
  }

  const sosValues = new Map<string, Array<{ initial: number; final: number | null }>>();
  for (const session of sosResult.data ?? []) {
    const key = formatInTimeZone(session.started_at, timezone);
    sosValues.set(key, [
      ...(sosValues.get(key) ?? []),
      { initial: session.initial_intensity, final: session.completed ? session.final_intensity : null },
    ]);
  }
  for (const [key, sessions] of sosValues) {
    const day = byDate.get(key);
    const reductions = sessions.filter((session) => session.final !== null).map((session) => session.initial - session.final!);
    if (day) day.sos = { count: sessions.length, averageReduction: average(reductions) };
  }

  for (const relapse of relapsesResult.data ?? []) {
    const day = byDate.get(formatInTimeZone(relapse.occurred_at, timezone));
    if (day) day.restarts += 1;
  }
  for (const goal of goalsResult.data ?? []) {
    if (goal.target_date) byDate.get(goal.target_date)?.goalsDue.push(goal.title);
    if (goal.completed_at) byDate.get(formatInTimeZone(goal.completed_at, timezone))?.goalsCompleted.push(goal.title);
  }

  const monthDays = days.filter((day) => day.inSelectedMonth);
  const todayInSelectedMonth = todayKey.startsWith(selectedMonth);
  const elapsedDays = todayInSelectedMonth ? Math.max(1, Number(todayKey.slice(8, 10))) : monthEnd.getUTCDate();
  const checkinDays = monthDays.filter((day) => day.checkin).length;
  const habitCompletions = monthDays.reduce((sum, day) => sum + day.habits, 0);
  const monthIntensities = monthDays.flatMap((day) => [
    ...(day.checkin ? [day.checkin.urge] : []),
    ...(day.urges.count ? Array(day.urges.count).fill(day.urges.average) : []),
  ]);
  const sosSessions = monthDays.reduce((sum, day) => sum + day.sos.count, 0);
  const activeDays = monthDays.filter((day) => day.checkin || day.habits || day.urges.count || day.sos.count || day.restarts || day.goalsDue.length || day.goalsCompleted.length).length;
  const coverage = Math.min(100, Math.round((checkinDays / elapsedDays) * 100));

  const metrics: CalendarMetric[] = [
    { label: "Dias com momento", value: `${coverage}%`, detail: `${checkinDays} de ${elapsedDays} dias do período`, tone: "teal" },
    { label: "Dias com atividade", value: String(activeDays), detail: "com algum registro na jornada", tone: "blue" },
    { label: "Hábitos concluídos", value: String(habitCompletions), detail: "ações positivas registradas", tone: "violet" },
    { label: "Intensidade média", value: average(monthIntensities) === null ? "—" : `${average(monthIntensities)}/10`, detail: `${monthIntensities.length} registros no período`, tone: "amber" },
  ];

  const journeyStart = recovery?.started_at ? new Date(recovery.started_at) : now;
  const journeyDays = Math.max(1, Math.floor((now.getTime() - journeyStart.getTime()) / 86_400_000) + 1);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(monthStart);
  const normalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const startYear = Math.min(journeyStart.getUTCFullYear(), year);

  return (
    <div className="mx-auto max-w-[90rem] p-4 py-7 sm:p-8 lg:p-12">
      <PageHeader
        eyebrow="Calendário de recuperação"
        title="Sua evolução, em perspectiva."
        description="Navegue pela sua história, filtre os registros e reconheça padrões sem reduzir sua jornada a uma sequência perfeita."
      />
      <RecoveryCalendar
        key={selectedMonth}
        selectedMonth={selectedMonth}
        todayMonth={todayKey.slice(0, 7)}
        initialFilter={initialFilter}
        monthLabel={normalizedMonthLabel}
        days={days}
        metrics={metrics}
        cumulative={{
          moments: (checkinsTotal.count ?? 0) + (urgesTotal.count ?? 0),
          habits: habitsTotal.count ?? 0,
          sos: sosTotal.count ?? 0,
          restarts: relapsesTotal.count ?? 0,
          journeyDays,
        }}
        minYear={Math.min(startYear, now.getUTCFullYear() - 5)}
        maxYear={Math.max(year, now.getUTCFullYear() + 1)}
      />
      {sosSessions > 0 && <p className="sr-only">{sosSessions} sessões SOS registradas neste mês.</p>}
    </div>
  );
}
