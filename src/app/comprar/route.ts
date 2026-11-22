import { NextResponse, type NextRequest } from "next/server";
import { librosDelUsuario } from "@/lib/acceso";
import { PRODUCTO_POR_DEFECTO, precioPara, productoPorId } from "@/lib/catalogo";
import { dispositivoValido } from "@/lib/dispositivos";
import { crearPreferencia } from "@/lib/mercadopago";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

/**
 * Qué se compra: ?producto=<id> o el campo "producto" del formulario (sin dato, el primer libro),
 * y si marcó la casilla de "al abrir el libro pierdo el arrepentimiento" en /confirmar.
 */
async function pedido(req: NextRequest) {
  let id = req.nextUrl.searchParams.get("producto");
  let acepto = false;
  if (req.method === "POST") {
    try {
      const f = await req.formData();
      id = (f.get("producto") as string | null) ?? id;
      acepto = f.get("acepto") === "si";
    } catch {
      /* formulario sin campos */
    }
  }
  return { producto: id ? productoPorId(id) : PRODUCTO_POR_DEFECTO, acepto };
}

async function comprar(req: NextRequest) {
  const base = req.nextUrl.origin;
  const { producto, acepto } = await pedido(req);
  if (!producto) return NextResponse.redirect(`${base}/biblioteca`, 303);

  // Todos los botones "Comprar" pasan primero por /confirmar (resumen + casilla obligatoria).
  // Solo se crea la orden si la casilla viene marcada: toda orden implica esa aceptación.
  const confirmar = `/confirmar?producto=${encodeURIComponent(producto.id)}`;
  if (!acepto) {
    const falta = req.method === "POST" && req.headers.get("referer")?.includes("/confirmar") ? "&falta=1" : "";
    return NextResponse.redirect(`${base}${confirmar}${falta}`, 303);
  }

  const u = await usuarioActual();
  if (!u) return NextResponse.redirect(`${base}/login?next=${encodeURIComponent(confirmar)}`, 303);
  if (!(await dispositivoValido(u.id))) return NextResponse.redirect(`${base}/auth/salir?motivo=sesion-cerrada`, 303);

  // El precio se calcula acá, en el servidor (con descuento si ya tiene otro libro).
  const monto = precioPara(producto, await librosDelUsuario(u.id));
  if (monto == null) return NextResponse.redirect(`${base}/biblioteca`, 303);

  const db = supabaseAdmin();
  const { data: orden, error } = await db
    .from("ordenes")
    .insert({ user_id: u.id, producto: producto.id, monto })
    .select("id, monto")
    .single();
  if (error || !orden) return NextResponse.redirect(`${base}/compra?error=1`, 303);

  try {
    const pref = await crearPreferencia({
      id: orden.id,
      monto: Number(orden.monto),
      email: u.email,
      producto: { id: producto.id, titulo: producto.titulo },
    });
    await db.from("ordenes").update({ preferencia_id: pref.id }).eq("id", orden.id);
    return NextResponse.redirect(pref.init_point, 303);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`${base}/compra?error=1`, 303);
  }
}

export const GET = comprar;
export const POST = comprar;
