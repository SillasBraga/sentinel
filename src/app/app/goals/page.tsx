import { Check, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RecoveryItemActions } from "@/components/recovery-item-actions";
import { createGoal, toggleGoal } from "@/features/recovery/actions";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function GoalsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await searchParams;
  const { data } = await supabase.from("goals").select("id,title,target_date,completed_at").eq("user_id", user.id).order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl p-5 py-8 sm:p-8 lg:p-12">
      <PageHeader eyebrow="Metas" title="Direção sem pressão." description="Use metas como um horizonte, não como uma medida do seu valor." />
      {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}

      <form action={createGoal} className="mt-8 grid gap-3 rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_16px_45px_rgba(7,25,28,.07)] backdrop-blur-xl sm:grid-cols-[1fr_170px_auto]">
        <input required name="title" placeholder="Minha próxima meta" className="min-h-12 rounded-xl border border-[var(--line)] bg-white px-4" />
        <input name="targetDate" type="date" aria-label="Data da meta" className="min-h-12 rounded-xl border border-[var(--line)] bg-white px-3" />
        <button className="min-h-12 rounded-full bg-[var(--ink)] px-5 font-bold text-white">Adicionar</button>
      </form>

      <div className="mt-5 grid gap-3">
        {data?.map((goal) => {
          const completed = Boolean(goal.completed_at);
          return (
            <article key={goal.id} className="overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/82 shadow-[0_14px_38px_rgba(7,25,28,.055)] backdrop-blur-xl">
              <div className="flex items-center gap-3 p-4 sm:p-5">
                <form action={toggleGoal}>
                  <input type="hidden" name="goalId" value={goal.id} />
                  <input type="hidden" name="done" value={String(completed)} />
                  <button aria-label={`${completed ? "Reabrir" : "Concluir"} ${goal.title}`} className={`grid size-11 place-items-center rounded-full border transition-all duration-300 hover:scale-105 ${completed ? "border-[var(--teal-deep)] bg-[#d9eee7] text-[var(--teal-deep)]" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>
                    {completed ? <RotateCcw size={17} /> : <Check size={18} />}
                  </button>
                </form>
                <div className="min-w-0 flex-1">
                  <strong className={`block break-words ${completed ? "text-[var(--muted)] line-through opacity-65" : ""}`}>{goal.title}</strong>
                  {goal.target_date && <p className="mt-1 text-sm text-[var(--muted)]">Até {new Intl.DateTimeFormat("pt-BR").format(new Date(`${goal.target_date}T12:00:00`))}</p>}
                </div>
                <RecoveryItemActions kind="goal" id={goal.id} title={goal.title} targetDate={goal.target_date} />
              </div>
            </article>
          );
        })}
        {!data?.length && <p className="rounded-[1.4rem] border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">Nenhuma meta ainda. Escolha algo concreto e gentil.</p>}
      </div>
    </div>
  );
}
