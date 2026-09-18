export function StreakCard({ days, alignedDays, hidden = false }: { days: number; alignedDays: number; hidden?: boolean }) {
  return (
    <section className="rounded-[1.8rem] bg-[var(--ink)] p-6 text-white sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center">
        <div className="relative mx-auto grid aspect-square w-full max-w-[190px] place-items-center rounded-full [background:conic-gradient(#71dbc6_0_80%,#17383a_80%)]">
          <div className="grid size-[83%] place-items-center rounded-full bg-[var(--ink)] text-center">
            <div>
              <strong className="display block text-6xl">{hidden ? "••" : days}</strong>
              <span className="mx-auto mt-1 block max-w-24 text-[10px] font-extrabold uppercase leading-4 tracking-[.12em] text-white/50">dias sem recaída registrada</span>
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow text-[#71dbc6]">Sequência atual</p>
          <h2 className="display mt-3 text-3xl">Desde o último recomeço.</h2>
          <p className="mt-4 leading-7 text-white/60">{hidden ? "Números sensíveis estão ocultos." : `${alignedDays} de 30 dias sem recaída registrada.`}</p>
          <p className="mt-2 text-sm leading-6 text-white/45">Somente registrar uma recaída reinicia esta sequência. Check-ins, impulsos e SOS não alteram o contador.</p>
        </div>
      </div>
    </section>
  );
}
