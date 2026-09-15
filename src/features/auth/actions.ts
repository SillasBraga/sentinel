"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { credentialsSchema, emailSchema } from "./validation";

export async function login(formData: FormData) {
  const input = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) redirect("/login?error=Verifique%20os%20dados%20informados");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(input.data);
  if (error) redirect("/login?error=E-mail%20ou%20senha%20incorretos");
  const next = String(formData.get("next") ?? "");
  redirect((next.startsWith("/") && !next.startsWith("//") ? next : "/app/dashboard") as never);
}

export async function signup(formData: FormData) {
  const input = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) redirect("/signup?error=Use%20um%20e-mail%20válido%20e%20senha%20com%208%20caracteres");
  const supabase = await createClient();
  const next = String(formData.get("next") ?? "");
  const callbackNext = next.startsWith("/") && !next.startsWith("//") ? next : "/app/onboarding";
  const { error } = await supabase.auth.signUp({ ...input.data, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=${encodeURIComponent(callbackNext)}` } });
  if (error) redirect("/signup?error=Não%20foi%20possível%20criar%20a%20conta");
  redirect("/login?message=Confira%20seu%20e-mail%20para%20confirmar%20a%20conta");
}

export async function sendMagicLink(formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) redirect("/login?error=Informe%20um%20e-mail%20válido");
  const supabase = await createClient();
  const next = String(formData.get("next") ?? ""); const callbackNext = next.startsWith("/") && !next.startsWith("//") ? next : "/app/dashboard";
  await supabase.auth.signInWithOtp({ email: email.data, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=${encodeURIComponent(callbackNext)}` } });
  redirect("/login?message=Enviamos%20um%20link%20de%20acesso");
}

export async function resetPassword(formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) redirect("/forgot-password?error=Informe%20um%20e-mail%20válido");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/app/settings` });
  redirect("/forgot-password?message=Confira%20seu%20e-mail");
}

export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
