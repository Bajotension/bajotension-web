"use client";
import { useEffect, useState } from "react";

/** Barra de compra en celular: aparece al pasar la portada y se oculta en la sección de precio. */
export function BarraMovil({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const oferta = document.querySelector("#comprar");
    if (!hero || !oferta) return;
    const estado = { hero: true, oferta: false };
    const actualizar = () => setVisible(!estado.hero && !estado.oferta);
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === hero) estado.hero = e.isIntersecting;
        if (e.target === oferta) estado.oferta = e.isIntersecting;
      }
      actualizar();
    });
    io.observe(hero);
    io.observe(oferta);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`barra-movil${visible ? " visible" : ""}`} inert={!visible}>
      {children}
    </div>
  );
}
