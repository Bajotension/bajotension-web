// Pruebas rápidas: marca de agua y firma de Mercado Pago. Ejecutar: npm run probar
import { createHmac } from "node:crypto";
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { aplicarMarcaDeAgua } from "../src/lib/marca-de-agua";
import { firmaValida } from "../src/lib/mercadopago";
import { rutaInterna } from "../src/lib/rutas";
import { LIBROS, PACK, librosDeProductos, precioPara, productoDeLibro, type LibroId } from "../src/lib/catalogo";

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

// 4) Catálogo: libros, combos y descuentos
const A = productoDeLibro("a");
const B = productoDeLibro("b");
const nada = new Set<LibroId>();
ok(A.id === "guia-electricidad-hogar", "el Libro A mantiene el id de las compras ya hechas");
ok(librosDeProductos(["guia-electricidad-hogar"]).has("a"), "compra vieja da acceso al Libro A");
const delPack = librosDeProductos([PACK.id]);
ok(delPack.has("a") && delPack.has("b"), "el pack da acceso a los dos libros");
ok(librosDeProductos(["inventado"]).size === 0, "producto desconocido no da acceso");
ok(precioPara(A, nada) === A.precioARS, "Libro A a precio normal");
ok(precioPara(A, new Set<LibroId>(["a"])) === null, "no se puede comprar dos veces el mismo libro");
LIBROS[1].disponible = true; // simulamos que el B ya salió
ok(precioPara(B, nada) === B.precioARS, "Libro B a precio normal");
ok(precioPara(B, new Set<LibroId>(["a"])) === B.descuento!.precioARS, "Libro B con descuento si tiene el A");
ok(precioPara(PACK, nada) === PACK.precioARS, "pack a su precio");
ok(precioPara(PACK, new Set<LibroId>(["a"])) === null, "quien tiene el A no compra el pack (compra el B con descuento)");
ok(PACK.precioARS < PACK.precioRegularARS, "el pack es más barato que la suma");
LIBROS[1].disponible = false;
ok(precioPara(B, nada) === null && precioPara(PACK, nada) === null, "B y pack no se venden mientras no salga el B");

if (fallas) { console.log(`${fallas} fallas`); process.exit(1); }
console.log("Todo OK");
