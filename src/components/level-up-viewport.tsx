"use client";

import { Sparkles, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LevelUp = { level: number; id: number };

declare global { interface WindowEventMap { "sentinel-level-up": CustomEvent<{ level: number }>; } }

export function LevelUpViewport() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [levelUp, setLevelUp] = useState<LevelUp | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const level = Number(searchParams.get("levelUp"));
    if (!Number.isSafeInteger(level) || level < 2) return;
    const showTimer = window.setTimeout(() => setLevelUp({ level, id: Date.now() }), 0);
    const cleanTimer = window.setTimeout(() => {
      const current = new URLSearchParams(window.location.search);
      current.delete("levelUp");
      window.history.replaceState(window.history.state, "", `${pathname}${current.size ? `?${current}` : ""}`);
    }, 0);
    return () => { window.clearTimeout(showTimer); window.clearTimeout(cleanTimer); };
  }, [pathname, searchParams]);

  useEffect(() => {
    const listener = (event: WindowEventMap["sentinel-level-up"]) => setLevelUp({ level: event.detail.level, id: Date.now() });
    window.addEventListener("sentinel-level-up", listener);
    return () => window.removeEventListener("sentinel-level-up", listener);
  }, []);

  useEffect(() => {
    if (!levelUp) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLevelUp(null);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const buttons = dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (buttons.length && document.activeElement === buttons[buttons.length - 1] && !event.shiftKey) { event.preventDefault(); buttons[0].focus(); }
      if (buttons.length && document.activeElement === buttons[0] && event.shiftKey) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [levelUp]);

  if (!levelUp) return null;
  return <div className="level-up-layer" role="dialog" aria-modal="true" aria-labelledby="level-up-title"><div ref={dialogRef} key={levelUp.id} className="level-up-card"><button autoFocus type="button" onClick={() => setLevelUp(null)} className="level-up-close" aria-label="Fechar celebração"><X size={18} /></button><div className="level-up-sparkles" aria-hidden><Sparkles size={34} /><Sparkles size={21} /><Sparkles size={26} /></div><p className="eyebrow text-[var(--teal-deep)]">Novo marco</p><h2 id="level-up-title" className="display mt-3 text-4xl">Nível {levelUp.level}</h2><p className="mt-4 leading-7 text-[var(--muted)]">Você acumulou presença com ações que escolheu fazer. Continue no seu ritmo.</p><button type="button" onClick={() => setLevelUp(null)} className="primary-action mt-7 min-h-12 rounded-full px-6 font-bold">Continuar</button></div></div>;
}
