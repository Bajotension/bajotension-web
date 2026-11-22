import { Encabezado, Pie } from "@/componentes";
import { VENDEDOR } from "@/lib/config";
import { usuarioActual } from "@/lib/supabase/server";
import { FormularioArrepentimiento } from "./formulario";

export const metadata = { title: "Botón de arrepentimiento · Bajo Tensión" };
export const dynamic = "force-dynamic";

export default async function Arrepentimiento() {
  const u = await usuarioActual();
  return (
    <>
      <Encabezado />
      <main className="legal">
        <p className="ceja">Botón de arrepentimiento</p>
        <h1>Arrepentirte de tu compra</h1>
        <p>
          Si todavía no abriste ninguna página del libro, tenés 10 días corridos desde la compra para arrepentirte, sin
          dar explicaciones. Completá el formulario: te damos un código de gestión al instante y, después de verificar
          que no se abrió ninguna página, te devolvemos el dinero por el mismo medio de pago. No hace falta ingresar a
          tu cuenta.
        </p>
        <p className="aviso">
          Los libros son contenido digital de acceso inmediato: una vez que abrís una página ya no corresponde el
          arrepentimiento (art. 1116, inc. c, del Código Civil y Comercial). Lo aceptaste en los términos y condiciones al comprar.
        </p>
        <FormularioArrepentimiento emailInicial={u?.email ?? ""} />
        <p className="tenue pequeño">
          También podés pedirlo por email a {VENDEDOR.email}. Resolución 424/2020 de la Secretaría de Comercio Interior.
        </p>
      </main>
      <Pie />
    </>
  );
}
