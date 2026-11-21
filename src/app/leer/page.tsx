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
  return <Lector total={PRODUCTO.paginas} titulo={PRODUCTO.titulo} />;
}
