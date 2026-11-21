import Link from "next/link";
import { Encabezado, Pie } from "@/componentes";
import { tieneLaGuia } from "@/lib/acceso";
import { procesarPago } from "@/lib/mercadopago";
import { usuarioActual } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EstadoCompra({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; error?: string }>;
}) {
  const { payment_id, error } = await searchParams;
  const u = await usuarioActual();

  // Verificamos el pago directamente con Mercado Pago (no confiamos en la URL).
  if (payment_id && payment_id !== "null") {
    try {
      await procesarPago(payment_id);
    } catch (e) {
      console.error(e);
    }
  }
  const listo = u ? await tieneLaGuia(u.id) : false;

  let titulo = "Estamos confirmando tu pago";
  let texto = "Puede tardar unos minutos. Cuando se acredite, la guía aparece en tu biblioteca.";
  if (listo) {
    titulo = "¡Listo! Ya tenés la guía";
    texto = "Gracias por tu compra. Podés empezar a leer ahora.";
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
          <Link className="boton" href={listo ? "/leer" : "/biblioteca"}>
            {listo ? "Empezar a leer" : "Ir a mi biblioteca"}
          </Link>
        </div>
      </main>
      <Pie />
    </>
  );
}
