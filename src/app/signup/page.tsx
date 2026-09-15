import Link from "next/link";
import { AuthShell, Field, FormNotice } from "@/components/auth-shell";
import { signup } from "@/features/auth/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return <AuthShell title="Comece com um passo pequeno." description="Sua jornada é privada. Você escolhe o que registrar e o que compartilhar.">
    <FormNotice {...params} /><form action={signup} className="grid gap-5"><input type="hidden" name="next" value={params.next??""}/><Field label="E-mail" name="email" type="email" autoComplete="email" /><Field label="Senha" name="password" type="password" autoComplete="new-password" /><p className="-mt-2 text-xs leading-5 text-[var(--muted)]">Use pelo menos 8 caracteres. Ao continuar, você concorda com os Termos e a Política de Privacidade.</p><button className="min-h-13 rounded-full bg-[var(--ink)] px-6 font-bold text-white">Criar minha conta</button></form><p className="mt-7 text-sm text-[var(--muted)]">Já tem conta? <Link className="font-bold text-[var(--teal-deep)]" href={params.next?`/login?next=${encodeURIComponent(params.next)}`:"/login"}>Entrar</Link></p>
  </AuthShell>;
}
