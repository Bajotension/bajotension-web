import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { COOKIE_DISPOSITIVO, LIMITES } from "./config";
import { supabaseAdmin } from "./supabase/server";

const hash = (t: string) => createHash("sha256").update(t).digest("hex");

export type ResultadoRegistro = { ok: true } | { ok: false; motivo: "demasiados-dispositivos" };

/**
 * Se llama al iniciar sesión. Crea un dispositivo nuevo y deja como máximo
 * LIMITES.dispositivosActivos (cierra los más viejos).
 */
export async function registrarDispositivo(userId: string, userAgent: string): Promise<ResultadoRegistro> {
  const db = supabaseAdmin();
  const hace30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const { count } = await db
    .from("dispositivos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("creado", hace30);
  if ((count ?? 0) >= LIMITES.dispositivosNuevosPor30Dias) return { ok: false, motivo: "demasiados-dispositivos" };

  const token = randomBytes(32).toString("base64url");
  const { error } = await db
    .from("dispositivos")
    .insert({ user_id: userId, token_hash: hash(token), user_agent: userAgent.slice(0, 300) });
  if (error) throw error;

  // Cerrar los que sobran (los más viejos por último uso)
  const { data: activos } = await db
    .from("dispositivos")
    .select("id")
    .eq("user_id", userId)
    .is("cerrado", null)
    .order("ultimo_uso", { ascending: false });
  const sobran = (activos ?? []).slice(LIMITES.dispositivosActivos).map((d) => d.id);
  if (sobran.length) {
    await db.from("dispositivos").update({ cerrado: new Date().toISOString() }).in("id", sobran);
  }

  const store = await cookies();
  store.set(COOKIE_DISPOSITIVO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return { ok: true };
}

/** ¿Este navegador sigue siendo uno de los dispositivos activos del usuario? */
export async function dispositivoValido(userId: string): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_DISPOSITIVO)?.value;
  if (!token) return false;
  const db = supabaseAdmin();
  const { data } = await db
    .from("dispositivos")
    .select("id, ultimo_uso")
    .eq("user_id", userId)
    .eq("token_hash", hash(token))
    .is("cerrado", null)
    .maybeSingle();
  if (!data) return false;
  // Actualizar último uso como mucho cada 5 minutos
  if (Date.now() - new Date(data.ultimo_uso).getTime() > 5 * 60 * 1000) {
    await db.from("dispositivos").update({ ultimo_uso: new Date().toISOString() }).eq("id", data.id);
  }
  return true;
}

export async function cerrarDispositivoActual(userId: string) {
  const store = await cookies();
  const token = store.get(COOKIE_DISPOSITIVO)?.value;
  if (token) {
    await supabaseAdmin()
      .from("dispositivos")
      .update({ cerrado: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("token_hash", hash(token));
  }
  store.delete(COOKIE_DISPOSITIVO);
}
