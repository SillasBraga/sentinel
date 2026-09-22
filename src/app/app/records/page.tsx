import { ArrowRight, Crosshair, HeartPulse, LifeBuoy, RotateCcw } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function RecordsPage() {
  return (
    <div className="mx-auto max-w-5xl p-5 py-8 sm:p-8 lg:p-12">
      <PageHeader
        eyebrow="Registros"
        title="O que aconteceu agora?"
        description="Dois registros cobrem sua jornada. Escolha um momento para acompanhar emoções e impulsos, ou um recomeço quando houve uma recaída."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link href="/app/checkin" className="group flex min-h-72 flex-col rounded-[1.8rem] border border-[var(--line)] bg-white/75 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#d9f5ee] text-[var(--teal-deep)]"><HeartPulse size={23} /></span>
          <p className="eyebrow mt-7 text-[var(--teal-deep)]">Momento e impulso</p>
          <h2 className="display mt-2 text-3xl">Registrar como estou</h2>
          <p className="mt-3 flex-1 leading-7 text-[var(--muted)]">Reúne humor, intensidade do impulso, exposição, contexto e uma pequena vitória em um único registro.</p>
          <span className="mt-6 inline-flex items-center gap-2 font-extrabold text-[var(--teal-deep)]">Abrir registro <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
        </Link>

        <Link href="/app/relapse" className="record-choice-restart group flex min-h-72 flex-col rounded-[1.8rem] border p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <span className="record-choice-icon grid size-12 place-items-center rounded-2xl"><RotateCcw size={23} /></span>
          <p className="eyebrow mt-7">Recaída e recomeço</p>
          <h2 className="display mt-2 text-3xl">Iniciar um recomeço</h2>
          <p className="mt-3 flex-1 leading-7">Use quando algo que você considera recaída aconteceu. Este é o único registro que reinicia a sequência.</p>
          <span className="mt-6 inline-flex items-center gap-2 font-extrabold">Registrar com privacidade <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
        </Link>
      </div>

      <Link href="/app/triggers" className="group mt-5 flex flex-col rounded-[1.6rem] border border-[var(--line)] bg-white/55 p-5 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#d9eee7] text-[var(--teal-deep)]"><Crosshair size={21} /></span><div><p className="eyebrow text-[var(--teal-deep)]">Zonas de atenção</p><strong className="mt-1 block text-lg">Nomeie desafios que voltam</strong><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Acompanhe frequência, contexto e estratégias de proteção.</p></div></div><span className="mt-4 inline-flex items-center gap-2 font-extrabold text-[var(--teal-deep)] sm:mt-0">Abrir zonas <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
      </Link>

      <section className="mt-5 flex flex-col gap-4 rounded-[1.6rem] border border-[var(--line)] bg-white/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e5f2ff] text-[#246b91]"><LifeBuoy size={21} /></span><div><strong className="block text-lg">Precisa atravessar um impulso agora?</strong><p className="mt-1 text-sm leading-6 text-[var(--muted)]">O SOS é apoio imediato. A sessão entra no histórico, mas não registra uma recaída.</p></div></div>
        <Link href="/app/sos" className="primary-action inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-5 font-extrabold">Abrir SOS</Link>
      </section>
    </div>
  );
}
