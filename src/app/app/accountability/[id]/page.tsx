import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

type Snapshot = { name?: string; streak?: number; alignedDays?: number; checkin?: { mood: number } | null; risk?: { level: string } | null; supportRequest?: { requestedAt: string } | null; goal?: { title: string } | null; journal?: { title?: string; body: string } | null };

export default async function AllyDashboard({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("accountability_partner_snapshot", { p_relationship_id: id });
  if (error || !data) notFound();
  const snapshot = data as Snapshot;
  return <div className="mx-auto max-w-4xl p-5 py-8 sm:p-8 lg:p-12"><PageHeader eyebrow="Painel do aliado" title={snapshot.name ?? "Pessoa apoiada"} description="Você está vendo somente as informações que esta pessoa decidiu compartilhar." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{snapshot.streak !== undefined && <Card label="Streak atual" value={`${snapshot.streak} dias`} />}{snapshot.alignedDays !== undefined && <Card label="Últimos 30 dias" value={`${snapshot.alignedDays} dias alinhados`} />}{snapshot.checkin && <Card label="Último check-in" value={["", "Em risco", "Vulnerável", "Neutro", "Bem", "Muito bem"][snapshot.checkin.mood]} />}{snapshot.risk && <Card label="Indicador de risco" value={snapshot.risk.level} />}{snapshot.goal && <Card label="Meta atual" value={snapshot.goal.title} />}{snapshot.supportRequest && <Card label="Último pedido de apoio" value={new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(snapshot.supportRequest.requestedAt))} />}</div>{snapshot.journal && <section className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6"><p className="eyebrow text-amber-800">Diário compartilhado explicitamente</p>{snapshot.journal.title && <h2 className="mt-3 text-xl font-bold">{snapshot.journal.title}</h2>}<p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--muted)]">{snapshot.journal.body}</p></section>}<p className="mt-8 text-sm leading-6 text-[var(--muted)]">Apoie sem vigiar. Uma mensagem curta como “Estou com você” costuma ser mais útil do que perguntas detalhadas.</p></div>;
}

function Card({ label, value }: { label: string; value: string }) { return <article className="rounded-[1.5rem] bg-white p-6"><p className="text-sm text-[var(--muted)]">{label}</p><strong className="mt-2 block text-xl capitalize">{value}</strong></article>; }
