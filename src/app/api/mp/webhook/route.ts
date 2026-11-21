import { NextResponse, type NextRequest } from "next/server";
import { firmaValida, procesarPago } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await req.json();
  } catch {
    /* sin cuerpo */
  }
  const tipo = q.get("type") ?? body.type ?? q.get("topic");
  const dataId = q.get("data.id") ?? (body.data?.id != null ? String(body.data.id) : null) ?? q.get("id");

  const ok = firmaValida({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId,
  });
  if (!ok) return NextResponse.json({ error: "firma" }, { status: 401 });

  if (tipo === "payment" && dataId) {
    try {
      const r = await procesarPago(dataId);
      return NextResponse.json({ ok: true, r });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "reintentar" }, { status: 500 }); // MP reintenta
    }
  }
  return NextResponse.json({ ok: true, r: "ignorado" });
}
