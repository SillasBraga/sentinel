import Link from "next/link";
import { AuthShell, Field, FormNotice } from "@/components/auth-shell";
import { resetPassword } from "@/features/auth/actions";

export default async function ForgotPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return <AuthShell title="Recupere seu acesso." description="Enviaremos um link seguro para o seu e-mail."><FormNotice {...params} /><form action={resetPassword} className="grid gap-5"><Field label="E-mail" name="email" type="email" autoComplete="email" /><button className="min-h-13 rounded-full bg-[var(--ink)] px-6 font-bold text-white">Enviar link de recuperação</button></form><Link href="/login" className="mt-7 inline-block text-sm font-bold text-[var(--teal-deep)]">Voltar para entrar</Link></AuthShell>;
}
