import Link from "next/link";
import { ENLACES_LEGALES, VENDEDOR } from "@/lib/config";
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
 * Colección (bajadas propuestas):
 *  azul  · Electricidad básica     · "Entendé tu casa, sin tecnicismos"
 *  verde · Energías renovables     · "Paneles solares y energía limpia para tu casa"
 *  rojo  · Electricidad industrial · "Tableros, motores y comandos, explicados claro"
 */
export type ColorLibro = "azul" | "verde" | "rojo";

export function Libro({
  chico = false,
  color = "azul",
  titulo = ["Electricidad", "básica"],
  bajada = "Entendé tu casa, sin tecnicismos",
}: {
  chico?: boolean;
  color?: ColorLibro;
  titulo?: [string, string];
  bajada?: string;
}) {
  return (
    <div className={`libro3d libro-${color}${chico ? " chico" : ""}`} aria-hidden>
      <div className="libro3d-interior">
        <span className="int-ceja">Capítulo 1</span>
        <span className="int-titulo">Cómo llega la electricidad a tu casa</span>
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
        <span className="tapa-titulo">
          {titulo[0]}
          <br />
          <em>{titulo[1]}</em>
        </span>
        <span className="tapa-sub">{bajada}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tapa-rayo" src="/rayo.webp" alt="" draggable={false} />
        <span className="tapa-firma">Bajo Tensión</span>
        <div className="tapa-brillo" />
      </div>
    </div>
  );
}
