import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_ANON, SUPABASE_URL, supabaseConfigurado } from "./env";

/** Cliente con la sesión del usuario (cookies). */
export async function supabaseUsuario() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // En Server Components no se pueden escribir cookies; el middleware las renueva.
        }
      },
    },
  });
}

/** Cliente con permisos de administrador. Solo en el servidor. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type Usuario = { id: string; email: string; nombre: string };

export async function usuarioActual(): Promise<Usuario | null> {
  if (!supabaseConfigurado) return null;
  const sb = await supabaseUsuario();
  const { data } = await sb.auth.getUser(); // valida el token con Supabase
  const u = data.user;
  if (!u || !u.email) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, string>;
  return { id: u.id, email: u.email, nombre: meta.full_name || meta.name || u.email };
}
