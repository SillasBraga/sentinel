import { Award } from "lucide-react";
import { PRIVATE_MILESTONES, type PrivateMilestoneId } from "@/lib/private-milestones";

type EarnedMilestone = { achievement_id: PrivateMilestoneId; earned_at: string };

export function PrivateMilestonesCard({ milestones }: { milestones: EarnedMilestone[] }) {
  return <section className="mt-6 rounded-[1.8rem] border border-[var(--line)] bg-white/65 p-6 sm:p-8">
    <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#d9eee7] text-[var(--teal-deep)]"><Award size={21} /></span><div><p className="eyebrow text-[var(--teal-deep)]">Marcos privados</p><h2 className="display mt-2 text-3xl">Seu cuidado deixa marcas.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Estes marcos celebram presença, autocuidado e recomeços. Só você vê esta lista.</p></div></div>
    {milestones.length ? <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Marcos conquistados">{milestones.map(({ achievement_id, earned_at }) => {
      const milestone = PRIVATE_MILESTONES[achievement_id];
      return <li key={achievement_id} className="rounded-2xl border border-[var(--line)] bg-white p-4"><strong>{milestone.title}</strong><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{milestone.description}</p><p className="mt-3 text-xs font-bold text-[var(--teal-deep)]">Conquistado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(earned_at))}</p></li>;
    })}</ul> : <p className="mt-6 rounded-2xl bg-[#f3f7f4] p-4 text-sm leading-6 text-[var(--muted)]">Quando um marco acontecer, ele aparecerá aqui de forma privada.</p>}
  </section>;
}
