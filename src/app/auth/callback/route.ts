import { NextResponse, type NextRequest } from "next/server";
import { registrarDispositivo } from "@/lib/dispositivos";
import { rutaInterna } from "@/lib/rutas";
import { supabaseUsuario } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const next = rutaInterna(url.searchParams.get("next"));
  const base = url.origin;
  const fallo = (motivo: string) => {
    console.error("Ingreso con Google falló:", motivo);
    const m = encodeURIComponent(motivo.slice(0, 160));
    return NextResponse.redirect(`${base}/login?error=google&motivo=${m}`);
  };
  if (!code) {
    return fallo(
      url.searchParams.get("error_description") ?? url.searchParams.get("error") ?? "sin código de Google",
    );
  }

  const sb = await supabaseUsuario();
  const { data, error } = await sb.auth.exchangeCodeForSession(code);
  if (error || !data.user) return fallo(error?.message ?? "sin usuario");

  let r;
  try {
    r = await registrarDispositivo(data.user.id, req.headers.get("user-agent") ?? "");
  } catch (e) {
    await sb.auth.signOut();
    const m = e && typeof e === "object" && "message" in e ? String(e.message) : String(e);
    return fallo(`base de datos: ${m}`);
  }
  if (!r.ok) {
    await sb.auth.signOut();
    return NextResponse.redirect(`${base}/login?error=dispositivos`);
  }
  return NextResponse.redirect(`${base}${next}`);
}
