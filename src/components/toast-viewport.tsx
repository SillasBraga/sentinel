"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ToastState = { id: number; type: "success" | "error"; message: string };

declare global {
  interface WindowEventMap {
    "sentinel-toast": CustomEvent<{ type: "success" | "error"; message: string }>;
  }
}

const fallbackMessages: Record<string, string> = {
  saved: "Preferências salvas com sucesso.",
  accepted: "Convite aceito com sucesso.",
  support: "Pedido de apoio enviado.",
  welcome: "Configuração concluída. Boas-vindas ao Sentinel.",
  success: "Alteração salva com sucesso."
};

function normalizeMessage(message: string) {
  return Object.entries({ "Ã§": "ç", "Ã£": "ã", "Ãµ": "õ", "Ã¡": "á", "Ã©": "é", "Ã­": "í", "Ã³": "ó", "Ãº": "ú", "Ãª": "ê", "Ã´": "ô", "Ã‡": "Ç", "Ãƒ": "Ã", "Â": "" }).reduce((text, [broken, correct]) => text.replaceAll(broken, correct), message);
}

export function ToastViewport() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ToastState | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    const show = (type: ToastState["type"], message: string) => {
      sequence.current += 1;
      setToast({ id: sequence.current, type, message: normalizeMessage(message) });
    };
    const error = searchParams.get("error");
    const success = searchParams.get("toast") ?? searchParams.get("message") ?? Object.entries(fallbackMessages).find(([key]) => searchParams.has(key))?.[1];
    if (error) show("error", error);
    else if (success) show("success", success);

    if (error || success) {
      const clean = new URLSearchParams(searchParams.toString());
      ["error", "toast", "message", ...Object.keys(fallbackMessages)].forEach((key) => clean.delete(key));
      const query = clean.toString();
      window.history.replaceState(window.history.state, "", `${pathname}${query ? `?${query}` : ""}`);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const listener = (event: WindowEventMap["sentinel-toast"]) => {
      sequence.current += 1;
      setToast({ id: sequence.current, ...event.detail });
    };
    window.addEventListener("sentinel-toast", listener);
    return () => window.removeEventListener("sentinel-toast", listener);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;
  const Icon = toast.type === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <div key={toast.id} className={`toast-card toast-enter toast-${toast.type}`} role={toast.type === "error" ? "alert" : "status"}>
        <span className="toast-icon"><Icon size={20} /></span>
        <p>{toast.message}</p>
        <button type="button" onClick={() => setToast(null)} aria-label="Fechar aviso" className="toast-close"><X size={17} /></button>
        <span className="toast-timer" aria-hidden />
      </div>
    </div>
  );
}
