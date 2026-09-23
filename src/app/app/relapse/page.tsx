import { Info, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/form-controls";
import { createRelapse } from "@/features/recovery/actions";

export default async function RelapsePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const localNow = now.toISOString().slice(0, 16);

  return <div className="mx-auto max-w-3xl p-5 py-8 sm:p-8 lg:p-12">
    <PageHeader
      eyebrow="Recaída e recomeço"
      title="Registrar uma recaída."
      description="Use este registro somente quando algo que você considera uma recaída aconteceu. Impulso e sessão SOS não contam como recaída."
    />
    <section className="relapse-warning mt-7 flex gap-4 rounded-[1.4rem] border p-5">
      <Info className="mt-0.5 shrink-0" size={21} />
      <div><strong className="block">Este registro reinicia sua sequência.</strong><p className="mt-1 text-sm leading-6">O contador passará a considerar a data informada como o início do novo ciclo. Seu histórico, hábitos, check-ins e aprendizados anteriores continuam preservados.</p></div>
    </section>
    {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}
    <form action={createRelapse} className="mt-6 grid gap-6 rounded-[1.8rem] bg-white p-6 sm:p-8">
      <label className="grid gap-2 text-sm font-bold">Quando aconteceu?<input required type="datetime-local" name="occurredAt" defaultValue={localNow} max={localNow} className="min-h-13 rounded-2xl border border-[var(--line)] px-4 font-normal" /></label>
      <label className="relapse-confirmation flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6"><input required type="checkbox" name="confirmRestart" className="mt-0.5" />Entendo que este registro reiniciará minha sequência na data informada.</label>
      <SubmitButton><span className="inline-flex items-center justify-center gap-2"><RotateCcw size={18} /> Confirmar e montar plano de retomada</span></SubmitButton>
    </form>
  </div>;
}
