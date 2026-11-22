import { NextResponse, type NextRequest } from "next/server";
import { librosDelUsuario } from "@/lib/acceso";
import { PRODUCTO_POR_DEFECTO, precioPara, productoPorId } from "@/lib/catalogo";
import { dispositivoValido } from "@/lib/dispositivos";
import { crearPreferencia } from "@/lib/mercadopago";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

/** Qué se compra: ?producto=<id> o el campo "producto" del formulario. Sin dato, el primer libro. */
async function productoPedido(req: NextRequest) {
  let id = req.nextUrl.searchParams.get("producto");
  if (!id && req.method === "POST") {
    try {
      const f = await req.formData();
      id = (f.get("producto") as string | null) ?? null;
    } catch {
      /* formulario sin campos */
    }
  }
  if (!id) return PRODUCTO_POR_DEFECTO;
  return productoPorId(id);
}

async function comprar(req: NextRequest) {
  const base = req.nextUrl.origin;
  const producto = await productoPedido(req);
  if (!producto) return NextResponse.redirect(`${base}/biblioteca`, 303);

  const u = await usuarioActual();
  if (!u) {
    const volver = `/comprar?producto=${encodeURIComponent(producto.id)}`;
    return NextResponse.redirect(`${base}/login?next=${encodeURIComponent(volver)}`, 303);
  }
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
