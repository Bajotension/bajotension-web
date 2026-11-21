# Diseño de la web de venta (bajotension.ar)

Fecha: 21/11/2026 · Estado: **modo prueba**, nada publicado ni cobrado.

## Qué hace
1. **Portada**: propuesta de valor, precio, botón de compra, 3 páginas de muestra (imágenes que elige Danik).
2. **Ingreso con Google** (Supabase Auth). La compra queda atada a esa cuenta.
3. **Pago con Mercado Pago** (Checkout Pro). Un aviso automático (webhook) habilita el acceso.
4. **Biblioteca y lector**: la guía se lee en la web, página por página, como imagen con marca de agua (nombre + email + fecha). No hay archivo para descargar.
5. **Máximo 2 dispositivos** activos por cuenta (PC y celular). Al entrar en un tercero, se cierra el más viejo.

## Piezas
| Pieza | Servicio | Costo en prueba |
|---|---|---|
| Web (Next.js) | Netlify o Vercel | gratis |
| Login, base de datos, páginas privadas | Supabase (Google + Postgres + Storage privado) | gratis |
| Cobro | Mercado Pago, credenciales de prueba | gratis |
| Dominio | bajotension.ar (nic.ar) | lo registra Danik |

## Flujo de compra
1. Usuario toca **Comprar** → si no ingresó, va a Google y vuelve.
2. El servidor crea una **orden** (id único, precio fijado en el servidor) y una preferencia de Mercado Pago con ese id como referencia.
3. Mercado Pago avisa al webhook. El servidor **no confía en el aviso**: consulta el pago a la API de Mercado Pago con su token y exige estado `approved`, moneda ARS, monto ≥ precio de la orden y referencia = id de la orden. Recién ahí habilita.
4. La página de regreso hace la misma verificación (por si el aviso tarda).
5. Si el pago después se **devuelve o contracargo**, el webhook quita el acceso.

## Revisión crítica (riesgos y qué hace la web)
| Riesgo | Mitigación | Lo que queda |
|---|---|---|
| Aviso de pago falso | Firma `x-signature` verificada + consulta del pago real a la API | Ninguno relevante |
| Pagar menos cambiando el precio | Precio sólo en el servidor; se compara el monto cobrado | — |
| Reusar un pago para otra cuenta | El pago se vincula a la orden, y la orden a una sola cuenta | — |
| Pago aprobado y después contracargo | Webhook revoca el acceso | Se pierde la venta, como en cualquier tienda |
| Compartir la cuenta | Máx. 2 dispositivos + máx. 6 dispositivos nuevos por mes; más que eso bloquea y pide contacto | Dos personas pueden compartir 2 lugares |
| Bajar las páginas con un robot | Imágenes sólo para compradores con sesión válida, sin caché, límite de 300 páginas por hora | Alguien con paciencia puede capturar pantalla |
| Capturas de pantalla / fotos | **No se puede impedir en la web.** La marca de agua con nombre y email disuade y permite saber quién filtró | Riesgo aceptado |
| Texto oculto en la vista previa | La vista previa son 3 imágenes públicas; el resto nunca llega al navegador sin pago | — |
| Robo de la cuenta de Google del cliente | Depende de Google | — |
| Claves filtradas | Claves sólo en variables del hosting, nunca en el código | Danik debe no compartirlas |
| Hosting gratis | Vercel gratis **no permite uso comercial**; Netlify gratis sí. Antes de cobrar real: Netlify o Vercel Pro | Decidir antes de lanzar |
| Impuestos | Cobrar en serio requiere monotributo y factura (ARCA) | Fuera de la web; consultarlo con contador |

## Precio propuesto
- Referencias encontradas: ebooks de ficción en Argentina ARS 2.500–6.000 (más de 8.000 "suena caro" sin marca fuerte); guías/manuales técnicos 30–60% más; libros de ejercicios completos de 50+ páginas ARS 6.000–15.000.
- La guía es de nicho, ilustrada a color, con marca propia y público que ya la conoce por los videos: va en la parte alta.
- **Propuesta: lanzamiento ARS 9.900, después ARS 14.900** (igual que el plan anterior). Mercado Pago se queda con una comisión por venta.
- Límite de la investigación: Mercado Libre y Hotmart no dejaron leer precios automáticamente; conviene mirar 2 o 3 a mano antes de lanzar.

## Lo que falta de Danik
- Elegir las 3 páginas de muestra y pasar la guía terminada (PDF).
- Crear cuentas: Supabase, Google Cloud (para el botón de Google), Mercado Pago Developers, hosting. Se puede hacer juntos paso a paso.
- Registrar bajotension.ar.
