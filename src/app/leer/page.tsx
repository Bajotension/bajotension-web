import { redirect } from "next/navigation";
import { librosDelUsuario } from "@/lib/acceso";
import { LIBROS } from "@/lib/catalogo";
import { exigirUsuario } from "@/lib/guardia";

export const dynamic = "force-dynamic";

/** /leer abre el primer libro que tenga el usuario (dirección vieja, se mantiene). */
export default async function Leer() {
  const u = await exigirUsuario("/leer");
  const tiene = await librosDelUsuario(u.id);
  const libro = LIBROS.find((l) => tiene.has(l.id));
  redirect(libro ? `/leer/${libro.slug}` : "/biblioteca");
}
