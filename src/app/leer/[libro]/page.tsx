import { notFound, redirect } from "next/navigation";
import { tieneLibro } from "@/lib/acceso";
import { libroPorSlug } from "@/lib/catalogo";
import { exigirUsuario } from "@/lib/guardia";
import { Lector } from "./lector";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leyendo · Bajo Tensión", robots: { index: false } };

export default async function LeerLibro({ params }: { params: Promise<{ libro: string }> }) {
  const { libro: slug } = await params;
  const libro = libroPorSlug(slug);
  if (!libro) notFound();
  const u = await exigirUsuario(`/leer/${libro.slug}`);
  if (!(await tieneLibro(u.id, libro.id))) redirect("/biblioteca");
  if (libro.paginas < 1) {
    return (
      <main className="centro">
        <div className="tarjeta">
          <h1>¡Ya tenés el libro!</h1>
          <p className="tenue">
            Estamos terminando de cargar las páginas de &quot;{libro.titulo}&quot;. Te avisamos por email apenas esté
            listo para leer.
          </p>
          <a className="boton" href="/biblioteca">Volver a mi biblioteca</a>
        </div>
      </main>
    );
  }
  return <Lector total={libro.paginas} titulo={libro.titulo} slug={libro.slug} clave={libro.claveLectura} />;
}
