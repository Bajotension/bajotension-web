import { Encabezado, Pie } from "@/componentes";
import { VENDEDOR } from "@/lib/config";

export const metadata = { title: "Privacidad · Bajo Tensión" };

export default function Privacidad() {
  return (
    <>
      <Encabezado />
      <main className="legal">
        <p className="ceja">Legal</p>
        <h1>Política de privacidad</h1>
        <p className="tenue">Última actualización: noviembre de 2026.</p>

        <h2>Responsable</h2>
        <p>
          {VENDEDOR.nombre}, CUIT {VENDEDOR.cuit}, {VENDEDOR.domicilio}. Para cualquier consulta sobre tus datos:{" "}
          {VENDEDOR.email}.
        </p>

        <h2>Qué datos guardamos</h2>
        <ul>
          <li>Tu nombre y tu email de Google, para crear tu cuenta y asociar tu compra.</li>
          <li>Tus compras y su estado de pago.</li>
          <li>Los dispositivos con sesión abierta y su navegador, para aplicar el límite de dos dispositivos.</li>
          <li>Qué páginas de la guía abrís y cuándo, para proteger el contenido de descargas automáticas.</li>
        </ul>
        <p>
          No vemos ni guardamos los datos de tu tarjeta: el pago lo procesa Mercado Pago con sus propias políticas.
        </p>

        <h2>Para qué los usamos</h2>
        <p>
          Solo para darte acceso a lo que compraste, prevenir el uso indebido de las cuentas, atender consultas y
          arrepentimientos, y cumplir obligaciones legales e impositivas. No vendemos tus datos ni los usamos para
          publicidad de terceros.
        </p>

        <h2>Dónde se guardan</h2>
        <p>
          En los servidores de nuestros proveedores: Supabase (cuentas y base de datos), Netlify (el sitio) y Mercado
          Pago (pagos). Algunos de ellos pueden estar fuera de Argentina.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Podés pedir acceso, corrección o eliminación de tus datos escribiendo a {VENDEDOR.email}. Si eliminás tu
          cuenta, perdés el acceso a la guía.
        </p>
        <p className="nota-legal">
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
          lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA,
          en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y
          reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes
          en materia de protección de datos personales.
        </p>

        <h2>Cookies</h2>
        <p>
          Usamos solo las cookies necesarias para mantener tu sesión y reconocer tu dispositivo. No usamos cookies de
          publicidad.
        </p>
      </main>
      <Pie />
    </>
  );
}
