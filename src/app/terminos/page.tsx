import Link from "next/link";
import { Encabezado, Pie } from "@/componentes";
import { LIMITES, PRODUCTO, VENDEDOR, formatoARS } from "@/lib/config";

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
          Una licencia personal para leer online la guía digital &quot;{PRODUCTO.titulo}&quot; dentro de este sitio. La
          guía no se entrega como archivo descargable. El precio es {formatoARS(PRODUCTO.precioARS)} final en pesos
          argentinos, en un único pago, y se cobra a través de Mercado Pago.
        </p>

        <h2>3. Cómo accedés</h2>
        <p>
          Ingresás con tu cuenta de Google. Cuando Mercado Pago confirma el pago, la guía aparece en tu biblioteca. Si
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
          Podés arrepentirte de la compra dentro de los 10 días corridos desde que la hiciste, sin dar motivos, desde el{" "}
          <Link href="/arrepentimiento">botón de arrepentimiento</Link>. Te devolvemos el dinero por el mismo medio de pago
          y se da de baja el acceso a la guía.
        </p>

        <h2>6. Alcance del contenido</h2>
        <p>
          La guía es material educativo para entender la instalación eléctrica de una casa. No reemplaza a un
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
