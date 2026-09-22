import { Check, ClipboardCheck, Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { DailyMissionSummary } from "@/lib/daily-missions";

export function DailyMissionsCard({ missions, hasPowerUps }: { missions: DailyMissionSummary; hasPowerUps: boolean }) {
  const items = [
    { label: "Registrar um momento", detail: "Check-in", href: "/app/checkin", done: missions.checkinCompleted, icon: <ClipboardCheck size={18} /> },
    { label: "Concluir um hábito", detail: "Hábitos", href: "/app/habits", done: missions.habitCompleted, icon: <Dumbbell size={18} /> },
  ];

  return (
    <section className="mt-8 overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-white/75 shadow-[0_16px_45px_rgba(7,25,28,.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-5 sm:px-7">
        <div>
          <p className="eyebrow text-[var(--teal-deep)]">Missões de hoje</p>
          <h2 className="display mt-2 text-2xl">Pequenos passos, presença real.</h2>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${missions.isComplete ? "bg-[#d9eee7] text-[var(--teal-deep)]" : "bg-[var(--paper)] text-[var(--muted)]"}`}>
          {missions.completedCount}/3 concluídas
        </span>
      </div>
      <ul className="divide-y divide-[var(--line)] px-5 sm:px-7">
        {items.map((item) => <li key={item.label} className="flex items-center gap-4 py-4">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${item.done ? "bg-[#d9eee7] text-[var(--teal-deep)]" : "bg-[var(--paper)] text-[var(--muted)]"}`}>{item.done ? <Check size={19} strokeWidth={3} /> : item.icon}</span>
          <div className="min-w-0 flex-1"><strong className={item.done ? "text-[var(--muted)]" : ""}>{item.label}</strong><p className="text-sm text-[var(--muted)]">{item.done ? "Concluída hoje" : `Abrir ${item.detail}`}</p></div>
          {!item.done && <Link href={item.href as never} className="rounded-full px-3 py-2 text-sm font-extrabold text-[var(--teal-deep)] hover:bg-[#d9eee7]">Abrir</Link>}
        </li>)}
        <li id="power-up" className="flex flex-wrap items-center gap-4 py-4">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${missions.protectionCompleted ? "bg-[#d9eee7] text-[var(--teal-deep)]" : "bg-[var(--paper)] text-[var(--muted)]"}`}>{missions.protectionCompleted ? <Check size={19} strokeWidth={3} /> : <ShieldCheck size={18} />}</span>
          <div className="min-w-0 flex-1"><strong className={missions.protectionCompleted ? "text-[var(--muted)]" : ""}>Ativar um power-up</strong><p className="text-sm text-[var(--muted)]">{missions.protectionCompleted ? "Concluído hoje" : "Escolha uma ação para proteger seu ambiente."}</p></div>
          {missions.protectionCompleted ? null : hasPowerUps ? <Link href="/app/dashboard#power-ups" className="rounded-full px-3 py-2 text-sm font-extrabold text-[var(--teal-deep)] hover:bg-[#d9eee7]">Escolher</Link> : <Link href="/app/plan#power-ups" className="rounded-full px-3 py-2 text-sm font-extrabold text-[var(--teal-deep)] hover:bg-[#d9eee7]">Adicionar</Link>}
        </li>
      </ul>
      {missions.isComplete && <div role="status" className="flex items-center gap-3 bg-[#d9eee7] px-5 py-4 text-sm font-bold text-[var(--teal-deep)] sm:px-7"><Check size={18} strokeWidth={3} /> Missões concluídas por hoje. Obrigado por cuidar de você.</div>}
    </section>
  );
}
