import "server-only";
import { librosDeProductos, type LibroId } from "./catalogo";
import { supabaseAdmin } from "./supabase/server";

/** Libros que el usuario puede leer (sumando libros sueltos y combos comprados). */
export async function librosDelUsuario(userId: string): Promise<Set<LibroId>> {
  const { data } = await supabaseAdmin()
    .from("accesos")
    .select("producto")
    .eq("user_id", userId)
    .is("revocado", null);
  return librosDeProductos((data ?? []).map((a) => a.producto as string));
}

export async function tieneLibro(userId: string, libro: LibroId): Promise<boolean> {
  return (await librosDelUsuario(userId)).has(libro);
}
