// Pruebas rápidas: marca de agua y firma de Mercado Pago. Ejecutar: npm run probar
import { createHmac } from "node:crypto";
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { aplicarMarcaDeAgua } from "../src/lib/marca-de-agua";
import { firmaValida } from "../src/lib/mercadopago";
import { rutaInterna } from "../src/lib/rutas";

let fallas = 0;
const ok = (c: boolean, m: string) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fallas++; };

// 1) Marca de agua
const base = await sharp({ create: { width: 1240, height: 1754, channels: 3, background: "#ffffff" } }).webp().toBuffer();
const marcada = await aplicarMarcaDeAgua(base, { nombre: "Ana Pérez", email: "ana@example.com" });
const m = await sharp(marcada).metadata();
ok(m.width === 1240 && m.height === 1754, "marca de agua mantiene tamaño");
const stats = await sharp(marcada).stats();
ok(stats.channels[0].min < 200, "marca de agua dibuja texto visible");
writeFileSync("/tmp/muestra-marcada.webp", marcada);

// 2) Firma del webhook
process.env.MP_WEBHOOK_SECRET = "secreto-de-prueba";
const ts = String(Math.floor(Date.now() / 1000));
const firma = (id: string, req: string) =>
  createHmac("sha256", "secreto-de-prueba").update(`id:${id};request-id:${req};ts:${ts};`).digest("hex");
ok(firmaValida({ xSignature: `ts=${ts},v1=${firma("123", "abc")}`, xRequestId: "abc", dataId: "123" }), "firma correcta se acepta");
ok(!firmaValida({ xSignature: `ts=${ts},v1=${firma("123", "abc")}`, xRequestId: "abc", dataId: "999" }), "firma de otro pago se rechaza");
ok(!firmaValida({ xSignature: `ts=${ts},v1=deadbeef`, xRequestId: "abc", dataId: "123" }), "firma inventada se rechaza");
ok(!firmaValida({ xSignature: null, xRequestId: "abc", dataId: "123" }), "sin firma se rechaza");

// 3) Redirecciones internas
ok(rutaInterna("//evil.com") === "/biblioteca", "bloquea redirección externa //");
ok(rutaInterna("https://evil.com") === "/biblioteca", "bloquea redirección externa https");
ok(rutaInterna("/leer") === "/leer", "permite ruta interna");

if (fallas) { console.log(`${fallas} fallas`); process.exit(1); }
console.log("Todo OK");
