import Image from "next/image";
import Link from "next/link";
import { Encabezado, IconoInstagram, Libro, Pie } from "@/componentes";
import { PRODUCTO, formatoARS } from "@/lib/config";
import { INSTAGRAM } from "@/lib/marca";
import { BarraMovil } from "./barra-movil";

const CAPITULOS = [
  ["Cómo llega la electricidad a tu casa", "Red, medidor, acometida y tablero. Qué son 220 V y 50 Hz."],
  ["Tensión, corriente y potencia", "Volts, amperes y watts explicados con agua en un caño."],
  ["Qué le hace la corriente al cuerpo", "Por qué es peligrosa, qué son 30 mA y las reglas de oro."],
  ["El tablero por dentro", "Corte general, térmicas y disyuntor. Para qué sirve cada uno."],
  ["Puesta a tierra", "Qué es la jabalina y por qué sin tierra el disyuntor no alcanza."],
  ["Cables", "Colores, secciones, por qué se calientan y cómo reconocer uno bueno."],
  ["Los circuitos de tu casa", "Iluminación, tomas y circuitos especiales para aire o termotanque."],
  ["Enchufes, zapatillas y prolongadores", "Fichas, adaptadores, falsos contactos y chispas."],
  ["Llaves e iluminación", "Llaves simples y de combinación, LED y la luz “fantasma”."],
  ["Consumo y boleta de luz", "Qué gasta más, consumo fantasma y cómo detectar fugas."],
  ["Qué hacer cuando…", "Salta la térmica, salta el disyuntor, olor a quemado, media casa sin luz."],
  ["Tu casa segura", "Chicos, baño y cocina, tormentas, primeros auxilios y checklist final."],
];

const PREGUNTAS = [
  [
    "¿Cómo la leo?",
    "Desde la web, con tu cuenta de Google, en la computadora o en el celular. Entrás a tu biblioteca y seguís donde la dejaste.",
  ],
  [
    "¿Se puede descargar?",
    "No. La guía se lee online para cuidar el trabajo que lleva. Cada página tiene una marca personal con tu nombre.",
  ],
  ["¿En cuántos dispositivos?", "En dos a la vez, por ejemplo tu PC y tu celular."],
  ["¿Cómo pago?", "Con Mercado Pago: tarjeta de crédito o débito, o dinero en cuenta. Es un pago único, sin suscripción."],
  [
    "¿Reemplaza a un electricista?",
    "No. Te ayuda a entender tu instalación, resolver lo simple con seguridad y saber cuándo llamar a un electricista matriculado.",
  ],
  ["Pagué y no veo la guía", `Esperá unos minutos y recargá tu biblioteca. Si sigue sin aparecer, escribinos por Instagram a @${INSTAGRAM.usuario}.`],
];

function BotonComprar({ texto = "Comprar la guía" }: { texto?: string }) {
  return (
    <form action="/comprar" method="post">
      <button className="boton grande" type="submit">
        {texto}
        <span aria-hidden className="flecha">→</span>
      </button>
    </form>
  );
}

export default function Portada() {
  const descuento = PRODUCTO.precioRegularARS > PRODUCTO.precioARS;
  return (
    <>
      <Encabezado conCompra />
      <main>
        {/* Portada */}
        <section className="hero">
          <div className="hero-fondo" aria-hidden />
          <div className="hero-in">
            <div className="hero-texto aparecer">
              <span className="pildora">
                <span className="punto" /> Nueva guía digital
              </span>
              <h1>
                La electricidad de tu casa, <em>por fin clara.</em>
              </h1>
              <p className="bajada">
                Una guía ilustrada a color para entender tu tablero, saber por qué salta la térmica, elegir bien
                cables y enchufes, y actuar con seguridad cuando algo falla.
              </p>
              <div className="hero-compra">
                <BotonComprar />
                <div className="precio-linea">
                  <span className="monto">{formatoARS(PRODUCTO.precioARS)}</span>
                  {descuento && <s>{formatoARS(PRODUCTO.precioRegularARS)}</s>}
                  {descuento && <span className="etiqueta">Lanzamiento</span>}
                </div>
              </div>
              <p className="hero-nota">Pago único con Mercado Pago · Acceso inmediato · PC y celular</p>
            </div>
            <div className="hero-libro aparecer demora">
              <Libro />
            </div>
          </div>
        </section>

        {/* Datos */}
        <section className="datos" aria-label="La guía en números">
          <div className="datos-in">
            <div><strong>12</strong><span>capítulos</span></div>
            <div><strong>A color</strong><span>ilustrada de principio a fin</span></div>
            <div><strong>AEA</strong><span>con criterios de la reglamentación argentina</span></div>
            <div><strong>2</strong><span>dispositivos a la vez</span></div>
          </div>
        </section>

        {/* Para quién */}
        <section className="seccion">
          <div className="contenedor-ancho">
            <p className="ceja">Para quién es</p>
            <h2>Para cualquiera que viva en una casa <em>y quiera entenderla.</em></h2>
            <div className="tarjetas3">
              <article className="tarjeta-info">
                <span className="tarjeta-num">01</span>
                <h3>Dueños e inquilinos</h3>
                <p>Que quieren saber qué tienen en el tablero y si su instalación es segura.</p>
              </article>
              <article className="tarjeta-info">
                <span className="tarjeta-num">02</span>
                <h3>Los que no quieren depender de nadie</h3>
                <p>Para resolver lo simple, como un toma o una llave, sabiendo exactamente qué hacen.</p>
              </article>
              <article className="tarjeta-info">
                <span className="tarjeta-num">03</span>
                <h3>Familias con chicos</h3>
                <p>Para cuidar la casa: enchufes, baño, cocina, tormentas y qué hacer en una emergencia.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="seccion fondo-blanco" id="contenido">
          <div className="contenedor-ancho">
            <p className="ceja">Contenido</p>
            <h2>Doce capítulos, <em>de la calle al enchufe.</em></h2>
            <ol className="capitulos">
              {CAPITULOS.map(([t, d], i) => (
                <li key={t}>
                  <span className="cap-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Muestras */}
        <section className="seccion muestras">
          <div className="contenedor-ancho">
            <p className="ceja">Vista previa</p>
            <h2>Mirá cómo es <em>por dentro.</em></h2>
            <div className="abanico">
              {[1, 2, 3].map((n) => (
                <figure key={n} className={`hoja hoja-${n}`}>
                  <Image
                    src={`/muestra/pagina-${n}.webp`}
                    alt={`Página de muestra ${n} de la guía`}
                    width={1240}
                    height={1754}
                    sizes="(max-width: 760px) 80vw, 30vw"
                    loading="eager"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Autor */}
        <section className="seccion">
          <div className="contenedor-ancho autor">
            <div>
              <p className="ceja">Quién la hizo</p>
              <h2>De <em>Bajo Tensión</em>, el canal que explica la electricidad con animaciones.</h2>
            </div>
            <div className="autor-texto">
              <p>
                En Instagram explicamos la electricidad de la casa con animaciones 3D, sin vueltas y sin tecnicismos.
                Esta guía junta todo en un solo lugar, ordenado, ilustrado y pensado para las instalaciones de
                Argentina.
              </p>
              <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="boton secundario">
                <IconoInstagram /> Ver @{INSTAGRAM.usuario}
              </a>
            </div>
          </div>
        </section>

        {/* Precio */}
        <section className="seccion fondo-blanco" id="comprar">
          <div className="oferta">
            <div className="oferta-libro">
              <Libro chico />
            </div>
            <div className="oferta-info">
              <p className="ceja clara">Guía digital</p>
              <h2>{PRODUCTO.titulo}</h2>
              <ul className="incluye">
                <li>Los 12 capítulos, ilustrados a color</li>
                <li>Lectura online en PC y celular</li>
                <li>Seguís donde la dejaste</li>
                <li>Pago único, sin suscripción</li>
              </ul>
              <div className="oferta-precio">
                <span className="monto">{formatoARS(PRODUCTO.precioARS)}</span>
                {descuento && <s>{formatoARS(PRODUCTO.precioRegularARS)}</s>}
              </div>
              <form action="/comprar" method="post">
                <button className="boton claro grande ancho" type="submit">
                  Comprar con Mercado Pago <span aria-hidden className="flecha">→</span>
                </button>
              </form>
              <p className="oferta-nota">
                Ingresás con Google, pagás y la leés al instante. Al comprar aceptás los{" "}
                <Link href="/terminos">términos y condiciones</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section className="seccion" id="preguntas">
          <div className="contenedor-medio">
            <p className="ceja">Preguntas frecuentes</p>
            <h2>Antes de comprar.</h2>
            <div className="preguntas">
              {PREGUNTAS.map(([p, r]) => (
                <details key={p}>
                  <summary>{p}</summary>
                  <p>{r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Pie />

      {/* Barra de compra en celular */}
      <BarraMovil>
        <div>
          <span className="monto">{formatoARS(PRODUCTO.precioARS)}</span>
          {descuento && <s>{formatoARS(PRODUCTO.precioRegularARS)}</s>}
        </div>
        <form action="/comprar" method="post">
          <button className="boton" type="submit">Comprar</button>
        </form>
      </BarraMovil>
    </>
  );
}
