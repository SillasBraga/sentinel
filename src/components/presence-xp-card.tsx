import { Sparkles } from "lucide-react";
import type { getPresenceProgress } from "@/lib/presence-xp";

type PresenceProgress = ReturnType<typeof getPresenceProgress>;

export function PresenceXpCard({ progress }: { progress: PresenceProgress }) {
  return <section className="mt-5 overflow-hidden rounded-[1.8rem] bg-[var(--ink)] p-6 text-white shadow-[0_18px_45px_rgba(7,25,28,.15)] sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#71dbc6]">Energia de presença</p><h2 className="display mt-2 text-3xl">Nível {progress.level}</h2></div><span className="grid size-11 place-items-center rounded-full bg-[#71dbc6]/15 text-[#71dbc6]"><Sparkles size={21} /></span></div><div className="mt-6"><div className="mb-2 flex justify-between gap-4 text-sm font-bold text-white/75"><span>{progress.energy}/100 de energia</span><span>{progress.totalXp} XP no total</span></div><div className="h-3 overflow-hidden rounded-full bg-white/12" aria-label={`${progress.energy} de 100 de energia para o próximo nível`}><div className="h-full rounded-full bg-[#71dbc6] transition-[width] motion-reduce:transition-none" style={{ width: `${progress.energyPercent}%` }} /></div></div><p className="mt-5 text-sm leading-6 text-white/70">Cada nível precisa de 100 XP. Check-in +15, hábito +10, SOS +20, reflexão +10, power-up +10 e meta +25. XP conquistado permanece, inclusive após uma recaída.</p></section>;
}
