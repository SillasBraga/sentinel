import { Check, Crosshair } from "lucide-react";
import { saveDailyFocus, toggleDailyFocusCompletion } from "@/features/daily-focus/actions";

export function DailyFocusCard({ focus }: { focus: { text: string; completed: boolean } | null }) {
  return <section className="daily-focus-card mt-5 rounded-[1.8rem] border border-[var(--line)] bg-white/65 p-6 sm:p-8">
    <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#d9eee7] text-[var(--teal-deep)]"><Crosshair size={21} /></span><div><p className="eyebrow text-[var(--teal-deep)]">Objetivo do dia</p><h2 className="display mt-2 text-3xl">Um foco por vez.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Escolha uma ação pequena e possível para hoje.</p></div></div>
    {focus && <div className="daily-focus-current mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#d9eee7] p-4"><p className="text-lg font-bold">{focus.text}</p><form action={toggleDailyFocusCompletion}><input type="hidden" name="completed" value={focus.completed ? "false" : "true"} /><button className={focus.completed ? "rounded-full border border-current px-4 py-2 text-sm font-bold" : "primary-action inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold"}>{focus.completed ? "Marcar pendente" : <><Check size={17} /> Concluir foco</>}</button></form></div>}
    <form action={saveDailyFocus} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="daily-focus">Foco de hoje</label>
      <input id="daily-focus" name="focus" required maxLength={160} defaultValue={focus?.text ?? ""} placeholder="Ex.: celular fora do quarto" className="min-h-12 rounded-2xl border border-[var(--line)] bg-white px-4 text-[var(--ink)] outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[#71dbc6]/35" />
      <button className="primary-action min-h-12 rounded-full px-6 font-bold">{focus ? "Atualizar foco" : "Definir foco"}</button>
    </form>
    <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Ideias: dormir antes de 23h; conversar com alguém; deixar o celular fora do quarto.</p>
  </section>;
}
