"use client";

import { BookHeart, CalendarDays, ChartNoAxesCombined, ChevronLeft, ChevronRight, CirclePlus, CircleUserRound, Dumbbell, HeartHandshake, House, LifeBuoy, LogOut, MoonStar, RotateCcw, Shield, ShieldCheck, Sun, Target } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { logout } from "@/features/auth/actions";
import { updateTheme } from "@/features/settings/actions";
import { LevelUpViewport } from "@/components/level-up-viewport";
import { ToastViewport } from "@/components/toast-viewport";

const navigation = [
  { href: "/app/dashboard", label: "Base", icon: House, emphasis: false, sos: false },
  { href: "/app/progress", label: "Jornada", icon: ChartNoAxesCombined, emphasis: false, sos: false },
  { href: "/app/records", label: "Registrar", icon: CirclePlus, emphasis: true, sos: false },
  { href: "/app/sos", label: "SOS", icon: LifeBuoy, emphasis: false, sos: true },
  { href: "/app/settings", label: "Perfil", icon: CircleUserRound, emphasis: false, sos: false },
] as const;

const equipment = [
  { href: "/app/habits", label: "Rituais", icon: Dumbbell },
  { href: "/app/goals", label: "Objetivos", icon: Target },
  { href: "/app/calendar", label: "Mapa", icon: CalendarDays },
  { href: "/app/plan", label: "Plano", icon: ShieldCheck },
  { href: "/app/protection", label: "Defesas", icon: Shield },
  { href: "/app/relapse/restart-plan", label: "Retomada", icon: RotateCcw },
  { href: "/app/accountability", label: "Aliado", icon: HeartHandshake },
  { href: "/app/journal", label: "Diário", icon: BookHeart },
] as const;

type Props = {
  children: React.ReactNode;
  discreetMode?: boolean;
  theme?: "light" | "dark";
  cosmeticStyle?: "base" | "aurora" | "constellation";
  currentMission?: string | null;
  missionCompleted?: boolean;
};

export function AppShell({ children, discreetMode = false, theme = "light", cosmeticStyle = "base", currentMission, missionCompleted = false }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTheme, setActiveTheme] = useState(theme);
  const [activeCosmeticStyle, setActiveCosmeticStyle] = useState(cosmeticStyle);
  const [isSavingTheme, startThemeTransition] = useTransition();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isNavigationActive = (href: string) => href === "/app/records" ? ["/app/records", "/app/checkin", "/app/triggers", "/app/relapse"].some(isActive) : isActive(href);

  useEffect(() => {
    const updateCosmetic = (event: Event) => {
      const style = (event as CustomEvent<"base" | "aurora" | "constellation">).detail;
      if (style === "base" || style === "aurora" || style === "constellation") setActiveCosmeticStyle(style);
    };
    window.addEventListener("sentinel-cosmetic", updateCosmetic);
    return () => window.removeEventListener("sentinel-cosmetic", updateCosmetic);
  }, []);

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

  return <div className="app-surface min-h-screen" data-theme={activeTheme} data-cosmetic={activeCosmeticStyle}>
    <aside className={`desktop-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--sidebar-line)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-[24px_0_70px_rgba(2,18,20,.10)] transition-[width,padding,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:flex ${collapsed ? "w-[92px] px-4 py-5" : "w-[280px] p-5"}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"><span className="absolute -left-24 -top-20 size-64 rounded-full bg-[#34d6ba]/10 blur-3xl" /></div>
      <div className={`sidebar-brand relative flex items-center ${collapsed ? "flex-col gap-3" : "justify-between"}`}><Link href="/app/dashboard" aria-label={discreetMode ? "Focus, Base" : "Sentinel, Base"} className="group flex items-center gap-3 font-bold"><span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[var(--sidebar-line)] bg-[var(--sidebar-icon-bg)] text-[var(--teal-deep)] shadow-[0_10px_28px_rgba(65,199,174,.12)]"><ShieldCheck size={21} /></span>{!collapsed && <span className="sidebar-label text-[1.05rem]">{discreetMode ? "Focus" : "Sentinel"}</span>}</Link><button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"} title={collapsed ? "Expandir menu" : "Recolher menu"} className="sidebar-collapse grid size-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-[var(--ink)] shadow-lg">{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button></div>

      <section className={`sidebar-mission relative mt-5 rounded-2xl border border-[var(--sidebar-line)] bg-[var(--sidebar-active)] ${collapsed ? "grid size-12 place-items-center" : "p-4"}`} aria-label="Missão atual">{collapsed ? <Target size={19} aria-hidden /> : <><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--sidebar-faint)]">Missão atual</p><p className="mt-2 line-clamp-2 text-sm font-bold leading-5">{currentMission ?? "Defina um foco leve para hoje."}</p><span className="mt-2 block text-xs text-[var(--sidebar-muted)]">{missionCompleted ? "Concluída hoje" : "Um passo por vez"}</span></>}</section>

      <nav className={`sidebar-main-nav relative mt-6 grid gap-1 ${collapsed ? "justify-items-center" : ""}`} aria-label="Navegação">{!collapsed && <p className="px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--sidebar-faint)]">Navegação</p>}{navigation.map(({ href, label, icon: Icon, emphasis, sos }) => { const active = isNavigationActive(href); return <Link key={href} href={href as Route} aria-current={active ? "page" : undefined} aria-label={collapsed ? label : undefined} title={collapsed ? label : undefined} className={`sidebar-nav-link group flex min-h-11 items-center rounded-xl text-sm font-bold ${collapsed ? "w-11 justify-center" : "gap-3 px-3"} ${emphasis ? "sidebar-record-link" : sos ? "sidebar-sos-link" : active ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text)]" : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"}`} data-active={active}><Icon size={emphasis || sos ? 20 : 18} className="shrink-0 transition-transform group-hover:scale-110" />{!collapsed && <span className="sidebar-label">{label}</span>}</Link>; })}</nav>

      <nav className={`sidebar-tools-nav relative mt-5 grid gap-1 border-t border-[var(--sidebar-line)] pt-4 ${collapsed ? "justify-items-center" : ""}`} aria-label="Equipamento">{!collapsed && <p className="px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--sidebar-faint)]">Equipamento</p>}{equipment.map(({ href, label, icon: Icon }) => { const active = isActive(href); return <Link key={href} href={href as Route} aria-current={active ? "page" : undefined} aria-label={collapsed ? label : undefined} title={collapsed ? label : undefined} className={`sidebar-tool-link group flex min-h-10 items-center rounded-xl text-sm ${collapsed ? "w-10 justify-center" : "gap-3 px-3"} ${active ? "bg-[var(--sidebar-active)] text-[var(--sidebar-accent)]" : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"}`}><Icon size={17} className="shrink-0 transition-transform group-hover:scale-110" />{!collapsed && <span className="sidebar-label">{label}</span>}</Link>; })}</nav>

      <form action={logout} className={`sidebar-logout relative mt-auto shrink-0 pt-4 ${collapsed ? "flex justify-center" : ""}`}><button aria-label={collapsed ? "Sair" : undefined} title={collapsed ? "Sair" : undefined} className={`group flex min-h-10 items-center rounded-xl text-sm text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] ${collapsed ? "w-10 justify-center" : "w-full gap-3 px-3"}`}><LogOut size={17} />{!collapsed && <span className="sidebar-label">Sair</span>}</button></form>
    </aside>

    <button type="button" onClick={toggleTheme} disabled={isSavingTheme} className="theme-toggle floating-theme-toggle fixed right-4 z-50 grid size-11 place-items-center rounded-full lg:right-6 lg:size-12" aria-label={activeTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro"} title={activeTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}>{activeTheme === "light" ? <MoonStar size={19} /> : <Sun size={19} />}</button>
    <main className={`journey-main relative z-10 min-w-0 pb-[calc(7.5rem+env(safe-area-inset-bottom))] transition-[padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:pb-0 ${collapsed ? "lg:pl-[92px]" : "lg:pl-[280px]"}`}><div key={pathname} className="route-enter min-h-screen">{children}</div></main>
    <nav className="mobile-nav fixed inset-x-3 bottom-[calc(.55rem+env(safe-area-inset-bottom))] z-40 grid h-[68px] grid-cols-5 rounded-[1.4rem] border border-[#cfe2dc] bg-[#f9fcfa]/95 p-1.5 shadow-[0_14px_42px_rgba(7,25,28,.18),inset_0_1px_0_rgba(255,255,255,.95)] ring-1 ring-white/60 backdrop-blur-2xl lg:hidden" aria-label="Navegação principal">{navigation.map(({ href, label, icon: Icon, emphasis, sos }) => { const active = isNavigationActive(href); return <Link key={href} href={href as Route} aria-current={active ? "page" : undefined} aria-label={label} className={`mobile-nav-item group relative grid min-h-0 place-items-center overflow-hidden rounded-[1.1rem] ${emphasis ? "mobile-record-link" : sos ? "mobile-sos-link" : active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`} data-active={active}>{active && !emphasis && !sos && <span className="nav-orb absolute inset-1 rounded-[.95rem] bg-gradient-to-br from-[#dff8f1] via-[#c9efe6] to-[#afe5d9]" />}<Icon size={emphasis || sos ? 24 : active ? 23 : 21} strokeWidth={emphasis || sos ? 2.4 : 2} className="relative z-10 transition-transform group-hover:-translate-y-0.5" /><span className="sr-only">{label}</span></Link>; })}</nav>
    <Suspense fallback={null}><ToastViewport /></Suspense><Suspense fallback={null}><LevelUpViewport /></Suspense>
  </div>;
}
