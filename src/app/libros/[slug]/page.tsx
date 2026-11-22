import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonCompra, Encabezado, Indice, Libro, Pie, SelloAdquirido, librosDelVisitante } from "@/componentes";
import { LIBROS, libroPorId, libroPorSlug, precioPara, productoDeLibro } from "@/lib/catalogo";
import { formatoARS } from "@/lib/config";

// Dinámica como la portada: el encabezado muestra la sesión y los precios salen de las variables.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const libro = libroPorSlug((await params).slug);
  return libro ? { title: `${libro.titulo} · Índice · Bajo Tensión`, description: libro.para } : {};
}

export default async function IndiceLibro({ params }: { params: Promise<{ slug: string }> }) {
  const libro = libroPorSlug((await params).slug);
  if (!libro) notFound();
  const producto = productoDeLibro(libro.id);
  const otros = LIBROS.filter((l) => l.id !== libro.id);
  const tiene = await librosDelVisitante();
  const esMio = tiene.has(libro.id);
  const precio = precioPara(producto, tiene) ?? producto.precioARS;
  return (
    <>
      <Encabezado />
      <main>
        <section className="seccion">
          <div className="contenedor-ancho ficha">
            <div className="ficha-libro tapa">
              <Libro libro={libro} adquirido={esMio} />
            </div>
            <div className="ficha-info">
              <p className="ceja">Libro {libro.id.toUpperCase()}{libro.disponible ? "" : " · Próximamente"}</p>
              <h1 className="titulo-pagina">{libro.titulo}</h1>
              <p className="bajada-seccion">{libro.para}</p>
              <dl className="ficha-datos">
                <div><dt>Nivel</dt><dd>{libro.nivel}</dd></div>
                <div><dt>Cómo aprendés</dt><dd>{libro.metodo}</dd></div>
                <div><dt>Qué vas a hacer</dt><dd>{libro.practica}</dd></div>
              </dl>
              {esMio ? (
                <div className="ficha-compra">
                  <SelloAdquirido />
                  <Link href={`/leer/${libro.slug}`} className="boton grande">Leer</Link>
                </div>
              ) : libro.disponible ? (
                <div className="ficha-compra">
                  <BotonCompra producto={producto.id} className="boton grande">
                    Comprar por {formatoARS(precio)}
                  </BotonCompra>
                  {producto.descuento && precio === producto.precioARS && (
                    <p className="tenue">
                      Si ya tenés &quot;{libroPorId(producto.descuento.siTiene).titulo}&quot;, lo pagás{" "}
                      {formatoARS(producto.descuento.precioARS)}.
                    </p>
                  )}
                </div>
              ) : (
                <p className="pildora"><span className="punto" /> Sale después. Mirá el índice.</p>
              )}
            </div>
          </div>
        </section>
        <section className="seccion fondo-blanco">
          <div className="contenedor-ancho">
            <p className="ceja">Índice</p>
            <h2>{libro.capitulos.length} capítulos.</h2>
            <Indice libro={libro} />
            <p className="ficha-otros">
              {otros.map((o) => (
                <Link key={o.id} href={`/libros/${o.slug}`} className="enlace">Ver el índice de &quot;{o.titulo}&quot; →</Link>
              ))}
              <Link href="/libros" className="enlace">Comparar los libros →</Link>
            </p>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
