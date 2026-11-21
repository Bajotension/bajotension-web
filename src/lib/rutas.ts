/** Solo permite volver a rutas internas (evita redirecciones a otros sitios). */
export function rutaInterna(next: string | null | undefined, porDefecto = "/biblioteca") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return porDefecto;
  return next;
}
