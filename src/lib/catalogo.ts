// Catálogo de libros y productos (libros sueltos y combos).
// Los precios viven SOLO en el servidor y se pueden cambiar con variables del hosting.
// Para sumar un libro: agregarlo a LIBROS, darle un producto en PRODUCTOS y subir sus páginas
// con `node scripts/subir-guia.mjs <carpeta> <slug>`.

export type ColorLibro = "amarillo" | "azul" | "verde" | "rojo";
export type LibroId = "a" | "b";

export type Capitulo = { n: number; titulo: string; detalle: string };

export type Libro = {
  id: LibroId;
  slug: string; // se usa en las direcciones: /libros/<slug>, /leer/<slug>
  titulo: string;
  tituloTapa: [string, string];
  bajada: string;
  color: ColorLibro;
  disponible: boolean; // false = se muestra como "Próximamente"
  paginas: number; // cantidad de páginas subidas a Storage
  carpeta: string; // carpeta dentro del bucket ("" = raíz, como el primer libro)
  claveLectura: string; // dónde el navegador recuerda la última página leída
  // Para comparar los libros
  para: string;
  nivel: string;
  metodo: string;
  practica: string;
  reglamentacion: string;
  capitulos: Capitulo[];
};

export type Producto = {
  id: string; // se guarda en ordenes.producto y accesos.producto: NO cambiar los existentes
  tipo: "libro" | "combo";
  titulo: string;
  libros: LibroId[];
  precioARS: number;
  precioRegularARS: number;
  /** Precio especial si el comprador ya tiene otro libro (ej.: el B para quien compró el A). */
  descuento?: { siTiene: LibroId; precioARS: number };
};

const num = (v: string | undefined, porDefecto: number) => {
  const n = Number(v);
  return v != null && v !== "" && Number.isFinite(n) ? n : porDefecto;
};
const si = (v: string | undefined) => /^(1|si|sí|true)$/i.test(v ?? "");

const LIBRO_A: Libro = {
  id: "a",
  slug: "electricidad-practica",
  titulo: "Electricidad práctica para el hogar",
  tituloTapa: ["Electricidad práctica", "para el hogar"],
  bajada: "Entendé tu instalación y resolvé los arreglos de todos los días",
  color: "amarillo",
  disponible: true,
  paginas: num(process.env.GUIA_PAGINAS, 0),
  carpeta: "",
  claveLectura: "bt-ultima-pagina",
  para: "Para el que quiere entender su casa, usarla con seguridad y resolver los arreglos de todos los días.",
  nivel: "Desde cero. Sin cálculos difíciles.",
  metodo: "Teoría justa, paso a paso con “Cómo se hace” y fallas reales para resolver.",
  practica: "Tareas de reemplazo, siempre sin tensión: tomacorrientes, interruptores, luminarias, clavijas, timbres.",
  reglamentacion: "La idea de cada regla, explicada sin cifras.",
  capitulos: [
    { n: 0, titulo: "Antes de tocar nada", detalle: "Las cinco reglas de oro en versión casa, cortar la luz bien y el mapa del tablero." },
    { n: 1, titulo: "Tus herramientas", detalle: "Herramientas aisladas, qué comprar primero, pelar un cable y crimpear un terminal." },
    { n: 2, titulo: "Qué es la electricidad", detalle: "Tensión, corriente y resistencia con la analogía del agua. Las partes de un cable." },
    { n: 3, titulo: "El multímetro", detalle: "Medir pilas y un tomacorriente, verificar que no hay tensión y probar continuidad." },
    { n: 4, titulo: "Ley de Ohm y uniones que no se calientan", detalle: "El triángulo de Ohm, el cortocircuito y empalmes con conector a palanca y bornera." },
    { n: 5, titulo: "Potencia y calor", detalle: "Watts, la placa de los artefactos, armar una clavija y reparar un prolongador." },
    { n: 6, titulo: "Los circuitos de tu casa", detalle: "Fase, neutro y tierra, circuitos de luces y tomas, y cambiar un tomacorriente." },
    { n: 7, titulo: "Iluminación", detalle: "Interruptores, portalámparas, luminarias, pasar a LED y la combinación explicada." },
    { n: 8, titulo: "El tablero", detalle: "Termomagnético y diferencial: cómo se lee un tablero y cómo se ve uno bien hecho." },
    { n: 9, titulo: "La puesta a tierra", detalle: "Para qué sirve, verificar que un toma tenga tierra y el engaño del neutro puenteado." },
    { n: 10, titulo: "La electricidad y tu cuerpo", detalle: "Baño, cocina y exterior. Qué hacer ante una persona electrocutada." },
    { n: 11, titulo: "Lo que hay dentro de las paredes", detalle: "Colores y secciones de los cables, caños y cajas, y qué revisar al electricista." },
    { n: 12, titulo: "Timbres y motores", detalle: "Magnetismo en simple. Instalar y reparar un timbre." },
    { n: 13, titulo: "Cuánto consume tu casa", detalle: "Energía y kWh, inventario de consumo, la prueba del medidor y los “vampiros”." },
    { n: 14, titulo: "Diagnóstico de fallas", detalle: "Síntoma, causa y prueba. Termotanque, aire split, ventilador de techo, bomba y heladera." },
    { n: 15, titulo: "Una casa segura", detalle: "Corte de neutro, tormentas, niños, humedad, grupo electrógeno y control anual." },
  ],
};

const LIBRO_B: Libro = {
  id: "b",
  slug: "camino-al-electricista",
  titulo: "Camino al electricista",
  tituloTapa: ["Camino al", "electricista"],
  bajada: "La electricidad a fondo, del átomo a la instalación completa",
  color: "azul",
  disponible: si(process.env.LIBRO_B_DISPONIBLE),
  paginas: num(process.env.LIBRO_B_PAGINAS, 0),
  carpeta: "camino-al-electricista/",
  claveLectura: "bt-ultima-pagina-camino-al-electricista",
  para: "Para el que quiere entender la electricidad a fondo o formarse para ser electricista.",
  nivel: "Técnico. Con cálculos y ejercicios con respuesta.",
  metodo: "Explicación técnica, “en pocas palabras”, ejemplo y ejercicios.",
  practica: "Diseño completo de una instalación domiciliaria, mediciones y fallas típicas.",
  reglamentacion: "Conceptos y cifras de la AEA, con la edición aclarada.",
  capitulos: [
    { n: 1, titulo: "Fundamentos físicos", detalle: "Átomo, carga, ley de Coulomb, campo eléctrico, rigidez dieléctrica y electricidad estática." },
    { n: 2, titulo: "Magnitudes eléctricas", detalle: "Tensión, corriente, resistencia, unidades, múltiplos, resistividad y temperatura." },
    { n: 3, titulo: "Ley de Ohm", detalle: "Enunciado, resistencias no lineales, corriente de arranque e impedancia del cuerpo." },
    { n: 4, titulo: "Potencia y energía", detalle: "Ley de Watt, Joule, rendimiento, caída de tensión y corriente admisible." },
    { n: 5, titulo: "Circuitos y leyes de Kirchhoff", detalle: "Serie, paralelo y mixto, ley de nodos y ley de mallas." },
    { n: 6, titulo: "Magnetismo y electromagnetismo", detalle: "Campo magnético, ley de Faraday, motores y transformadores." },
    { n: 7, titulo: "Corriente continua y alterna", detalle: "Frecuencia, valor eficaz, factor de potencia, monofásico y trifásico." },
    { n: 8, titulo: "Introducción a la electrónica", detalle: "Semiconductores, diodos, LED y fuentes." },
    { n: 9, titulo: "Seguridad eléctrica profesional", detalle: "Efectos fisiológicos, contactos directos e indirectos, cinco reglas de oro y EPP." },
    { n: 10, titulo: "Herramientas e instrumentos", detalle: "Multímetro avanzado, pinza amperométrica, megóhmetro y telurímetro." },
    { n: 11, titulo: "Conductores, canalizaciones y conexiones", detalle: "Tipos y normas de conductores, caños, cajas y elementos de conexión." },
    { n: 12, titulo: "Protecciones", detalle: "Cómo elegir el termomagnético, curvas, poder de corte y tipos de diferencial." },
    { n: 13, titulo: "Puesta a tierra", detalle: "Esquemas de conexión a tierra, electrodos y medición." },
    { n: 14, titulo: "Simbología y planos", detalle: "Símbolos normalizados, esquema unifilar y funcional, y lectura de planos." },
    { n: 15, titulo: "La reglamentación AEA", detalle: "Grado de electrificación, tipos de circuito, bocas y secciones mínimas, con la edición indicada." },
    { n: 16, titulo: "Diseño de una instalación domiciliaria", detalle: "Ejemplo completo de una casa de 75 m²." },
    { n: 17, titulo: "Mantenimiento y fallas", detalle: "Tipos de mantenimiento, mediciones de verificación y fallas típicas." },
  ],
};

export const LIBROS: Libro[] = [LIBRO_A, LIBRO_B];

const precioA = num(process.env.PRECIO_ARS, 9900);
const precioRegularA = num(process.env.PRECIO_REGULAR_ARS, 14900);
const precioB = num(process.env.LIBRO_B_PRECIO_ARS, 14900);
const precioRegularB = num(process.env.LIBRO_B_PRECIO_REGULAR_ARS, 19900);

export const PRODUCTOS: Producto[] = [
  {
    // Id histórico del primer libro: las compras de prueba ya hechas lo usan.
    id: "guia-electricidad-hogar",
    tipo: "libro",
    titulo: LIBRO_A.titulo,
    libros: ["a"],
    precioARS: precioA,
    precioRegularARS: precioRegularA,
  },
  {
    id: "camino-al-electricista",
    tipo: "libro",
    titulo: LIBRO_B.titulo,
    libros: ["b"],
    precioARS: precioB,
    precioRegularARS: precioRegularB,
    descuento: { siTiene: "a", precioARS: num(process.env.LIBRO_B_PRECIO_CON_A_ARS, 9900) },
  },
  {
    id: "pack-a-b",
    tipo: "combo",
    titulo: "Pack: los dos libros",
    libros: ["a", "b"],
    precioARS: num(process.env.PACK_PRECIO_ARS, 19900),
    precioRegularARS: precioA + precioB,
  },
];

export const PRODUCTO_POR_DEFECTO = PRODUCTOS[0];

export function libroPorId(id: LibroId): Libro {
  return LIBROS.find((l) => l.id === id)!;
}
export function libroPorSlug(slug: string | null | undefined): Libro | undefined {
  return LIBROS.find((l) => l.slug === slug);
}
export function productoPorId(id: string | null | undefined): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}
/** El producto que vende un libro suelto. */
export function productoDeLibro(id: LibroId): Producto {
  return PRODUCTOS.find((p) => p.tipo === "libro" && p.libros.length === 1 && p.libros[0] === id)!;
}
export const PACK = PRODUCTOS.find((p) => p.tipo === "combo")!;

/** Libros a los que dan acceso los productos comprados (un combo da varios). */
export function librosDeProductos(productos: string[]): Set<LibroId> {
  const libros = new Set<LibroId>();
  for (const id of productos) for (const l of productoPorId(id)?.libros ?? []) libros.add(l);
  return libros;
}

export function productoDisponible(p: Producto) {
  return p.libros.every((l) => libroPorId(l).disponible);
}

/**
 * Precio que paga este usuario, o null si no puede comprarlo:
 * no está a la venta, ya tiene todo, o es un combo y ya tiene alguno de sus libros
 * (en ese caso compra el libro que le falta, con su descuento).
 */
export function precioPara(p: Producto, tiene: Set<LibroId>): number | null {
  if (!productoDisponible(p)) return null;
  const leFaltan = p.libros.filter((l) => !tiene.has(l));
  if (leFaltan.length === 0) return null;
  if (p.tipo === "combo" && leFaltan.length < p.libros.length) return null;
  if (p.descuento && tiene.has(p.descuento.siTiene)) return Math.min(p.descuento.precioARS, p.precioARS);
  return p.precioARS;
}
