import Link from "next/link";
import { Encabezado, Libro, Pie } from "@/componentes";
import { tieneLaGuia } from "@/lib/acceso";
import { PRODUCTO, formatoARS } from "@/lib/config";
import { exigirUsuario } from "@/lib/guardia";

export const dynamic = "force-dynamic";

export default async function Biblioteca() {
  const u = await exigirUsuario("/biblioteca");
  const tiene = await tieneLaGuia(u.id);
  return (
    <>
      <Encabezado />
      <main className="contenedor">
        <h1 className="titulo-pagina">Mi biblioteca</h1>
        <p className="tenue">{u.email}</p>
        <div className="libro">
          <div className="tapa">
            <Libro chico />
          </div>
          <div className="libro-info">
            <h2>{PRODUCTO.titulo}</h2>
            {tiene ? (
              <>
                <p className="tenue">{PRODUCTO.paginas} páginas · Licencia personal</p>
                <Link href="/leer" className="boton">Leer</Link>
              </>
            ) : (
              <>
                <p className="tenue">Todavía no la compraste.</p>
                <form action="/comprar" method="post">
                  <button className="boton" type="submit">Comprar por {formatoARS(PRODUCTO.precioARS)}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Pie />
    </>
  );
}
