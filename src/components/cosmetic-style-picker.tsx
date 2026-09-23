"use client";

import { useState, useTransition } from "react";
import { setCosmeticStyle } from "@/features/settings/actions";
import type { CosmeticStyle } from "@/lib/cosmetics";

type Cosmetic = { id: CosmeticStyle; title: string; description: string; requiredXp: number; unlocked: boolean };

export function CosmeticStylePicker({ cosmetics, selectedStyle }: { cosmetics: Cosmetic[]; selectedStyle: CosmeticStyle }) {
  const [selected, setSelected] = useState(selectedStyle);
  const [isSaving, startTransition] = useTransition();

  const save = () => startTransition(async () => {
    const result = await setCosmeticStyle(selected);
    if (!result.ok) {
      window.dispatchEvent(new CustomEvent("sentinel-toast", { detail: { type: "error", message: result.message } }));
      return;
    }
    window.dispatchEvent(new CustomEvent("sentinel-cosmetic", { detail: result.cosmeticStyle }));
    window.dispatchEvent(new CustomEvent("sentinel-toast", { detail: { type: "success", message: "Ambiente visual aplicado." } }));
  });

  return <section className="mt-6 rounded-[1.8rem] bg-white p-6 sm:p-8">
    <h2 className="text-xl font-bold">Ambiente e moldura visual</h2>
    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Escolha uma aparência que já combina com a sua presença. Não há compras, moedas, caixas aleatórias ou prazo.</p>
    <fieldset className="mt-5 grid gap-3 sm:grid-cols-3">
      <legend className="sr-only">Escolha seu ambiente visual</legend>
      {cosmetics.map((cosmetic) => <label key={cosmetic.id} className="cosmetic-option grid min-h-44 content-between rounded-2xl border p-4" data-locked={!cosmetic.unlocked}>
        <input type="radio" name="cosmeticStyle" value={cosmetic.id} checked={selected === cosmetic.id} onChange={() => setSelected(cosmetic.id)} disabled={!cosmetic.unlocked || isSaving} className="size-5" />
        <span><strong className="block">{cosmetic.title}</strong><span className="mt-2 block text-sm leading-5 text-[var(--muted)]">{cosmetic.description}</span><span className="mt-3 block text-xs font-bold text-[var(--teal-deep)]">{cosmetic.unlocked ? "Disponível" : `Libera com ${cosmetic.requiredXp} XP de presença`}</span></span>
      </label>)}
    </fieldset>
    <button type="button" onClick={save} disabled={isSaving} className="primary-action mt-5 min-h-13 rounded-full px-6 font-bold">{isSaving ? "Aplicando…" : "Aplicar ambiente"}</button>
  </section>;
}
