import { redirect } from "next/navigation";
import { Encabezado, Pie } from "@/componentes";
import { rutaInterna } from "@/lib/rutas";
import { usuarioActual } from "@/lib/supabase/server";
import { BotonGoogle } from "./boton-google";

const ERRORES: Record<string, string> = {
  google: "No se pudo ingresar con Google. Probá de nuevo.",
  dispositivos:
    "Esta cuenta se abrió en demasiados dispositivos este mes. Escribinos y lo resolvemos.",
  "sesion-cerrada":
    "Se cerró la sesión en este dispositivo porque la cuenta se abrió en otros dos. Podés volver a ingresar.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; motivo?: string }> }) {
  const { next, error, motivo } = await searchParams;
  const destino = rutaInterna(next);
  if (!error && (await usuarioActual())) redirect(destino);
  return (
    <>
      <Encabezado />
      <main className="centro">
        <div className="tarjeta">
          <h1>Ingresá a tu cuenta</h1>
          <p className="tenue">Usamos tu cuenta de Google para guardar tu compra. No publicamos nada.</p>
          {error && ERRORES[error] && (
            <p className="aviso">
              {ERRORES[error]}
              {motivo && <small className="aviso-detalle"> Detalle: {motivo.slice(0, 160)}</small>}
            </p>
          )}
          <BotonGoogle next={destino} />
          <p className="nota">Podés leer la guía en hasta 2 dispositivos a la vez, por ejemplo tu PC y tu celular.</p>
        </div>
      </main>
      <Pie />
    </>
  );
}
