import { NextResponse, type NextRequest } from "next/server";
import { tieneLaGuia } from "@/lib/acceso";
import { BUCKET_PAGINAS, LIMITES, PRODUCTO } from "@/lib/config";
import { dispositivoValido } from "@/lib/dispositivos";
import { aplicarMarcaDeAgua } from "@/lib/marca-de-agua";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_CACHE = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex" };
const err = (status: number, msg: string) => NextResponse.json({ error: msg }, { status, headers: NO_CACHE });

export async function GET(req: NextRequest, ctx: { params: Promise<{ n: string }> }) {
  // Solo pedidos desde el propio sitio (no hotlinking)
  const sitio = req.headers.get("sec-fetch-site");
  if (sitio && sitio !== "same-origin") return err(403, "origen");

  const { n } = await ctx.params;
  const pagina = Number(n);
  if (!Number.isInteger(pagina) || pagina < 1 || pagina > PRODUCTO.paginas) return err(404, "pagina");

  const u = await usuarioActual();
  if (!u) return err(401, "sesion");
  if (!(await dispositivoValido(u.id))) return err(401, "dispositivo");
  if (!(await tieneLaGuia(u.id))) return err(403, "compra");

  const db = supabaseAdmin();
  const haceUnaHora = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await db
    .from("lecturas")
    .select("id", { count: "exact", head: true })
    .eq("user_id", u.id)
    .gte("momento", haceUnaHora);
  if ((count ?? 0) >= LIMITES.paginasPorHora) return err(429, "limite");
  await db.from("lecturas").insert({ user_id: u.id, pagina });

  const archivo = `pagina-${String(pagina).padStart(3, "0")}.webp`;
  const { data, error } = await db.storage.from(BUCKET_PAGINAS).download(archivo);
  if (error || !data) return err(404, "archivo");

  const original = Buffer.from(await data.arrayBuffer());
  const marcada = await aplicarMarcaDeAgua(original, { nombre: u.nombre, email: u.email });
  return new NextResponse(new Uint8Array(marcada), {
    headers: { ...NO_CACHE, "Content-Type": "image/webp", "Content-Disposition": "inline" },
  });
}
