import "server-only";
import { redirect } from "next/navigation";
import { dispositivoValido } from "./dispositivos";
import { usuarioActual } from "./supabase/server";

/** Para páginas privadas: exige sesión y que este dispositivo siga activo. */
export async function exigirUsuario(desde: string) {
  const usuario = await usuarioActual();
  if (!usuario) redirect(`/login?next=${encodeURIComponent(desde)}`);
  if (!(await dispositivoValido(usuario.id))) redirect("/auth/salir?motivo=sesion-cerrada");
  return usuario;
}
