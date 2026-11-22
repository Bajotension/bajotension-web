import Link from "next/link";
import { LIBROS, PACK, libroPorId, productoDeLibro, productoDisponible, type Libro as LibroDatos } from "@/lib/catalogo";
import { ENLACES_LEGALES, VENDEDOR, formatoARS } from "@/lib/config";
import { INSTAGRAM } from "@/lib/marca";
import { usuarioActual } from "@/lib/supabase/server";

export async function Encabezado({ conCompra = false }: { conCompra?: boolean }) {
  const u = await usuarioActual();
  return (
    <header className="enc">
      <div className="enc-in">
        <Link href="/" className="marca">Bajo Tensión</Link>
        <nav>
          {conCompra && (
            <>
              <a href="#contenido" className="enlace solo-pc">Contenido</a>
              <a href="#preguntas" className="enlace solo-pc">Preguntas</a>
            </>
          )}
          <Link href="/libros" className="enlace">Libros</Link>
          {u ? (
            <Link href="/biblioteca" className="enlace">Mi biblioteca</Link>
          ) : (
            <Link href="/login" className="enlace">Ingresar</Link>
          )}
          {conCompra && (
            <a href="#comprar" className="boton chico solo-pc">Comprar</a>
          )}
          {u && !conCompra && (
            <form action="/auth/salir" method="post">
              <button className="enlace" type="submit">Salir</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}

export function IconoInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pie() {
  return (
    <footer className="pie">
      <div className="pie-in">
        <div>
          <span className="marca">Bajo Tensión</span>
          <p className="tenue">Electricidad del hogar, explicada simple.</p>
        </div>
        <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="enlace ig">
          <IconoInstagram /> @{INSTAGRAM.usuario}
        </a>
      </div>
      <nav className="pie-enlaces" aria-label="Información legal">
        <Link href="/arrepentimiento" className="boton-arrepentimiento">Botón de arrepentimiento</Link>
        <Link href="/terminos" className="enlace">Términos y condiciones</Link>
        <Link href="/privacidad" className="enlace">Privacidad</Link>
        <a href={ENLACES_LEGALES.reclamosConsumidor} target="_blank" rel="noopener noreferrer" className="enlace">
          Defensa del consumidor: reclamos
        </a>
      </nav>
      <div className="pie-legal">
        <span>
          © {new Date().getFullYear()} {VENDEDOR.nombre} · CUIT {VENDEDOR.cuit} · {VENDEDOR.email}
        </span>
        <span>Pagos procesados por Mercado Pago</span>
      </div>
    </footer>
  );
}

/**
 * Libro 3D: tapa dibujada en código con el rayo; al apuntarlo se abre un poco.
 * Los datos de cada libro (título, color, bajada) están en src/lib/catalogo.ts.
 * Colores de la colección: amarillo, azul, verde, rojo.
 */
export function Libro({
  libro,
  chico = false,
}: {
  libro: Pick<LibroDatos, "tituloTapa" | "bajada" | "color" | "capitulos">;
  chico?: boolean;
}) {
  const [linea1, linea2] = libro.tituloTapa;
  const primero = libro.capitulos[0];
  const largo = Math.max(linea1.length, linea2.length) > 14;
  return (
    <div className={`libro3d libro-${libro.color}${chico ? " chico" : ""}`} aria-hidden>
      <div className="libro3d-interior">
        <span className="int-ceja">Capítulo {primero?.n ?? 1}</span>
        <span className="int-titulo">{primero?.titulo}</span>
        <span className="int-linea" />
        <span className="int-linea" />
        <span className="int-linea corta" />
        <span className="int-figura" />
        <span className="int-linea" />
        <span className="int-linea corta" />
      </div>
      <div className="libro3d-tapa">
        <div className="tapa-lineas" />
        <span className="tapa-ceja">Guía ilustrada</span>
        <span className={`tapa-titulo${largo ? " largo" : ""}`}>
          {linea1}
          <br />
          <em>{linea2}</em>
        </span>
        <span className="tapa-sub">{libro.bajada}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tapa-rayo" src="/rayo.webp" alt="" draggable={false} />
        <span className="tapa-firma">Bajo Tensión</span>
        <span className="tapa-web">
          <IconoInstagram size={14} />
          bajotension.ar
        </span>
        <div className="tapa-brillo" />
      </div>
    </div>
  );
}

/** Botón que inicia la compra de un producto del catálogo (libro suelto o combo). */
export function BotonCompra({
  producto,
  children,
  className = "boton",
}: {
  producto: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form action="/comprar" method="post">
      <input type="hidden" name="producto" value={producto} />
      <button className={className} type="submit">{children}</button>
    </form>
  );
}

/** Índice de un libro: número, título y de qué trata cada capítulo. */
export function Indice({ libro }: { libro: LibroDatos }) {
  return (
    <ol className="capitulos">
      {libro.capitulos.map((c) => (
        <li key={c.n}>
          <span className="cap-num">{String(c.n).padStart(2, "0")}</span>
          <div>
            <h3>{c.titulo}</h3>
            <p>{c.detalle}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Tabla para comparar los libros de la colección, lado a lado. */
export function ComparadorLibros() {
  const filas: [string, (l: LibroDatos) => React.ReactNode][] = [
    ["Para quién", (l) => l.para],
    ["Nivel", (l) => l.nivel],
    ["Cómo aprendés", (l) => l.metodo],
    ["Qué vas a hacer", (l) => l.practica],
    ["Reglamentación AEA", (l) => l.reglamentacion],
    ["Capítulos", (l) => `${l.capitulos.length} capítulos`],
    [
      "Precio",
      (l) => {
        const p = productoDeLibro(l.id);
        if (!l.disponible) return <span className="tenue">Próximamente</span>;
        return (
          <>
            <strong>{formatoARS(p.precioARS)}</strong>
            {p.precioRegularARS > p.precioARS && <s className="precio-viejo">{formatoARS(p.precioRegularARS)}</s>}
            {p.descuento && (
              <span className="comparar-nota">
                {formatoARS(p.descuento.precioARS)} si ya tenés &quot;{libroPorId(p.descuento.siTiene).titulo}&quot;
              </span>
            )}
          </>
        );
      },
    ],
  ];
  const pack = productoDisponible(PACK);
  return (
    <div className="comparar" style={{ ["--cols" as string]: LIBROS.length }}>
      <div className="comparar-fila comparar-cabeza">
        <span className="comparar-etiqueta" />
        {LIBROS.map((l) => (
          <div key={l.id} className={`comparar-libro color-${l.color}`}>
            <span className="comparar-punto" aria-hidden />
            <span>
              <span className="comparar-letra">Libro {l.id.toUpperCase()}</span>
              <strong>{l.titulo}</strong>
            </span>
          </div>
        ))}
      </div>
      {filas.map(([etiqueta, valor]) => (
        <div className="comparar-fila" key={etiqueta}>
          <span className="comparar-etiqueta">{etiqueta}</span>
          {LIBROS.map((l) => (
            <div key={l.id} className="comparar-celda">{valor(l)}</div>
          ))}
        </div>
      ))}
      <div className="comparar-fila comparar-acciones">
        <span className="comparar-etiqueta" />
        {LIBROS.map((l) => (
          <div key={l.id} className="comparar-celda">
            <Link href={`/libros/${l.slug}`} className="boton secundario chico">Ver índice</Link>
            {l.disponible && (
              <BotonCompra producto={productoDeLibro(l.id).id} className="boton chico">Comprar</BotonCompra>
            )}
          </div>
        ))}
      </div>
      {pack && (
        <div className="comparar-pack">
          <div>
            <strong>{PACK.titulo}</strong>
            <span className="tenue">
              {" "}· {formatoARS(PACK.precioARS)} <s>{formatoARS(PACK.precioRegularARS)}</s>
            </span>
          </div>
          <BotonCompra producto={PACK.id} className="boton chico">Comprar el pack</BotonCompra>
        </div>
      )}
    </div>
  );
}
