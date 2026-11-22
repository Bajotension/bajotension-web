import Link from "next/link";
import { BotonCompra, Encabezado, Libro, Pie } from "@/componentes";
import { librosDelUsuario } from "@/lib/acceso";
import { LIBROS, PACK, libroPorId, precioPara, productoDeLibro } from "@/lib/catalogo";
import { formatoARS } from "@/lib/config";
import { exigirUsuario } from "@/lib/guardia";

export const dynamic = "force-dynamic";

export default async function Biblioteca() {
  const u = await exigirUsuario("/biblioteca");
  const tiene = await librosDelUsuario(u.id);
  const precioPack = precioPara(PACK, tiene);
  return (
    <>
      <Encabezado />
      <main className="contenedor">
        <h1 className="titulo-pagina">Mi biblioteca</h1>
        <p className="tenue">{u.email}</p>
        {LIBROS.map((libro) => {
          const producto = productoDeLibro(libro.id);
          const precio = precioPara(producto, tiene);
          const conDescuento = precio != null && precio < producto.precioARS;
          return (
            <div className="libro" key={libro.id}>
              <div className="tapa">
                <Libro libro={libro} chico />
              </div>
              <div className="libro-info">
                <h2>{libro.titulo}</h2>
                {tiene.has(libro.id) ? (
                  <>
                    <p className="tenue">
                      {libro.paginas > 0 ? `${libro.paginas} páginas · ` : ""}Licencia personal
                    </p>
                    <Link href={`/leer/${libro.slug}`} className="boton">Leer</Link>
                  </>
                ) : !libro.disponible ? (
                  <>
                    <p className="tenue">Próximamente.</p>
                    <Link href={`/libros/${libro.slug}`} className="enlace">Ver índice</Link>
                  </>
                ) : (
                  <>
                    <p className="tenue">
                      {conDescuento && producto.descuento
                        ? `Precio especial porque ya tenés "${libroPorId(producto.descuento.siTiene).titulo}".`
                        : "Todavía no lo compraste."}
                    </p>
                    {precio != null && (
                      <BotonCompra producto={producto.id}>
                        Comprar por {formatoARS(precio)}
                        {conDescuento && <s className="precio-viejo">{formatoARS(producto.precioARS)}</s>}
                      </BotonCompra>
                    )}
                    <Link href={`/libros/${libro.slug}`} className="enlace">Ver índice</Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {precioPack != null && (
          <div className="libro pack">
            <div className="libro-info">
              <p className="ceja">Combo</p>
              <h2>{PACK.titulo}</h2>
              <p className="tenue">
                {PACK.libros.map((l) => libroPorId(l).titulo).join(" + ")}. Ahorrás{" "}
                {formatoARS(PACK.precioRegularARS - precioPack)}.
              </p>
              <BotonCompra producto={PACK.id}>
                Comprar el pack por {formatoARS(precioPack)}
                <s className="precio-viejo">{formatoARS(PACK.precioRegularARS)}</s>
              </BotonCompra>
            </div>
          </div>
        )}
      </main>
      <Pie />
    </>
  );
}
