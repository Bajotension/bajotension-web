import { NextResponse, type NextRequest } from "next/server";
import { cerrarDispositivoActual } from "@/lib/dispositivos";
import { supabaseUsuario, usuarioActual } from "@/lib/supabase/server";

async function salir(req: NextRequest) {
  const motivo = req.nextUrl.searchParams.get("motivo");
  const u = await usuarioActual();
  if (u) {
    if (motivo !== "sesion-cerrada") await cerrarDispositivoActual(u.id);
    await (await supabaseUsuario()).auth.signOut({ scope: "local" });
  }
  const destino = motivo === "sesion-cerrada" ? "/login?error=sesion-cerrada" : "/";
  return NextResponse.redirect(new URL(destino, req.nextUrl.origin), 303);
}

export const GET = salir;
export const POST = salir;
