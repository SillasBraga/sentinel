"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SubmitButton } from "@/components/form-controls";
import { createJournalEntry } from "@/features/recovery/actions";

export function JournalEntryDialog() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const theme = open && typeof document !== "undefined" && document.querySelector<HTMLElement>(".app-surface")?.dataset.theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled])"));
      const first = focusable[0], last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); trigger?.focus(); };
  }, [open]);

  const modal = open ? createPortal(
    <div className="modal-layer" data-theme={theme} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} className="modal-card" role="dialog" aria-modal="true" aria-labelledby="new-journal-entry-title">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[var(--teal-deep)]">Diário privado</p><h2 id="new-journal-entry-title" className="mt-2 text-2xl font-extrabold">Registrar nota</h2></div><button type="button" onClick={() => setOpen(false)} className="modal-close" aria-label="Fechar"><X size={19} /></button></div>
        <form action={createJournalEntry} className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-bold">Título (opcional)<input autoFocus name="title" className="min-h-12 rounded-xl border border-[var(--line)] bg-white px-4 font-normal" /></label>
          <label className="grid gap-2 text-sm font-bold">O que você quer registrar?<textarea required name="body" rows={8} className="resize-none rounded-xl border border-[var(--line)] bg-white p-4 font-normal leading-7" /></label>
          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-full border border-[var(--line)] px-5 font-bold">Cancelar</button><SubmitButton>Salvar nota</SubmitButton></div>
        </form>
      </section>
    </div>, document.body) : null;

  return <><button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="primary-action inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-bold"><Plus size={18} /> Registrar nota</button>{modal}</>;
}
