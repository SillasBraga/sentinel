"use client";

import {
  BookHeart,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardPlus,
  Dumbbell,
  LayoutGrid,
  House,
  LifeBuoy,
  LogOut,
  Shield,
  ShieldCheck,
  MoonStar,
  Sun,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { logout } from "@/features/auth/actions";
import { updateTheme } from "@/features/settings/actions";
import { ToastViewport } from "@/components/toast-viewport";
import { LevelUpViewport } from "@/components/level-up-viewport";

const nav = [
  { href: "/app/dashboard", label: "Início", icon: House, sos: false },
  { href: "/app/records", label: "Registros", icon: ClipboardPlus, sos: false },
  { href: "/app/progress", label: "Progresso", icon: ChartNoAxesCombined, sos: false },
  { href: "/app/sos", label: "SOS", icon: LifeBuoy, sos: true },
  { href: "/app/journal", label: "Diário", icon: BookHeart, sos: false },
  { href: "/app/settings", label: "Perfil", icon: CircleUserRound, sos: false },
] as const;

const tools = [
  { href: "/app/plan", label: "Meu plano", icon: ShieldCheck },
  { href: "/app/habits", label: "Hábitos", icon: Dumbbell },
  { href: "/app/goals", label: "Metas", icon: Target },
  { href: "/app/calendar", label: "Calendário", icon: CalendarDays },
  { href: "/app/protection", label: "Proteção", icon: Shield },
] as const;

const mobileNav = nav.filter(({ href }) => ["/app/dashboard", "/app/records", "/app/progress", "/app/sos"].includes(href));
const moreNav = [...nav.filter(({ href }) => ["/app/journal", "/app/settings"].includes(href)), ...tools];

export function AppShell({ children, discreetMode = false, theme = "light" }: { children: React.ReactNode; discreetMode?: boolean; theme?: "light" | "dark" }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const mobileToolsDialogRef = useRef<HTMLElement>(null);
  const [activeTheme, setActiveTheme] = useState(theme);
  const [isSavingTheme, startThemeTransition] = useTransition();

  const toggleSidebar = () => {
    setCollapsed((current) => !current);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isPrimaryActive = (href: string) => href === "/app/records" ? ["/app/records", "/app/checkin", "/app/triggers", "/app/relapse"].some(isActive) : isActive(href);
  const moreActive = moreNav.some(({ href }) => isActive(href));

  useEffect(() => {
    if (!mobileToolsOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileToolsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusableElements = mobileToolsDialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusableElements?.length) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleDialogKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleDialogKeyboard);
      previousActiveElement?.focus();
    };
  }, [mobileToolsOpen]);

  const toggleTheme = () => {
    const previousTheme = activeTheme;
    const nextTheme = activeTheme === "light" ? "dark" : "light";
    setActiveTheme(nextTheme);
    startThemeTransition(async () => {
      try {
        await updateTheme(nextTheme);
        window.dispatchEvent(new CustomEvent("sentinel-toast", { detail: { type: "success", message: `Tema ${nextTheme === "dark" ? "escuro" : "claro"} ativado.` } }));
      } catch {
        setActiveTheme(previousTheme);
        window.dispatchEvent(new CustomEvent("sentinel-toast", { detail: { type: "error", message: "Não foi possível salvar o tema." } }));
      }
    });
  };

  return (
    <div className="app-surface min-h-screen" data-theme={activeTheme}>
      <aside
        className={`desktop-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col overflow-visible border-r border-[var(--sidebar-line)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-[24px_0_70px_rgba(2,18,20,.10)] transition-[width,padding,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:flex ${collapsed ? "w-[92px] px-4 py-6" : "w-[280px] p-6"}`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -left-24 -top-20 size-64 rounded-full bg-[#34d6ba]/10 blur-3xl" />
          <span className="absolute -bottom-28 -right-24 size-72 rounded-full bg-[#1f8f83]/10 blur-3xl" />
        </div>

        <div className={`sidebar-brand relative flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/app/dashboard" aria-label={discreetMode ? "Focus, início" : "Sentinel, início"} className="group flex items-center gap-3 font-bold">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[var(--sidebar-line)] bg-[var(--sidebar-icon-bg)] text-[var(--teal-deep)] shadow-[0_10px_28px_rgba(65,199,174,.12)] transition group-hover:-translate-y-0.5 group-hover:border-[#71dbc6]/45">
              <ShieldCheck size={21} />
            </span>
            {!collapsed && <span className="sidebar-label text-[1.05rem]">{discreetMode ? "Focus" : "Sentinel"}</span>}
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="absolute -right-4 top-24 z-20 grid size-9 place-items-center rounded-full border border-black/10 bg-white text-[var(--ink)] shadow-lg transition duration-300 hover:scale-105 hover:bg-[#dffff7]"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <nav className={`sidebar-main-nav relative mt-12 grid gap-2 ${collapsed ? "justify-items-center" : ""}`} aria-label="Principal">
          {nav.map(({ href, label, icon: Icon, sos }) => {
            const active = isPrimaryActive(href);
            return (
              <Link
                key={href}
                href={href as Route}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
                className={`group relative flex min-h-12 items-center overflow-hidden rounded-2xl text-sm font-semibold transition-all duration-300 ${collapsed ? "w-12 justify-center px-0" : "w-full gap-3 px-4"} ${
                  active
                    ? sos
                      ? "bg-gradient-to-r from-[#71dbc6] to-[#43c9b4] text-[var(--ink)] shadow-[0_12px_30px_rgba(65,199,174,.22)]"
                      : "bg-[var(--sidebar-active)] text-[var(--sidebar-text)] shadow-[inset_0_0_0_1px_var(--sidebar-line)]"
                    : sos
                      ? "bg-[#71dbc6]/90 text-[var(--ink)] hover:bg-[#7ee5d0]"
                      : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
                }`}
              >
                {active && !sos && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#71dbc6] shadow-[0_0_12px_#71dbc6]" />}
                <Icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "scale-105" : ""}`} />
                {!collapsed && <span className="sidebar-label">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <nav className={`sidebar-tools-nav relative mt-7 grid gap-2 border-t border-[var(--sidebar-line)] pt-6 ${collapsed ? "justify-items-center" : ""}`} aria-label="Ferramentas">
          {!collapsed && <span className="sidebar-label mb-2 px-4 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--sidebar-faint)]">Ferramentas</span>}
          {tools.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href as Route}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
                className={`group flex min-h-11 items-center rounded-xl text-sm transition-all duration-300 ${collapsed ? "w-11 justify-center" : "gap-3 px-4"} ${active ? "bg-[var(--sidebar-active)] text-[var(--sidebar-accent)]" : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"}`}
              >
                <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="sidebar-label">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <form action={logout} className={`sidebar-logout relative mt-auto shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            aria-label={collapsed ? "Sair" : undefined}
            title={collapsed ? "Sair" : undefined}
            className={`group flex min-h-11 items-center rounded-2xl text-sm text-[var(--sidebar-muted)] transition hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] ${collapsed ? "w-11 justify-center" : "w-full gap-3 px-4"}`}
          >
            <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {!collapsed && <span className="sidebar-label">Sair</span>}
          </button>
        </form>
      </aside>

      <button
        type="button"
        onClick={toggleTheme}
        disabled={isSavingTheme}
        className="theme-toggle floating-theme-toggle fixed right-4 z-50 grid size-11 place-items-center rounded-full lg:right-6 lg:size-12"
        aria-label={activeTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
        title={activeTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      >
        <ThemeIcon theme={activeTheme} />
      </button>

      <main className={`relative z-10 min-w-0 pb-[calc(6.5rem+env(safe-area-inset-bottom))] transition-[padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:pb-0 ${collapsed ? "lg:pl-[92px]" : "lg:pl-[280px]"}`}>
        <div key={pathname} className="route-enter min-h-screen">{children}</div>
      </main>

      {mobileToolsOpen && (
        <div className="mobile-tools-layer lg:hidden">
          <button type="button" className="mobile-tools-backdrop" aria-label="Fechar menu de ferramentas" onClick={() => setMobileToolsOpen(false)} />
          <section ref={mobileToolsDialogRef} className="mobile-tools-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-tools-title">
            <header className="mobile-tools-header">
              <div>
                <p className="eyebrow">Navegação</p>
                <h2 id="mobile-tools-title">Mais opções</h2>
              </div>
              <button type="button" className="mobile-tools-close" aria-label="Fechar menu" autoFocus onClick={() => setMobileToolsOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <div className="mobile-tools-grid">
              {moreNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href as Route}
                    aria-current={active ? "page" : undefined}
                    className="mobile-tool-link"
                    data-active={active}
                    onClick={() => setMobileToolsOpen(false)}
                  >
                    <span><Icon size={21} /></span>
                    <strong>{label}</strong>
                  </Link>
                );
              })}
            </div>
            <p className="mobile-tools-note">Use Registros para anotar um momento ou iniciar um recomeço.</p>
          </section>
        </div>
      )}

      <nav className="mobile-nav fixed inset-x-3 bottom-[calc(.55rem+env(safe-area-inset-bottom))] z-40 grid h-[64px] grid-cols-5 overflow-hidden rounded-[1.4rem] border border-[#cfe2dc] bg-[#f9fcfa]/92 p-1.5 shadow-[0_14px_42px_rgba(7,25,28,.18),inset_0_1px_0_rgba(255,255,255,.95)] ring-1 ring-white/60 backdrop-blur-2xl lg:hidden" aria-label="Principal">
        {mobileNav.map(({ href, label, icon: Icon, sos }) => {
          const active = isPrimaryActive(href);
          return (
            <Link
              key={href}
              href={href as Route}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              title={label}
              className={`mobile-nav-item group relative grid min-h-0 place-items-center overflow-hidden rounded-[1.1rem] transition-colors duration-300 ${active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
            >
              {active && <span className={`nav-orb absolute inset-1 rounded-[.95rem] ${sos ? "bg-gradient-to-br from-[#72dfca] via-[#55cfb9] to-[#37b8a3]" : "bg-gradient-to-br from-[#dff8f1] via-[#c9efe6] to-[#afe5d9]"} shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_6px_18px_rgba(65,199,174,.2)]`} />}
              {!active && sos && <span className="absolute size-10 rounded-[.9rem] bg-gradient-to-br from-[#d9f5ee] to-[#bce9df] transition duration-300 group-hover:scale-105" />}
              <Icon size={active ? 24 : 22} strokeWidth={active ? 2.35 : 2} className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${active ? "-translate-y-0.5 scale-110 drop-shadow-[0_2px_5px_rgba(7,25,28,.12)]" : "group-hover:-translate-y-0.5 group-hover:text-[var(--teal-deep)]"}`} />
              {active && <span className="nav-dot absolute bottom-1.5 z-10 h-[3px] w-4 rounded-full bg-gradient-to-r from-[#137c6d] to-[#41c7ae]" />}
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Mais ferramentas"
          aria-expanded={mobileToolsOpen}
          className={`mobile-nav-item group relative grid min-h-0 place-items-center overflow-hidden rounded-[1.1rem] transition-colors duration-300 ${moreActive || mobileToolsOpen ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
          onClick={() => setMobileToolsOpen((current) => !current)}
        >
          {(moreActive || mobileToolsOpen) && <span className="nav-orb absolute inset-1 rounded-[.95rem] bg-gradient-to-br from-[#dff8f1] via-[#c9efe6] to-[#afe5d9] shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_6px_18px_rgba(65,199,174,.2)]" />}
          <LayoutGrid size={moreActive || mobileToolsOpen ? 24 : 22} strokeWidth={moreActive || mobileToolsOpen ? 2.35 : 2} className={`relative z-10 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${moreActive || mobileToolsOpen ? "-translate-y-0.5 scale-110" : "group-hover:-translate-y-0.5 group-hover:text-[var(--teal-deep)]"}`} />
          {(moreActive || mobileToolsOpen) && <span className="nav-dot absolute bottom-1.5 z-10 h-[3px] w-4 rounded-full bg-gradient-to-r from-[#137c6d] to-[#41c7ae]" />}
        </button>
      </nav>
      <Suspense fallback={null}><ToastViewport /></Suspense>
      <Suspense fallback={null}><LevelUpViewport /></Suspense>
    </div>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return <span key={theme} className="theme-icon-enter grid place-items-center" aria-hidden>{theme === "light" ? <MoonStar size={19} /> : <Sun size={19} />}</span>;
}
