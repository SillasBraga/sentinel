import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
  const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  response.headers.set("Content-Security-Policy", [
    "default-src 'self'", `script-src 'self' 'unsafe-inline'${devEval}`,
    "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
    `connect-src 'self' ${supabaseOrigin}`.trim(), "font-src 'self' data:",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"
  ].join("; "));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.svg|manifest.webmanifest|sw.js).*)"] };
