import { ComparadorLibros, Encabezado, Libro, Pie, SelloAdquirido, librosDelVisitante } from "@/componentes";
import Link from "next/link";
import { LIBROS } from "@/lib/catalogo";

export const metadata = {
  title: "Los libros · Bajo Tensión",
  description: "Compará los libros de Bajo Tensión y mirá el índice de cada uno.",
};

export const dynamic = "force-dynamic";

export default async function Libros() {
  const tiene = await librosDelVisitante();
  return (
    <>
      <Encabezado />
      <main>
        <section className="seccion">
          <div className="contenedor-ancho">
            <p className="ceja">La colección</p>
            <h2>Dos libros, <em>dos caminos.</em></h2>
            <p className="bajada-seccion">
              Uno para entender y cuidar tu casa. Otro para aprender electricidad a fondo. Compará y mirá el índice de
              cada uno.
            </p>
            <div className="coleccion">
              {LIBROS.map((l) => (
                <Link key={l.id} href={`/libros/${l.slug}`} className="coleccion-item tapa">
                  <Libro libro={l} chico adquirido={tiene.has(l.id)} />
                  <span className="coleccion-titulo">{l.titulo}</span>
                  {tiene.has(l.id) ? (
                    <SelloAdquirido />
                  ) : l.disponible ? (
                    <span className="boton chico">Comprar</span>
                  ) : (
                    <span className="tenue">Próximamente · Ver índice</span>
                  )}
                </Link>
              ))}
            </div>
            <ComparadorLibros />
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
