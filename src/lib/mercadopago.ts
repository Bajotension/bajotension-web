import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PRODUCTO, siteUrl } from "./config";
import { supabaseAdmin } from "./supabase/server";

const API = "https://api.mercadopago.com";

function token() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("Falta MP_ACCESS_TOKEN");
  return t;
}

/** En producción solo se aceptan pagos reales; en prueba, solo de prueba. */
const esperaPagoReal = () => process.env.MP_MODO === "produccion";

export async function crearPreferencia(orden: { id: string; monto: number; email: string }) {
  const res = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": orden.id,
    },
    body: JSON.stringify({
      items: [
        {
          id: PRODUCTO.id,
          title: PRODUCTO.titulo,
          quantity: 1,
          unit_price: orden.monto,
          currency_id: "ARS",
          category_id: "learnings",
        },
      ],
      payer: { email: orden.email },
      external_reference: orden.id,
      back_urls: {
        success: `${siteUrl()}/compra`,
        pending: `${siteUrl()}/compra`,
        failure: `${siteUrl()}/compra`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl()}/api/mp/webhook?source_news=webhooks`,
      statement_descriptor: "BAJOTENSION",
      binary_mode: false,
    }),
  });
  if (!res.ok) throw new Error(`Mercado Pago respondió ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { id: string; init_point: string; sandbox_init_point?: string };
  // Con credenciales "TEST-" de una cuenta real, Mercado Pago pide usar el checkout de sandbox.
  const usarSandbox = !esperaPagoReal() && (process.env.MP_ACCESS_TOKEN ?? "").startsWith("TEST-");
  return { id: data.id, init_point: usarSandbox && data.sandbox_init_point ? data.sandbox_init_point : data.init_point };
}

type Pago = {
  id: number;
  status: string;
  currency_id: string;
  transaction_amount: number;
  external_reference: string | null;
  live_mode: boolean;
};

export async function obtenerPago(id: string): Promise<Pago | null> {
  if (!/^\d{1,20}$/.test(id)) return null;
  const res = await fetch(`${API}/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Mercado Pago respondió ${res.status}`);
  return (await res.json()) as Pago;
}

/**
 * Verifica la firma x-signature del webhook.
 * Plantilla oficial: "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
export function firmaValida(params: { xSignature: string | null; xRequestId: string | null; dataId: string | null }) {
  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (!secreto || !params.xSignature) return false;
  const partes = Object.fromEntries(
    params.xSignature.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    }),
  );
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;
  // No se rechazan avisos repetidos: procesarPago es idempotente y siempre consulta la API.
  let manifiesto = "";
  if (params.dataId) manifiesto += `id:${/^[a-z0-9]+$/i.test(params.dataId) ? params.dataId.toLowerCase() : params.dataId};`;
  if (params.xRequestId) manifiesto += `request-id:${params.xRequestId};`;
  manifiesto += `ts:${ts};`;
  const esperado = createHmac("sha256", secreto).update(manifiesto).digest("hex");
  const a = Buffer.from(esperado);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

const ESTADOS_QUE_REVOCAN = new Set(["refunded", "charged_back", "cancelled"]);

/**
 * Fuente de verdad: el pago consultado a la API de Mercado Pago.
 * Habilita o revoca el acceso. Idempotente: se puede llamar muchas veces.
 */
export async function procesarPago(pagoId: string): Promise<"habilitado" | "revocado" | "pendiente" | "ignorado"> {
  const pago = await obtenerPago(pagoId);
  if (!pago || !pago.external_reference) return "ignorado";
  // En producción no se aceptan pagos de prueba. En modo prueba, los pagos entre
  // usuarios de prueba de Mercado Pago pueden venir con live_mode true o false.
  if (esperaPagoReal() && !pago.live_mode) return "ignorado";

  const db = supabaseAdmin();
  const { data: orden } = await db
    .from("ordenes")
    .select("id, user_id, monto, estado")
    .eq("id", pago.external_reference)
    .maybeSingle();
  if (!orden) return "ignorado";

  if (pago.status === "approved") {
    if (pago.currency_id !== "ARS" || pago.transaction_amount + 0.001 < Number(orden.monto)) {
      await db.from("ordenes").update({ estado: "monto-invalido", pago_id: String(pago.id) }).eq("id", orden.id);
      return "ignorado";
    }
    await db
      .from("ordenes")
      .update({ estado: "pagada", pago_id: String(pago.id), pagada: new Date().toISOString() })
      .eq("id", orden.id);
    const { error } = await db
      .from("accesos")
      .upsert(
        { user_id: orden.user_id, producto: PRODUCTO.id, orden_id: orden.id, revocado: null },
        { onConflict: "orden_id" },
      );
    if (error) throw error;
    return "habilitado";
  }

  if (ESTADOS_QUE_REVOCAN.has(pago.status)) {
    await db.from("ordenes").update({ estado: pago.status, pago_id: String(pago.id) }).eq("id", orden.id);
    await db.from("accesos").update({ revocado: new Date().toISOString() }).eq("orden_id", orden.id);
    return "revocado";
  }

  if (orden.estado !== "pagada") {
    await db.from("ordenes").update({ estado: pago.status, pago_id: String(pago.id) }).eq("id", orden.id);
  }
  return "pendiente";
}
