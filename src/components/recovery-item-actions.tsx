"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { deleteGoal, deleteHabit, updateGoal, updateHabit } from "@/features/recovery/actions";

type Props = {
  kind: "habit" | "goal";
  id: string;
  title: string;
  targetDate?: string | null;
};

export function RecoveryItemActions({ kind, id, title, targetDate }: Props) {
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);
  const label = kind === "habit" ? "hábito" : "meta";
  const theme = modal && typeof document !== "undefined" && document.querySelector<HTMLElement>(".app-surface")?.dataset.theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setModal(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modal]);

  const layer = modal ? createPortal(
    <div className="modal-layer" data-theme={theme} onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby={`${kind}-${modal}-${id}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-[var(--teal-deep)]">{modal === "edit" ? "Editar" : "Confirmar exclusão"}</p>
            <h2 id={`${kind}-${modal}-${id}`} className="mt-2 text-2xl font-extrabold">{modal === "edit" ? `Editar ${label}` : `Excluir ${label}?`}</h2>
          </div>
          <button type="button" onClick={() => setModal(null)} className="modal-close" aria-label="Fechar"><X size={19} /></button>
        </div>

        {modal === "edit" ? (
          <form action={kind === "habit" ? updateHabit : updateGoal} className="mt-6 grid gap-4">
            <input type="hidden" name={kind === "habit" ? "habitId" : "goalId"} value={id} />
            <label className="grid gap-2 text-sm font-bold">
              {kind === "habit" ? "Nome do hábito" : "Título da meta"}
              <input autoFocus required name={kind === "habit" ? "name" : "title"} defaultValue={title} className="min-h-12 rounded-xl border border-[var(--line)] bg-white px-4 font-normal" />
            </label>
            {kind === "goal" && <label className="grid gap-2 text-sm font-bold">Data desejada<input name="targetDate" type="date" defaultValue={targetDate ?? ""} className="min-h-12 rounded-xl border border-[var(--line)] bg-white px-4 font-normal" /></label>}
            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setModal(null)} className="min-h-11 rounded-full border border-[var(--line)] px-5 font-bold">Cancelar</button>
              <button className="primary-action min-h-11 rounded-full px-6 font-bold">Salvar alterações</button>
            </div>
          </form>
        ) : (
          <div className="mt-5">
            <p className="leading-7 text-[var(--muted)]">Você está prestes a excluir <strong className="modal-strong">“{title}”</strong>. {kind === "habit" ? "Os registros de conclusão desse hábito também serão removidos." : "Esta ação remove a meta permanentemente."}</p>
            <form action={kind === "habit" ? deleteHabit : deleteGoal} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input type="hidden" name={kind === "habit" ? "habitId" : "goalId"} value={id} />
              <button type="button" onClick={() => setModal(null)} className="min-h-11 rounded-full border border-[var(--line)] px-5 font-bold">Cancelar</button>
              <button className="danger-action inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-bold"><Trash2 size={17} /> Excluir {label}</button>
            </form>
          </div>
        )}
      </section>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="flex shrink-0 items-center gap-2" aria-label={`Ações de ${title}`}>
        <button type="button" onClick={() => setModal("edit")} className="item-icon-action item-icon-edit" aria-label={`Editar ${title}`} title="Editar"><Pencil size={17} /></button>
        <button type="button" onClick={() => setModal("delete")} className="item-icon-action item-icon-delete" aria-label={`Excluir ${title}`} title="Excluir"><Trash2 size={17} /></button>
      </div>
      {layer}
    </>
  );
}
