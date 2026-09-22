import { Flame, LifeBuoy, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SelectField, SubmitButton, TextAreaField } from "@/components/form-controls";
import { createAttentionZone } from "@/features/attention-zones/actions";
import { RecoveryItemActions } from "@/components/recovery-item-actions";
import { createUrge } from "@/features/recovery/actions";
import { summarizeAttentionZone, type AttentionZoneEvent } from "@/lib/attention-zones";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function TriggersPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: zones }, { data: urges }, { data: activities }] = await Promise.all([
    supabase.from("attention_zones").select("id,name").eq("user_id", user.id).order("created_at", { ascending: true }),
    supabase.from("urges").select("attention_zone_id,location_context,emotion,associated_platform,protection_strategy").eq("user_id", user.id).not("attention_zone_id", "is", null),
    supabase.from("alternative_activities").select("label").eq("user_id", user.id).eq("active", true).order("created_at", { ascending: true }),
  ]);
  const params = await searchParams;
  const events: AttentionZoneEvent[] = (urges ?? []).map((urge) => ({ attentionZoneId: urge.attention_zone_id, location: urge.location_context, emotion: urge.emotion, platform: urge.associated_platform, strategy: urge.protection_strategy }));

  return <div className="mx-auto max-w-5xl p-5 py-8 sm:p-8 lg:p-12">
    <PageHeader eyebrow="Zonas de atenção" title="Nomeie os desafios que voltam." description="Associe um registro à zona para enxergar frequência, contexto e as estratégias que mais ajudam você." />
    {params.error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{params.error}</p>}

    <form action={createAttentionZone} className="mt-8 grid gap-3 rounded-[1.5rem] border border-[var(--line)] bg-white/65 p-5 sm:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="zone-name">Nome da zona de atenção</label><input id="zone-name" name="name" required maxLength={120} placeholder="Ex.: noite sozinho, redes sociais ou estresse" className="min-h-12 rounded-2xl border border-[var(--line)] bg-white px-4 text-[var(--ink)]" /><button className="primary-action min-h-12 rounded-full px-6 font-bold">Criar zona</button>
    </form>

    <section className="mt-5 grid gap-4 md:grid-cols-2">{(zones ?? []).map((zone) => {
      const summary = summarizeAttentionZone(zone.id, events);
      return <article key={zone.id} className="rounded-[1.6rem] border border-[var(--line)] bg-white/65 p-5"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[var(--teal-deep)]">Desafio privado</p><h2 className="mt-2 text-xl font-bold">{zone.name}</h2></div><div className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-2xl bg-[#d9eee7] text-[var(--teal-deep)]"><Flame size={19} /></span><RecoveryItemActions kind="attentionZone" id={zone.id} title={zone.name} /></div></div><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><Stat label="Registros" value={String(summary.frequency)} /><Stat label="Contexto comum" value={summary.context ?? "Aguardando"} /><Stat label="Estratégia mais usada" value={summary.strategy ?? "Aguardando"} /></dl><div className="mt-5 flex flex-wrap gap-3"><Link href="/app/sos" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-sm font-bold text-white"><LifeBuoy size={16} /> Abrir SOS</Link><Link href="/app/dashboard#power-up" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold"><ShieldCheck size={16} className="text-[var(--teal-deep)]" /> Abrir power-up</Link></div></article>;
    })}</section>
    {!zones?.length && <p className="mt-5 rounded-2xl bg-[#f3f7f4] p-4 text-sm leading-6 text-[var(--muted)]">Crie uma zona para começar. Elas não comparam você com ninguém e ficam privadas.</p>}

    <form action={createUrge} className="mt-8 grid gap-6 rounded-[1.8rem] bg-white p-6 sm:p-8"><h2 className="text-2xl font-bold">Registrar um impulso</h2><label className="grid gap-3 text-sm font-bold">Intensidade: 0 a 10<input name="intensity" type="range" min="0" max="10" defaultValue="5" className="accent-[var(--teal-deep)]" /></label><div className="grid gap-5 sm:grid-cols-2"><SelectField label="Zona de atenção" name="attentionZoneId" required={false}><option value="">Não associar agora</option>{(zones ?? []).map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}</SelectField><SelectField label="Estratégia de proteção usada" name="protectionStrategy" required={false}><option value="">Não informar</option><option>SOS</option><option>Power-up de proteção</option>{(activities ?? []).map((activity) => <option key={activity.label}>{activity.label}</option>)}</SelectField></div><div className="grid gap-5 sm:grid-cols-2"><SelectField label="Emoção" name="emotion" required={false}><option value="">Não informar</option>{["Ansiedade","Tédio","Estresse","Tristeza","Solidão","Frustração"].map(v=><option key={v}>{v}</option>)}</SelectField><SelectField label="Ambiente" name="location" required={false}><option value="">Não informar</option>{["Casa","Trabalho","Quarto","Banheiro","Viagem","Outro"].map(v=><option key={v}>{v}</option>)}</SelectField></div><label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-4 text-sm font-bold"><input name="alone" type="checkbox" /> Eu estava sozinho</label><label className="grid gap-2 text-sm font-bold">Aplicativo ou site associado (opcional)<input name="platform" className="min-h-13 rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><TextAreaField label="O que passou pela sua cabeça? (opcional)" name="thought" /><TextAreaField label="Como você respondeu? (opcional)" name="response" /><SubmitButton>Salvar registro</SubmitButton></form>
  </div>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[var(--muted)]">{label}</dt><dd className="mt-1 break-words font-bold">{value}</dd></div>; }
