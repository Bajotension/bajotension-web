// Los libros, combos y precios están en ./catalogo.ts

export const LIMITES = {
  dispositivosActivos: 2, // PC y celular
  dispositivosNuevosPor30Dias: 6, // más que esto bloquea (cuenta compartida)
  paginasPorHora: 300, // freno a robots
};

export const BUCKET_PAGINAS = "guia-paginas";
export const COOKIE_DISPOSITIVO = "bt_dispositivo";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function formatoARS(n: number) {
  return "$ " + n.toLocaleString("es-AR");
}

// Datos del vendedor (obligatorios para vender online en Argentina).
// Se cargan en las variables del hosting; mientras falten se ve "[completar]".
const falta = "[completar]";
export const VENDEDOR = {
  nombre: process.env.VENDEDOR_NOMBRE || falta,
  cuit: process.env.VENDEDOR_CUIT || falta,
  domicilio: process.env.VENDEDOR_DOMICILIO || falta,
  email: process.env.VENDEDOR_EMAIL || falta,
};

export const ENLACES_LEGALES = {
  reclamosConsumidor: "https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario",
};
