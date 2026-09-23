import Link from "next/link";
import { CosmeticStylePicker } from "@/components/cosmetic-style-picker";
import { PageHeader } from "@/components/page-header";
import { deleteAccount, updatePrivacy } from "@/features/settings/actions";
import { requireUser } from "@/lib/auth";
import { getCosmeticCollection } from "@/lib/cosmetics";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const params = await searchParams;
  const [{ data: profile }, { data: privacy }, { data: xpEvents }] = await Promise.all([
    supabase.from("profiles").select("discreet_mode,hide_sensitive_numbers,spiritual_mode,cosmetic_style").eq("id", user.id).single(),
    supabase.from("privacy_preferences").select("personal_analytics,browser_notifications,quick_exit").eq("user_id", user.id).single(),
    supabase.from("presence_xp_events").select("points").eq("user_id", user.id),
  ]);
  const cosmetics = getCosmeticCollection((xpEvents ?? []).reduce((total, event) => total + event.points, 0));

  return (
    <div className="mx-auto max-w-4xl p-5 py-8 sm:p-8 lg:p-12">
      <PageHeader eyebrow="Configurações" title="Privacidade sob seu controle." description="Você decide o que aparece, o que é analisado e quando seus dados deixam de existir." />
      {params.saved && <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-800">Preferências salvas.</p>}
      {params.error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{params.error}</p>}

      <section className="mt-8">
        <p className="eyebrow text-[var(--teal-deep)]">Sua jornada</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileLink href="/app/habits" label="Rituais" text="Rotinas que fortalecem seu dia." />
          <ProfileLink href="/app/goals" label="Objetivos" text="Direção sem pressão." />
          <ProfileLink href="/app/journal" label="Diário" text="Seu espaço continua privado." />
          <ProfileLink href="/app/plan" label="Plano" text="Gatilhos, motivos e equipamento." />
          <ProfileLink href="/app/protection" label="Defesas" text="Proteções para ambiente digital." />
          <ProfileLink href="/app/calendar" label="Mapa" text="Veja registros ao longo do tempo." />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ProfileLink href="/app/accountability" label="Aliado" text="Apoio opcional com limites claros." />
          <ProfileLink href="/app/settings/install" label="Instalar Sentinel" text="Leve este espaço para sua tela inicial." />
        </div>
      </section>

      <form action={updatePrivacy} className="mt-6 grid gap-4 rounded-[1.8rem] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold">Aparência e privacidade</h2>
        <Toggle name="discreetMode" label="Modo discreto" text="Troca Sentinel por Focus na área privada." checked={profile?.discreet_mode} />
        <Toggle name="hideNumbers" label="Ocultar números sensíveis" text="Esconde streak e percentuais do dashboard." checked={profile?.hide_sensitive_numbers} />
        <Toggle name="analytics" label="Análises pessoais" text="Usa somente seus registros para encontrar padrões." checked={privacy?.personal_analytics} />
        <Toggle name="notifications" label="Notificações do navegador" text="Mensagens sempre neutras e sem conteúdo explícito." checked={privacy?.browser_notifications} />
        <Toggle name="quickExit" label="Saída rápida" text="Mostra o atalho para uma tela neutra." checked={privacy?.quick_exit} />
        <label className="grid gap-2 text-sm font-bold">
          Modo espiritual
          <select name="spiritualMode" defaultValue={profile?.spiritual_mode ?? "off"} className="min-h-13 rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">
            <option value="off">Desativado</option>
            <option value="christian">Cristão</option>
            <option value="custom">Personalizado</option>
          </select>
        </label>
        <button className="primary-action min-h-13 rounded-full px-6 font-bold">Salvar preferências</button>
      </form>

      <CosmeticStylePicker cosmetics={cosmetics} selectedStyle={profile?.cosmetic_style === "aurora" || profile?.cosmetic_style === "constellation" ? profile.cosmetic_style : "base"} />

      <section className="mt-6 rounded-[1.8rem] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold">Seus dados</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">O arquivo exportado contém seus registros, mas nunca tokens, hashes ou segredos internos.</p>
        <a href="/api/export" className="mt-5 inline-grid min-h-12 place-items-center rounded-full border border-[var(--line)] px-5 font-bold">Exportar meus dados</a>
      </section>

      <section className="danger-zone mt-6 rounded-[1.8rem] border border-red-200 bg-red-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-red-950">Excluir conta</h2>
        <p className="mt-2 text-sm leading-6 text-red-800">Esta ação remove seus dados privados e invalida relacionamentos. Não pode ser desfeita.</p>
        <form action={deleteAccount} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input name="confirmation" placeholder="Digite EXCLUIR" className="min-h-12 flex-1 rounded-xl border border-red-200 bg-white px-4" />
          <button className="min-h-12 rounded-full bg-red-800 px-5 font-bold text-white">Excluir definitivamente</button>
        </form>
      </section>
    </div>
  );
}

function Toggle({ name, label, text, checked }: { name: string; label: string; text: string; checked?: boolean }) {
  return <label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] p-4"><span><strong className="block">{label}</strong><span className="mt-1 block text-sm text-[var(--muted)]">{text}</span></span><input type="checkbox" name={name} defaultChecked={checked} className="size-5" /></label>;
}

function ProfileLink({ href, label, text }: { href: "/app/habits" | "/app/goals" | "/app/journal" | "/app/plan" | "/app/protection" | "/app/calendar" | "/app/accountability" | "/app/settings/install"; label: string; text: string }) {
  return <Link href={href} className="group rounded-[1.35rem] border border-[var(--line)] bg-white p-5"><strong className="block">{label} <span className="text-[var(--teal-deep)] transition-transform group-hover:translate-x-1">→</span></strong><span className="mt-2 block text-sm leading-5 text-[var(--muted)]">{text}</span></Link>;
}
