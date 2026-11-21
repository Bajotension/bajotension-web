import { NextResponse, type NextRequest } from "next/server";
import { tieneLaGuia } from "@/lib/acceso";
import { PRODUCTO } from "@/lib/config";
import { dispositivoValido } from "@/lib/dispositivos";
import { crearPreferencia } from "@/lib/mercadopago";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

async function comprar(req: NextRequest) {
  const base = req.nextUrl.origin;
  const u = await usuarioActual();
  if (!u) return NextResponse.redirect(`${base}/login?next=/comprar`, 303);
  if (!(await dispositivoValido(u.id))) return NextResponse.redirect(`${base}/auth/salir?motivo=sesion-cerrada`, 303);
  if (await tieneLaGuia(u.id)) return NextResponse.redirect(`${base}/biblioteca`, 303);

  const db = supabaseAdmin();
  const { data: orden, error } = await db
    .from("ordenes")
    .insert({ user_id: u.id, producto: PRODUCTO.id, monto: PRODUCTO.precioARS })
    .select("id, monto")
    .single();
  if (error || !orden) return NextResponse.redirect(`${base}/compra?error=1`, 303);

  try {
    const pref = await crearPreferencia({ id: orden.id, monto: Number(orden.monto), email: u.email });
    await db.from("ordenes").update({ preferencia_id: pref.id }).eq("id", orden.id);
    return NextResponse.redirect(pref.init_point, 303);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`${base}/compra?error=1`, 303);
  }
}

export const GET = comprar;
export const POST = comprar;
