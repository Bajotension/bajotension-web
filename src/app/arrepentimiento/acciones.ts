"use server";
import { randomBytes } from "node:crypto";
import { supabaseAdmin, usuarioActual } from "@/lib/supabase/server";

export type EstadoArrepentimiento =
  | { ok: true; codigo: string }
  | { ok: false; error: string }
  | null;

const limpiar = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function pedirArrepentimiento(
  _prev: EstadoArrepentimiento,
  datos: FormData,
): Promise<EstadoArrepentimiento> {
  if (limpiar(datos.get("sitio"), 10)) return { ok: false, error: "No se pudo enviar." }; // trampa para robots
  const email = limpiar(datos.get("email"), 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Revisá el email: parece incompleto." };

  const codigo = "ARR-" + randomBytes(4).toString("hex").toUpperCase();
  const u = await usuarioActual();
  try {
    const { error } = await supabaseAdmin().from("arrepentimientos").insert({
      codigo,
      email,
      nombre: limpiar(datos.get("nombre"), 120) || null,
      fecha_compra: limpiar(datos.get("fecha"), 40) || null,
      motivo: limpiar(datos.get("motivo"), 1000) || null,
      user_id: u?.id ?? null,
    });
    if (error) throw error;
  } catch (e) {
    console.error(e);
    return { ok: false, error: "No pudimos registrar el pedido. Probá de nuevo en unos minutos o escribinos por email." };
  }
  return { ok: true, codigo };
}
