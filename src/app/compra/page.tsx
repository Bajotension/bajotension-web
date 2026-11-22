import Link from "next/link";
import { Encabezado, Pie } from "@/componentes";
import { librosDelUsuario } from "@/lib/acceso";
import { libroPorId, productoPorId } from "@/lib/catalogo";
import { procesarPago } from "@/lib/mercadopago";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EstadoCompra({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; external_reference?: string; error?: string }>;
}) {
  const { payment_id, external_reference, error } = await searchParams;
  const u = await usuarioActual();

  // Verificamos el pago directamente con Mercado Pago (no confiamos en la URL).
  if (payment_id && payment_id !== "null") {
    try {
      await procesarPago(payment_id);
    } catch (e) {
      console.error(e);
    }
  }

  // Qué compró: la orden que vuelve de Mercado Pago (solo si es de este usuario).
  let producto = undefined as ReturnType<typeof productoPorId>;
  if (u && external_reference && UUID.test(external_reference)) {
    const { data } = await supabaseAdmin()
      .from("ordenes")
      .select("producto")
      .eq("id", external_reference)
      .eq("user_id", u.id)
      .maybeSingle();
    producto = productoPorId(data?.producto);
  }
  const tiene = u ? await librosDelUsuario(u.id) : new Set();
  const listo = producto ? producto.libros.every((l) => tiene.has(l)) : !external_reference && tiene.size > 0;

  let titulo = "Estamos confirmando tu pago";
  let texto = "Puede tardar unos minutos. Cuando se acredite, el libro aparece en tu biblioteca.";
  let destino = "/biblioteca";
  if (listo) {
    titulo = producto?.tipo === "combo" ? "¡Listo! Ya tenés los dos libros" : "¡Listo! Ya tenés tu libro";
    texto = producto ? `Gracias por tu compra de "${producto.titulo}". Podés empezar a leer ahora.` : "Gracias por tu compra. Podés empezar a leer ahora.";
    destino = producto ? `/leer/${libroPorId(producto.libros[0]).slug}` : "/leer";
  } else if (error) {
    titulo = "No pudimos iniciar el pago";
    texto = "Probá de nuevo en unos minutos. No se te cobró nada.";
  }

  return (
    <>
      <Encabezado />
      <main className="centro">
        <div className="tarjeta">
          <h1>{titulo}</h1>
          <p className="tenue">{texto}</p>
          <Link className="boton" href={destino}>
            {listo ? "Empezar a leer" : "Ir a mi biblioteca"}
          </Link>
          {listo && producto?.tipo === "combo" && (
            <Link className="enlace" href="/biblioteca">Ver los dos en mi biblioteca</Link>
          )}
        </div>
      </main>
      <Pie />
    </>
  );
}
