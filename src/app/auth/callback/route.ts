import { NextResponse, type NextRequest } from "next/server";
import { registrarDispositivo } from "@/lib/dispositivos";
import { rutaInterna } from "@/lib/rutas";
import { supabaseUsuario } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const next = rutaInterna(url.searchParams.get("next"));
  const base = url.origin;
  if (!code) return NextResponse.redirect(`${base}/login?error=google`);

  const sb = await supabaseUsuario();
  const { data, error } = await sb.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(`${base}/login?error=google`);

  const r = await registrarDispositivo(data.user.id, req.headers.get("user-agent") ?? "");
  if (!r.ok) {
    await sb.auth.signOut();
    return NextResponse.redirect(`${base}/login?error=dispositivos`);
  }
  return NextResponse.redirect(`${base}${next}`);
}
