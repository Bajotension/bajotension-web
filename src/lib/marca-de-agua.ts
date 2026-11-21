import "server-only";
import path from "node:path";
import { readFileSync } from "node:fs";
import { parse, type Font } from "opentype.js";
import sharp from "sharp";

let fuente: Font | null = null;
function cargarFuente() {
  if (!fuente) {
    const buf = readFileSync(path.join(process.cwd(), "assets/fonts/LiberationSans-Bold.ttf"));
    fuente = parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return fuente;
}

/** Texto convertido a trazos: no depende de fuentes instaladas en el servidor. */
function textoComoPath(texto: string, x: number, y: number, size: number) {
  return cargarFuente().getPath(texto, x, y, size).toPathData(1);
}

const escapar = (s: string) => s.replace(/[^\p{L}\p{N}@._\-+ ·/:]/gu, "");

/**
 * Agrega la marca de agua del comprador a una página.
 * - Mosaico diagonal, muy suave, en toda la página.
 * - Línea al pie, legible.
 */
export async function aplicarMarcaDeAgua(imagen: Buffer, comprador: { nombre: string; email: string }) {
  const img = sharp(imagen);
  const meta = await img.metadata();
  const w = meta.width ?? 1240;
  const h = meta.height ?? 1754;
  const fecha = new Date().toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
  const linea = escapar(`${comprador.nombre} · ${comprador.email}`);
  const pie = escapar(`Licencia personal de ${comprador.nombre} · ${comprador.email} · ${fecha} · bajotension.ar`);

  const size = Math.round(w / 38);
  const pasoX = Math.round(w * 0.62);
  const pasoY = Math.round(size * 7);
  let mosaico = "";
  for (let y = -h; y < h * 2; y += pasoY) {
    const desfase = ((y / pasoY) % 2) * (pasoX / 2);
    for (let x = -w; x < w * 2; x += pasoX) {
      mosaico += textoComoPath(linea, x + desfase, y, size);
    }
  }
  const pieSize = Math.round(w / 70);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <g transform="rotate(-28 ${w / 2} ${h / 2})"><path d="${mosaico}" fill="#1b3a5c" fill-opacity="0.075"/></g>
  <path d="${textoComoPath(pie, Math.round(w * 0.05), h - Math.round(pieSize * 1.6), pieSize)}" fill="#1b3a5c" fill-opacity="0.45"/>
</svg>`;
  return img
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 82 })
    .toBuffer();
}
