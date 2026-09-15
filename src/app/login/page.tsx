import Link from "next/link";
import { AuthShell, Field, FormNotice } from "@/components/auth-shell";
import { login, sendMagicLink } from "@/features/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthShell title="Que bom ter você de volta." description="Entre em seu espaço privado para continuar de onde parou.">
    <FormNotice {...params} />
    <form action={login} className="grid gap-5"><input type="hidden" name="next" value={params.next??""}/><Field label="E-mail" name="email" type="email" autoComplete="email" /><Field label="Senha" name="password" type="password" autoComplete="current-password" /><button className="min-h-13 rounded-full bg-[var(--ink)] px-6 font-bold text-white hover:bg-[var(--ink-soft)]">Entrar</button></form>
    <div className="my-6 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />ou<span className="h-px flex-1 bg-[var(--line)]" /></div>
    <form action={sendMagicLink} className="grid gap-3"><input type="hidden" name="next" value={params.next??""}/><Field label="Entrar com link mágico" name="email" type="email" autoComplete="email" /><button className="min-h-12 rounded-full border border-[var(--line)] bg-white px-6 font-bold">Enviar link</button></form>
    <div className="mt-7 flex justify-between text-sm"><Link className="font-semibold text-[var(--teal-deep)]" href={params.next?`/signup?next=${encodeURIComponent(params.next)}`:"/signup"}>Criar conta</Link><Link className="text-[var(--muted)]" href="/forgot-password">Esqueci a senha</Link></div>
  </AuthShell>;
}
