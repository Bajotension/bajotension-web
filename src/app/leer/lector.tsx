"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const CLAVE = "bt-ultima-pagina";

export function Lector({ total, titulo }: { total: number; titulo: string }) {
  const [pagina, setPagina] = useState(1);
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando");
  const [mensaje, setMensaje] = useState("");
  const [src, setSrc] = useState<string | null>(null);
  const toque = useRef<number | null>(null);

  useEffect(() => {
    try {
      const n = Number(localStorage.getItem(CLAVE));
      if (n >= 1 && n <= total) setPagina(n);
    } catch {}
  }, [total]);

  useEffect(() => {
    let cancelado = false;
    let url: string | null = null;
    setEstado("cargando");
    fetch(`/api/pagina/${pagina}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/auth/salir?motivo=sesion-cerrada";
          return;
        }
        if (r.status === 429) throw new Error("Leíste muchas páginas seguidas. Esperá un rato y seguí.");
        if (!r.ok) throw new Error("No se pudo cargar la página.");
        url = URL.createObjectURL(await r.blob());
        if (!cancelado) {
          setSrc(url);
          setEstado("ok");
        }
      })
      .catch((e: Error) => {
        if (!cancelado) {
          setMensaje(e.message);
          setEstado("error");
        }
      });
    try {
      localStorage.setItem(CLAVE, String(pagina));
    } catch {}
    window.scrollTo({ top: 0 });
    return () => {
      cancelado = true;
      if (url) setTimeout(() => URL.revokeObjectURL(url!), 1000);
    };
  }, [pagina]);

  const ir = useCallback((n: number) => setPagina(Math.min(total, Math.max(1, n))), [total]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(pagina + 1);
      if (e.key === "ArrowLeft") ir(pagina - 1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [pagina, ir]);

  return (
    <div className="lector" onContextMenu={(e) => e.preventDefault()}>
      <header className="lector-barra">
        <Link href="/biblioteca" className="enlace">← Biblioteca</Link>
        <span className="lector-titulo">{titulo}</span>
        <span className="tenue">{pagina} / {total}</span>
      </header>

      <div
        className="lector-hoja"
        onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toque.current == null) return;
          const dx = e.changedTouches[0].clientX - toque.current;
          if (Math.abs(dx) > 60) ir(pagina + (dx < 0 ? 1 : -1));
          toque.current = null;
        }}
      >
        {estado === "error" ? (
          <p className="aviso">{mensaje}</p>
        ) : (
          src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Página ${pagina}`}
              draggable={false}
              className={estado === "cargando" ? "cargando" : ""}
            />
          )
        )}
      </div>

      <nav className="lector-nav">
        <button className="boton secundario" onClick={() => ir(pagina - 1)} disabled={pagina <= 1}>Anterior</button>
        <button className="boton" onClick={() => ir(pagina + 1)} disabled={pagina >= total}>Siguiente</button>
      </nav>
    </div>
  );
}
