"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

export type CalendarFilter = "all" | "moment" | "habit" | "sos" | "restart" | "goal";

export type RecoveryCalendarDay = {
  date: string;
  dayNumber: number;
  inSelectedMonth: boolean;
  isToday: boolean;
  checkin: { mood: number; urge: number } | null;
  habits: number;
  urges: { count: number; average: number };
  sos: { count: number; averageReduction: number | null };
  restarts: number;
  goalsDue: string[];
  goalsCompleted: string[];
};

export type CalendarMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "blue" | "amber" | "violet";
};

type Props = {
  selectedMonth: string;
  todayMonth: string;
  initialFilter: CalendarFilter;
  monthLabel: string;
  days: RecoveryCalendarDay[];
  metrics: CalendarMetric[];
  cumulative: {
    moments: number;
    habits: number;
    sos: number;
    restarts: number;
    journeyDays: number;
  };
  minYear: number;
  maxYear: number;
};

const weekdays = [
  ["Dom", "D"],
  ["Seg", "S"],
  ["Ter", "T"],
  ["Qua", "Q"],
  ["Qui", "Q"],
  ["Sex", "S"],
  ["Sáb", "S"],
];

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const filterOptions: Array<{
  id: CalendarFilter;
  label: string;
  icon: typeof CalendarDays;
}> = [
  { id: "all", label: "Tudo", icon: CalendarDays },
  { id: "moment", label: "Momentos", icon: CalendarCheck2 },
  { id: "habit", label: "Hábitos", icon: Check },
  { id: "sos", label: "SOS", icon: ShieldCheck },
  { id: "restart", label: "Recomeços", icon: RotateCcw },
  { id: "goal", label: "Metas", icon: Target },
];

function eventCount(day: RecoveryCalendarDay, filter: CalendarFilter) {
  const values: Record<Exclude<CalendarFilter, "all">, number> = {
    moment: (day.checkin ? 1 : 0) + day.urges.count,
    habit: day.habits,
    sos: day.sos.count,
    restart: day.restarts,
    goal: day.goalsDue.length + day.goalsCompleted.length,
  };
  return filter === "all" ? Object.values(values).reduce((sum, value) => sum + value, 0) : values[filter];
}

function shiftMonth(month: string, amount: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + amount, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatDayLabel(date: string) {
  const label = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function MetricIcon({ tone }: { tone: CalendarMetric["tone"] }) {
  if (tone === "blue") return <Activity size={19} />;
  if (tone === "amber") return <RotateCcw size={19} />;
  if (tone === "violet") return <ShieldCheck size={19} />;
  return <CalendarCheck2 size={19} />;
}

export function RecoveryCalendar({
  selectedMonth,
  todayMonth,
  initialFilter,
  monthLabel,
  days,
  metrics,
  cumulative,
  minYear,
  maxYear,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<CalendarFilter>(initialFilter);
  const firstInterestingDay = days.find((day) => day.inSelectedMonth && eventCount(day, "all") > 0);
  const initialDay = days.find((day) => day.isToday) ?? firstInterestingDay ?? days.find((day) => day.inSelectedMonth) ?? days[0];
  const [selectedDate, setSelectedDate] = useState(initialDay.date);
  const [jumpMonth, setJumpMonth] = useState(Number(selectedMonth.slice(5, 7)));
  const [jumpYear, setJumpYear] = useState(Number(selectedMonth.slice(0, 4)));

  const selectedDay = useMemo(
    () => days.find((day) => day.date === selectedDate) ?? initialDay,
    [days, initialDay, selectedDate],
  );

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index);

  function navigate(month: string) {
    const filterQuery = filter === "all" ? "" : `&filter=${filter}`;
    router.push(`/app/calendar?month=${month}${filterQuery}`, { scroll: false });
  }

  function selectDay(day: RecoveryCalendarDay) {
    if (!day.inSelectedMonth) {
      navigate(day.date.slice(0, 7));
      return;
    }
    setSelectedDate(day.date);
  }

  return (
    <div className="mt-8 space-y-5">
      <section className="calendar-hero" aria-label="Resumo do período">
        <div className="calendar-hero-copy">
          <div className="calendar-hero-icon" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="eyebrow">Visão do período</p>
            <h2>{monthLabel}</h2>
            <p>Compare registros, reconheça padrões e acompanhe seu ritmo sem transformar a jornada em cobrança.</p>
          </div>
        </div>
        <button type="button" className="calendar-today-button" onClick={() => navigate(todayMonth)}>
          <CircleDot size={17} /> Hoje
        </button>
      </section>

      <div className="calendar-metrics" aria-label="Indicadores do mês">
        {metrics.map((metric) => (
          <article key={metric.label} className={`calendar-metric calendar-tone-${metric.tone}`}>
            <div className="calendar-metric-icon" aria-hidden="true">
              <MetricIcon tone={metric.tone} />
            </div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>

      <section className="calendar-panel calendar-toolbar" aria-label="Navegação e filtros do calendário">
        <div className="calendar-month-navigation">
          <button type="button" className="calendar-icon-button" onClick={() => navigate(shiftMonth(selectedMonth, -1))} aria-label="Mês anterior">
            <ChevronLeft size={21} />
          </button>
          <div className="calendar-month-title" aria-live="polite">
            <span>Período selecionado</span>
            <strong>{monthLabel}</strong>
          </div>
          <button type="button" className="calendar-icon-button" onClick={() => navigate(shiftMonth(selectedMonth, 1))} aria-label="Próximo mês">
            <ChevronRight size={21} />
          </button>
        </div>

        <div className="calendar-jump-controls">
          <label>
            <span className="sr-only">Mês</span>
            <select value={jumpMonth} onChange={(event) => setJumpMonth(Number(event.target.value))} aria-label="Escolher mês">
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Ano</span>
            <select value={jumpYear} onChange={(event) => setJumpYear(Number(event.target.value))} aria-label="Escolher ano">
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="calendar-go-button" onClick={() => navigate(`${jumpYear}-${String(jumpMonth).padStart(2, "0")}`)}>
            Ver período
          </button>
        </div>

        <div className="calendar-filters" aria-label="Filtrar registros">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                className="calendar-filter"
                data-active={filter === option.id}
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                <Icon size={16} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
        <label className="calendar-mobile-filter-select">
          <span>Mostrar no calendário</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value as CalendarFilter)}>
            {filterOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="calendar-content-grid">
        <section className="calendar-panel calendar-grid-panel" aria-label={`Calendário de ${monthLabel}`}>
          <div className="calendar-weekdays" aria-hidden="true">
            {weekdays.map(([full, short], index) => (
              <div key={`${full}-${index}`}>
                <span className="hidden sm:inline">{full}</span>
                <span className="sm:hidden">{short}</span>
              </div>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day) => {
              const count = eventCount(day, filter);
              const allCount = eventCount(day, "all");
              const isSelected = selectedDay.date === day.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  className="calendar-day"
                  data-current-month={day.inSelectedMonth}
                  data-today={day.isToday}
                  data-selected={isSelected}
                  data-muted={filter !== "all" && count === 0}
                  onClick={() => selectDay(day)}
                  aria-pressed={isSelected}
                  aria-label={`${formatDayLabel(day.date)}. ${allCount === 0 ? "Sem registros" : `${allCount} registros`}`}
                >
                  <span className="calendar-day-number">{day.dayNumber}</span>
                  {day.isToday && <span className="calendar-today-label">Hoje</span>}
                  <span className="calendar-day-markers" aria-hidden="true">
                    {(filter === "all" || filter === "moment") && day.checkin && <i className="marker-checkin" />}
                    {(filter === "all" || filter === "habit") && day.habits > 0 && <i className="marker-habit" />}
                    {(filter === "all" || filter === "moment") && day.urges.count > 0 && <i className="marker-checkin" />}
                    {(filter === "all" || filter === "sos") && day.sos.count > 0 && <i className="marker-sos" />}
                    {(filter === "all" || filter === "restart") && day.restarts > 0 && <i className="marker-restart" />}
                    {(filter === "all" || filter === "goal") && day.goalsDue.length + day.goalsCompleted.length > 0 && <i className="marker-goal" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="calendar-legend" aria-label="Legenda">
            <span><i className="marker-checkin" />Momento / impulso</span>
            <span><i className="marker-habit" />Hábito</span>
            <span><i className="marker-sos" />SOS</span>
            <span><i className="marker-restart" />Recomeço</span>
            <span><i className="marker-goal" />Meta</span>
          </div>
        </section>

        <aside className="calendar-panel calendar-day-detail" aria-live="polite">
          <div className="calendar-detail-heading">
            <div>
              <p className="eyebrow">Detalhes do dia</p>
              <h3>{formatDayLabel(selectedDay.date)}</h3>
            </div>
            <span className="calendar-detail-count">{eventCount(selectedDay, "all")}</span>
          </div>
          <div className="calendar-detail-list">
            {(filter === "all" || filter === "moment") && selectedDay.checkin && (
              <div className="calendar-detail-item detail-checkin">
                <CalendarCheck2 size={18} />
                <div><strong>Momento registrado</strong><span>Humor {selectedDay.checkin.mood}/5 · impulso {selectedDay.checkin.urge}/10</span></div>
              </div>
            )}
            {(filter === "all" || filter === "habit") && selectedDay.habits > 0 && (
              <div className="calendar-detail-item detail-habit">
                <Check size={18} />
                <div><strong>{selectedDay.habits} {selectedDay.habits === 1 ? "hábito concluído" : "hábitos concluídos"}</strong><span>Pequenas ações também contam.</span></div>
              </div>
            )}
            {(filter === "all" || filter === "moment") && selectedDay.urges.count > 0 && (
              <div className="calendar-detail-item detail-urge">
                <Activity size={18} />
                <div><strong>{selectedDay.urges.count} {selectedDay.urges.count === 1 ? "registro de impulso anterior" : "registros de impulso anteriores"}</strong><span>Intensidade média {selectedDay.urges.average}/10</span></div>
              </div>
            )}
            {(filter === "all" || filter === "sos") && selectedDay.sos.count > 0 && (
              <div className="calendar-detail-item detail-sos">
                <ShieldCheck size={18} />
                <div><strong>{selectedDay.sos.count} {selectedDay.sos.count === 1 ? "sessão SOS" : "sessões SOS"}</strong><span>{selectedDay.sos.averageReduction === null ? "Sessão registrada" : `Redução média de ${selectedDay.sos.averageReduction} pontos`}</span></div>
              </div>
            )}
            {(filter === "all" || filter === "restart") && selectedDay.restarts > 0 && (
              <div className="calendar-detail-item detail-restart">
                <RotateCcw size={18} />
                <div><strong>Recomeço registrado</strong><span>O histórico permanece inteiro; este dia não apaga os anteriores.</span></div>
              </div>
            )}
            {(filter === "all" || filter === "goal") && selectedDay.goalsCompleted.map((title, index) => (
              <div key={`completed-${title}-${index}`} className="calendar-detail-item detail-goal">
                <Target size={18} />
                <div><strong>Meta concluída</strong><span>{title}</span></div>
              </div>
            ))}
            {(filter === "all" || filter === "goal") && selectedDay.goalsDue.map((title, index) => (
              <div key={`due-${title}-${index}`} className="calendar-detail-item detail-goal">
                <Target size={18} />
                <div><strong>Data-alvo da meta</strong><span>{title}</span></div>
              </div>
            ))}
            {eventCount(selectedDay, filter) === 0 && (
              <div className="calendar-empty-day">
                <CalendarDays size={25} />
                <strong>Nenhum registro neste filtro</strong>
                <span>Um dia vazio não é um dia perdido. Use o calendário para observar, não para se cobrar.</span>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="calendar-panel calendar-cumulative" aria-label="Visão acumulada">
        <div className="calendar-cumulative-heading">
          <div>
            <p className="eyebrow">Desde o início</p>
            <h2>Uma visão acumulada da sua jornada</h2>
            <p>Totais ajudam a enxergar constância além de um único mês.</p>
          </div>
          <div className="calendar-journey-days">
            <span className="calendar-journey-icon" aria-hidden="true"><HeartPulse size={19} /></span>
            <div className="calendar-journey-copy">
              <strong>{cumulative.journeyDays}</strong>
              <span>dias de jornada</span>
            </div>
          </div>
        </div>
        <div className="calendar-cumulative-grid">
          <div><span>Momentos registrados</span><strong>{cumulative.moments}</strong></div>
          <div><span>Hábitos concluídos</span><strong>{cumulative.habits}</strong></div>
          <div><span>Sessões SOS</span><strong>{cumulative.sos}</strong></div>
          <div><span>Recomeços registrados</span><strong>{cumulative.restarts}</strong></div>
        </div>
      </section>
    </div>
  );
}
