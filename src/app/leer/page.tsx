import { redirect } from "next/navigation";
import { tieneLaGuia } from "@/lib/acceso";
import { PRODUCTO } from "@/lib/config";
import { exigirUsuario } from "@/lib/guardia";
import { Lector } from "./lector";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leyendo · Bajo Tensión", robots: { index: false } };

export default async function Leer() {
  const u = await exigirUsuario("/leer");
  if (!(await tieneLaGuia(u.id))) redirect("/biblioteca");
  if (PRODUCTO.paginas < 1) {
    return (
      <main className="centro">
        <div className="tarjeta">
          <h1>¡Ya tenés la guía!</h1>
          <p className="tenue">
            Estamos terminando de cargar las páginas. Te avisamos por email apenas esté lista para leer.
          </p>
          <a className="boton" href="/biblioteca">Volver a mi biblioteca</a>
        </div>
      </main>
    );
  }
  return <Lector total={PRODUCTO.paginas} titulo={PRODUCTO.titulo} />;
}
