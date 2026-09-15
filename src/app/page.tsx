import { ArrowRight, Check, LockKeyhole, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  ["01", "Entenda seus padrões", "Registre check-ins rápidos e descubra contextos que merecem mais atenção."],
  ["02", "Prepare seus próximos passos", "Transforme gatilhos em um plano simples, pessoal e possível de seguir."],
  ["03", "Atravesse o momento", "O modo SOS desacelera a decisão e conduz você por ações práticas."],
  ["04", "Veja o progresso inteiro", "Streak importa, mas dias alinhados, hábitos e escolhas conscientes também."]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative bg-[var(--ink)] text-white">
        <div aria-hidden className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_78%_25%,#1aa99155,transparent_29%),radial-gradient(circle_at_20%_85%,#c28a3a28,transparent_24%)]" />
        <header className="shell relative flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-tight" aria-label="Sentinel, início">
            <span className="grid size-9 place-items-center rounded-full border border-[#65d8c1]/40 bg-[#123235]"><Shield size={18} aria-hidden /></span>
            <span>Sentinel</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Conta">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:text-white">Entrar</Link>
            <Link href="/signup" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--ink)] sm:block">Começar</Link>
          </nav>
        </header>

        <div className="shell relative grid min-h-[720px] items-center gap-12 pb-20 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="eyebrow mb-7 flex items-center gap-2 text-[#77dbc7]"><LockKeyhole size={14} /> Privado por princípio</div>
            <h1 className="display text-[clamp(3.25rem,8vw,6.7rem)] leading-[.9]">Recupere o controle.<br /><span className="text-[#77dbc7]">Um dia de cada vez.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">Entenda seus gatilhos, atravesse momentos difíceis e acompanhe sua evolução em um espaço privado e sem julgamentos.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#71dbc6] px-7 font-bold text-[var(--ink)] transition hover:bg-[#8ce6d4]">Começar gratuitamente <ArrowRight size={18} /></Link>
              <Link href="#como-funciona" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-7 font-semibold text-white/80 hover:border-white/30">Como funciona</Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/45"><Check size={15} /> Sem anúncios. Sem culpa. Seus dados continuam seus.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[480px] lg:mr-0">
            <div aria-hidden className="absolute -inset-10 rounded-full border border-white/5" />
            <div className="relative rounded-[2.2rem] border border-white/10 bg-[#0c2528]/85 p-5 shadow-2xl shadow-black/30">
              <div className="mb-7 flex items-center justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Demonstração</p><p className="mt-1 font-semibold">Boa noite, Lucas.</p></div>
                <span className="rounded-full bg-[#17383a] px-3 py-1.5 text-xs text-[#85dfce]">Risco baixo</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-[1.7rem] bg-[#f3f7f4] p-6 text-[var(--ink)]">
                  <div className="relative mx-auto grid aspect-square max-w-[190px] place-items-center rounded-full [background:conic-gradient(#41c7ae_0_77%,#dbe6e1_77%)]">
                    <div className="grid size-[82%] place-items-center rounded-full bg-[#f3f7f4] text-center"><div><strong className="display block text-5xl">7</strong><span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">dias</span></div></div>
                  </div>
                  <p className="mt-4 text-center text-sm text-[var(--muted)]">27 de 30 dias alinhados</p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-[1.4rem] bg-[#17383a] p-5"><span className="text-xs text-white/45">Próximo passo</span><p className="mt-2 font-semibold">Seu check-in leva menos de 1 minuto.</p><span className="mt-4 inline-flex text-sm font-bold text-[#77dbc7]">Fazer agora →</span></div>
                  <div className="rounded-[1.4rem] border border-[#f3bd66]/20 bg-[#f3bd66]/10 p-5"><Sparkles size={18} className="text-[#f3bd66]" /><p className="mt-3 text-sm leading-6 text-white/70">“Estou reconstruindo minha vida com escolhas pequenas e consistentes.”</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="shell py-24 sm:py-32">
        <div className="max-w-2xl"><p className="eyebrow text-[var(--teal-deep)]">Como funciona</p><h2 className="display mt-4 text-4xl leading-tight sm:text-6xl">Apoio para antes, durante e depois de um momento difícil.</h2></div>
        <div className="mt-14 grid border-t border-[var(--line)] md:grid-cols-2">
          {steps.map(([number, title, text]) => <article key={number} className="border-b border-[var(--line)] py-8 md:px-8 md:first:pl-0 md:even:border-l"><span className="text-sm font-bold text-[var(--teal-deep)]">{number}</span><h3 className="mt-8 text-xl font-bold">{title}</h3><p className="mt-3 max-w-md leading-7 text-[var(--muted)]">{text}</p></article>)}
        </div>
      </section>

      <section className="bg-[var(--paper-deep)] py-20">
        <div className="shell grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow text-[var(--teal-deep)]">Progresso sem punição</p><h2 className="display mt-4 text-4xl sm:text-5xl">Um recomeço não apaga o caminho percorrido.</h2></div><div className="rounded-[var(--radius)] bg-white/65 p-7"><p className="text-lg leading-8 text-[var(--muted)]">Depois de uma recaída, o contador pode reiniciar. Seu aprendizado, seus hábitos e os <strong className="text-[var(--ink)]">27 dias alinhados nos últimos 30</strong> continuam contando.</p></div></div>
      </section>

      <footer className="bg-[var(--ink)] py-12 text-white"><div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Sentinel</p><p className="mt-2 text-sm text-white/45">Uma ferramenta de apoio. Não substitui acompanhamento profissional.</p></div><div className="flex gap-5 text-sm text-white/60"><Link href="/privacy">Privacidade</Link><Link href="/terms">Termos</Link></div></div></footer>
    </main>
  );
}
