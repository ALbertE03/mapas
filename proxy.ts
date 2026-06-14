import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// CAMBIO: Se renombró la función de 'middleware' a 'proxy'
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // 3. Tu matcher actual para interceptar las rutas de la app
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
