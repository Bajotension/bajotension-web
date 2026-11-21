"use client";
import { useActionState } from "react";
import { pedirArrepentimiento, type EstadoArrepentimiento } from "./acciones";

export function FormularioArrepentimiento({ emailInicial }: { emailInicial: string }) {
  const [estado, enviar, enviando] = useActionState<EstadoArrepentimiento, FormData>(pedirArrepentimiento, null);

  if (estado?.ok) {
    return (
      <div className="confirmacion" role="status">
        <p className="ceja">Pedido recibido</p>
        <p className="codigo">{estado.codigo}</p>
        <p>
          Guardá este código de gestión. Te escribimos al email que dejaste y te devolvemos el dinero por el mismo
          medio de pago. El acceso a la guía se da de baja cuando se hace la devolución.
        </p>
      </div>
    );
  }

  return (
    <form action={enviar} className="formulario">
      <label htmlFor="arr-email">Email con el que compraste *</label>
      <input id="arr-email" name="email" type="email" required defaultValue={emailInicial} autoComplete="email" />

      <label htmlFor="arr-nombre">Nombre y apellido</label>
      <input id="arr-nombre" name="nombre" type="text" autoComplete="name" />

      <label htmlFor="arr-fecha">Fecha aproximada de compra</label>
      <input id="arr-fecha" name="fecha" type="date" />

      <label htmlFor="arr-motivo">Motivo (opcional)</label>
      <textarea id="arr-motivo" name="motivo" rows={3} />

      <input type="text" name="sitio" tabIndex={-1} autoComplete="off" className="trampa" aria-hidden />

      {estado && !estado.ok && <p className="aviso">{estado.error}</p>}
      <button className="boton" type="submit" disabled={enviando}>
        {enviando ? "Enviando…" : "Quiero arrepentirme de mi compra"}
      </button>
    </form>
  );
}
