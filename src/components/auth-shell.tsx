import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-[.9fr_1.1fr]">
    <aside className="relative hidden overflow-hidden bg-[var(--ink)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div aria-hidden className="absolute inset-0 [background:radial-gradient(circle_at_20%_25%,#25bda044,transparent_28%)]" />
      <Link href="/" className="relative flex items-center gap-3 font-bold"><ShieldCheck className="text-[#71dbc6]" /> Sentinel</Link>
      <blockquote className="display relative max-w-lg text-5xl leading-[1.04]">“Mudança não é um único grande gesto. É uma sequência de escolhas conscientes.”</blockquote>
      <p className="relative text-sm text-white/45">Privado por princípio · Sem anúncios · Sem julgamentos</p>
    </aside>
    <section className="grid place-items-center p-5 sm:p-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-12 flex items-center gap-2 font-bold lg:hidden"><ShieldCheck className="text-[var(--teal-deep)]" /> Sentinel</Link>
        <h1 className="display text-4xl sm:text-5xl">{title}</h1><p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  </main>;
}

export function Field({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input required name={name} type={type} autoComplete={autoComplete} className="min-h-13 rounded-2xl border border-[var(--line)] bg-white px-4 font-normal shadow-sm outline-none focus:border-[var(--teal-deep)]" /></label>;
}

export function FormNotice({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;
  return <p role="status" className={`mb-5 rounded-2xl p-4 text-sm ${error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{error ?? message}</p>;
}
