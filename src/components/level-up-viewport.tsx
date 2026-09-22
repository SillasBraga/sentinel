"use client";

import { Sparkles, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRIVATE_MILESTONES, isPrivateMilestoneId, type PrivateMilestoneId } from "@/lib/private-milestones";

type Celebration = { level?: number; milestoneIds?: PrivateMilestoneId[]; id: number };

declare global { interface WindowEventMap { "sentinel-level-up": CustomEvent<{ level: number }>; "sentinel-milestones": CustomEvent<{ milestoneIds: PrivateMilestoneId[] }>; } }

export function LevelUpViewport() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const level = Number(searchParams.get("levelUp"));
    const milestoneIds = (searchParams.get("milestone") ?? "").split(",").filter(isPrivateMilestoneId);
    if ((!Number.isSafeInteger(level) || level < 2) && !milestoneIds.length) return;
    const showTimer = window.setTimeout(() => setCelebration({ level: Number.isSafeInteger(level) && level >= 2 ? level : undefined, milestoneIds, id: Date.now() }), 0);
    const cleanTimer = window.setTimeout(() => {
      const current = new URLSearchParams(window.location.search);
      current.delete("levelUp");
      current.delete("milestone");
      window.history.replaceState(window.history.state, "", `${pathname}${current.size ? `?${current}` : ""}`);
    }, 0);
    return () => { window.clearTimeout(showTimer); window.clearTimeout(cleanTimer); };
  }, [pathname, searchParams]);

  useEffect(() => {
    const listener = (event: WindowEventMap["sentinel-level-up"]) => setCelebration({ level: event.detail.level, id: Date.now() });
    window.addEventListener("sentinel-level-up", listener);
    return () => window.removeEventListener("sentinel-level-up", listener);
  }, []);

  useEffect(() => {
    const listener = (event: WindowEventMap["sentinel-milestones"]) => setCelebration({ milestoneIds: event.detail.milestoneIds, id: Date.now() });
    window.addEventListener("sentinel-milestones", listener);
    return () => window.removeEventListener("sentinel-milestones", listener);
  }, []);

  useEffect(() => {
    if (!celebration) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCelebration(null);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const buttons = dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (buttons.length && document.activeElement === buttons[buttons.length - 1] && !event.shiftKey) { event.preventDefault(); buttons[0].focus(); }
      if (buttons.length && document.activeElement === buttons[0] && event.shiftKey) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [celebration]);

  if (!celebration) return null;
  const milestones = celebration.milestoneIds ?? [];
  const title = milestones.length ? milestones.map((id) => PRIVATE_MILESTONES[id].title).join(" e ") : `Nível ${celebration.level}`;
  const description = milestones.length ? milestones.map((id) => PRIVATE_MILESTONES[id].description).join(" ") : "Você acumulou presença com ações que escolheu fazer. Continue no seu ritmo.";
  return <div className="level-up-layer" role="dialog" aria-modal="true" aria-labelledby="level-up-title"><div ref={dialogRef} key={celebration.id} className="level-up-card"><button autoFocus type="button" onClick={() => setCelebration(null)} className="level-up-close" aria-label="Fechar celebração"><X size={18} /></button><div className="level-up-sparkles" aria-hidden><Sparkles size={34} /><Sparkles size={21} /><Sparkles size={26} /></div><p className="eyebrow text-[var(--teal-deep)]">Novo marco</p><h2 id="level-up-title" className="display mt-3 text-4xl">{title}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{description}</p><button type="button" onClick={() => setCelebration(null)} className="primary-action mt-7 min-h-12 rounded-full px-6 font-bold">Continuar</button></div></div>;
}
