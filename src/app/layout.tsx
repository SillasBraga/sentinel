import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  title: { default: "Sentinel — Recupere o controle", template: "%s · Sentinel" },
  description: "Entenda seus gatilhos, atravesse momentos difíceis e acompanhe sua evolução em um espaço privado.",
  applicationName: "Sentinel",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }]
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#07191c", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={nunito.variable}><body>{children}<ServiceWorkerRegistration /></body></html>;
}
