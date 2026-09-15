import { Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/form-controls";
import { RecoveryItemActions } from "@/components/recovery-item-actions";
import { createHabit, toggleHabit } from "@/features/recovery/actions";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatInTimeZone } from "@/lib/analytics/timezone";

export default async function HabitsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await searchParams;
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const date = formatInTimeZone(new Date().toISOString(), profile?.timezone ?? "America/Sao_Paulo");
  const [habits, logs] = await Promise.all([
    supabase.from("habits").select("id,name").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("local_date", date),
  ]);
  const done = new Set((logs.data ?? []).map((log) => log.habit_id));

  return (
    <div className="mx-auto max-w-4xl p-5 py-8 sm:p-8 lg:p-12">
      <PageHeader eyebrow="Hábitos" title="Construa o que ocupa o espaço antigo." description="Acompanhe rotinas que fortalecem sono, presença, movimento e conexão." />
      {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}

      <form action={createHabit} className="mt-8 flex gap-3 rounded-[1.5rem] border border-white/80 bg-white/80 p-4 shadow-[0_16px_45px_rgba(7,25,28,.07)] backdrop-blur-xl">
        <input name="name" required placeholder="Ex.: caminhar por 15 minutos" className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-4" />
        <SubmitButton>Adicionar</SubmitButton>
      </form>

      <div className="mt-5 grid gap-3">
        {(habits.data ?? []).map((habit) => {
          const completed = done.has(habit.id);
          return (
            <article key={habit.id} className="overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/82 shadow-[0_14px_38px_rgba(7,25,28,.055)] backdrop-blur-xl">
              <div className="flex items-center gap-3 p-4 sm:p-5">
                <form action={toggleHabit}>
                  <input type="hidden" name="habitId" value={habit.id} />
                  <input type="hidden" name="date" value={date} />
                  <button aria-label={`${completed ? "Desmarcar" : "Concluir"} ${habit.name}`} className={`grid size-11 shrink-0 place-items-center rounded-full border font-bold transition-all duration-300 hover:scale-105 ${completed ? "border-[var(--teal-deep)] bg-gradient-to-br from-[#d9eee7] to-[#bceade] text-[var(--teal-deep)] shadow-[0_7px_18px_rgba(65,199,174,.2)]" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>
                    {completed ? <Check size={19} /> : <span className="size-2 rounded-full bg-current opacity-35" />}
                  </button>
                </form>
                <div className="min-w-0 flex-1">
                  <strong className={`block break-words transition ${completed ? "text-[var(--muted)] line-through opacity-65" : ""}`}>{habit.name}</strong>
                  <p className="mt-1 text-xs text-[var(--muted)]">{completed ? "Concluído hoje" : "Pendente hoje"}</p>
                </div>
                <RecoveryItemActions kind="habit" id={habit.id} title={habit.name} />
              </div>
            </article>
          );
        })}
        {!habits.data?.length && <p className="rounded-[1.4rem] border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">Nenhum hábito ainda. Comece com algo pequeno o bastante para repetir amanhã.</p>}
      </div>
    </div>
  );
}
