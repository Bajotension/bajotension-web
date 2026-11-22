import Link from "next/link";
import { Encabezado, Pie } from "@/componentes";
import { LIBROS, PRODUCTOS, productoDisponible } from "@/lib/catalogo";
import { LIMITES, VENDEDOR, formatoARS } from "@/lib/config";

export const metadata = { title: "Términos y condiciones · Bajo Tensión" };

export default function Terminos() {
  return (
    <>
      <Encabezado />
      <main className="legal">
        <p className="ceja">Legal</p>
        <h1>Términos y condiciones</h1>
        <p className="tenue">Última actualización: noviembre de 2026.</p>

        <h2>1. Quién vende</h2>
        <p>
          {VENDEDOR.nombre}, CUIT {VENDEDOR.cuit}, con domicilio en {VENDEDOR.domicilio}. Contacto: {VENDEDOR.email}.
        </p>

        <h2>2. Qué comprás</h2>
        <p>
          Una licencia personal para leer online, dentro de este sitio, el libro digital que elijas de la colección
          ({LIBROS.map((l) => `"${l.titulo}"`).join(", ")}) o un combo que incluya varios. Los libros no se entregan
          como archivo descargable. Los precios son finales en pesos argentinos, en un único pago, y se cobran a través
          de Mercado Pago:
        </p>
        <ul>
          {PRODUCTOS.filter(productoDisponible).map((p) => (
            <li key={p.id}>
              {p.titulo}: {formatoARS(p.precioARS)}
              {p.descuento &&
                ` (${formatoARS(p.descuento.precioARS)} si ya compraste "${LIBROS.find((l) => l.id === p.descuento!.siTiene)!.titulo}")`}
              .
            </li>
          ))}
        </ul>

        <h2>3. Cómo accedés</h2>
        <p>
          Ingresás con tu cuenta de Google. Cuando Mercado Pago confirma el pago, el libro aparece en tu biblioteca. Si
          pagás con un medio que tarda en acreditarse, el acceso se habilita cuando se acredita.
        </p>

        <h2>4. Uso permitido</h2>
        <ul>
          <li>La licencia es personal e intransferible.</li>
          <li>Podés usarla en hasta {LIMITES.dispositivosActivos} dispositivos a la vez. Si entrás desde otro, se cierra la sesión más vieja.</li>
          <li>Cada página lleva una marca con tu nombre y tu email.</li>
          <li>
            No está permitido copiar, capturar, grabar, compartir, revender o publicar el contenido, ni compartir tu
            cuenta. Si eso pasa, podemos suspender el acceso sin reintegro.
          </li>
        </ul>

        <h2>5. Arrepentimiento</h2>
        <p>
          Los libros son contenido digital que se habilita al instante. Por eso, como prevé el artículo 1116, inciso c,
          del Código Civil y Comercial, <strong>una vez que abrís cualquier página del libro ya no podés arrepentirte
          de la compra</strong>. Lo aceptás al marcar la casilla de aceptación de estos términos antes de pagar.
        </p>
        <p>
          Si todavía no abriste ninguna página, podés arrepentirte dentro de los 10 días corridos desde la compra, sin
          dar motivos, desde el <Link href="/arrepentimiento">botón de arrepentimiento</Link>. Verificamos en nuestros
          registros que no se haya abierto ninguna página y te devolvemos el dinero por el mismo medio de pago; el
          acceso se da de baja. Si el arrepentimiento es de un combo, se da de baja el combo completo.
        </p>

        <h2>6. Alcance del contenido</h2>
        <p>
          Los libros son material educativo para entender la instalación eléctrica de una casa. No reemplaza a un
          electricista matriculado. Cualquier trabajo sobre la instalación tiene que hacerse sin tensión y respetando la
          reglamentación vigente. Ante dudas, consultá a un profesional.
        </p>

        <h2>7. Disponibilidad</h2>
        <p>
          Hacemos lo posible para que el sitio funcione siempre, pero puede haber cortes por mantenimiento o problemas de
          los proveedores. Si no podés acceder a algo que compraste, escribinos.
        </p>

        <h2>8. Cambios y ley aplicable</h2>
        <p>
          Podemos actualizar estos términos; los cambios no afectan compras ya hechas. Se aplica la ley argentina, en
          particular la Ley 24.240 de Defensa del Consumidor.
        </p>
      </main>
      <Pie />
    </>
  );
}
