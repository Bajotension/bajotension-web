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
          Tenés 10 días corridos desde la compra para arrepentirte, sin dar explicaciones. Completá el formulario: te
          damos un código de gestión al instante y te devolvemos el dinero por el mismo medio de pago. No hace falta
          ingresar a tu cuenta.
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
