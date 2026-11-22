import Link from "next/link";
import { redirect } from "next/navigation";
import { Encabezado, Libro, Pie } from "@/componentes";
import { librosDelUsuario } from "@/lib/acceso";
import { PRODUCTO_POR_DEFECTO, libroPorId, precioPara, productoPorId } from "@/lib/catalogo";
import { formatoARS } from "@/lib/config";
import { exigirUsuario } from "@/lib/guardia";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirmar compra · Bajo Tensión", robots: { index: false } };

/** Paso previo al pago: resumen y aceptación de los términos (que incluyen el arrepentimiento solo sin lectura). */
export default async function Confirmar({ searchParams }: { searchParams: Promise<{ producto?: string; falta?: string }> }) {
  const { producto: id, falta } = await searchParams;
  const producto = id ? productoPorId(id) : PRODUCTO_POR_DEFECTO;
  if (!producto) redirect("/libros");
  const u = await exigirUsuario(`/confirmar?producto=${encodeURIComponent(producto.id)}`);
  const precio = precioPara(producto, await librosDelUsuario(u.id));
  if (precio == null) redirect("/biblioteca");
  const libros = producto.libros.map(libroPorId);

  return (
    <>
      <Encabezado />
      <main className="centro">
        <div className="tarjeta confirmar">
          <div className="confirmar-tapas">
            {libros.map((l) => (
              <div className="tapa" key={l.id}>
                <Libro libro={l} chico />
              </div>
            ))}
          </div>
          <h1>{producto.titulo}</h1>
          <p className="confirmar-precio">{formatoARS(precio)}</p>
          <p className="tenue">Pago único con Mercado Pago. Lectura online en hasta 2 dispositivos.</p>
          <form action="/comprar" method="post" className="confirmar-form">
            <input type="hidden" name="producto" value={producto.id} />
            <label className="casilla">
              <input type="checkbox" name="acepto" value="si" required />
              <span>
                Acepto los <Link href="/terminos" target="_blank">términos y condiciones</Link>
              </span>
            </label>
            {falta && <p className="aviso">Para seguir tenés que marcar la casilla.</p>}
            <button className="boton grande ancho" type="submit">
              Pagar con Mercado Pago <span aria-hidden className="flecha">→</span>
            </button>
          </form>
        </div>
      </main>
      <Pie />
    </>
  );
}
