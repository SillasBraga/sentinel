import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  title: { default: "Sentinel — Recupere o controle", template: "%s · Sentinel" },
  description: "Entenda seus gatilhos, atravesse momentos difíceis e acompanhe sua evolução em um espaço privado.",
  applicationName: "Sentinel",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }]
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#08111f", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${sora.variable} ${spaceGrotesk.variable}`}><body>{children}<ServiceWorkerRegistration /></body></html>;
}
