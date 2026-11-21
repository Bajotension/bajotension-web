// Sube las páginas de la guía al almacenamiento privado de Supabase.
// Uso: node --env-file=.env.local scripts/subir-guia.mjs <carpeta-con-imagenes>
// Las imágenes se ordenan por nombre (01.png, 02.png...). Se convierten a webp de 1240 px de ancho.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const carpeta = process.argv[2];
if (!carpeta) throw new Error("Indicá la carpeta con las imágenes de las páginas");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const archivos = readdirSync(carpeta).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
let n = 0;
for (const f of archivos) {
  n++;
  const webp = await sharp(readFileSync(path.join(carpeta, f))).resize({ width: 1240 }).webp({ quality: 86 }).toBuffer();
  const destino = `pagina-${String(n).padStart(3, "0")}.webp`;
  const { error } = await sb.storage.from("guia-paginas").upload(destino, webp, { contentType: "image/webp", upsert: true });
  if (error) throw error;
  console.log(`${f} → ${destino}`);
}
console.log(`\nListo: ${n} páginas. Poné GUIA_PAGINAS=${n} en las variables del hosting.`);
