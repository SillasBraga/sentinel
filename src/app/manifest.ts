import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Sentinel", short_name: "Sentinel", description: "Um espaço privado para construir hábitos melhores.", start_url: "/app/dashboard", display: "standalone", background_color: "#f3f7f4", theme_color: "#07191c", orientation: "portrait", categories: ["health", "lifestyle"], icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }] };
}
