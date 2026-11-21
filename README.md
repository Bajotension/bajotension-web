# Web de venta de la guía · Bajo Tensión

Portada con precio y 3 páginas de muestra, ingreso con Google, cobro con Mercado Pago,
biblioteca y lector online con marca de agua. Máximo 2 dispositivos por cuenta.
El diseño y la revisión de riesgos están en [DISENO.md](DISENO.md).

**Estado: modo prueba.** No cobra dinero real hasta poner credenciales de producción y `MP_MODO=produccion`.

## Puesta en marcha (modo prueba, todo gratis)

Hacelo en este orden. Cada paso deja algo que el siguiente necesita. Claude puede guiarte en cada pantalla.

**Paso 1 · GitHub (donde vive el código).** Entrá a github.com → New repository → nombre `bajotension-web`, **Private**, sin README. Avisale a Claude: sube el código.

**Paso 2 · Supabase (cuentas y base de datos).** supabase.com → New project → nombre `bajotension`, región *South America (São Paulo)*, generá una contraseña y guardala.
- SQL Editor → New query → pegá todo `supabase/esquema.sql` → Run.
- Project Settings → API: copiá *Project URL*, *anon public* y *service_role* (esta última es secreta).

**Paso 3 · Netlify (el sitio online).** netlify.com → entrar con GitHub → Add new site → Import from GitHub → `bajotension-web` → Deploy.
- Te da una dirección tipo `https://bajotension.netlify.app` (se puede renombrar en Site configuration).
- Site configuration → Environment variables: cargá las de `.env.example` (las de Supabase del paso 2; `NEXT_PUBLIC_SITE_URL` = tu dirección de Netlify; tus datos de vendedor). Las de Mercado Pago van en el paso 5.

**Paso 4 · Botón de Google.** console.cloud.google.com → crear proyecto `Bajo Tension` → APIs y servicios → Pantalla de consentimiento (Externo, nombre "Bajo Tensión", tu email) → Credenciales → Crear ID de cliente OAuth → Aplicación web.
- Orígenes autorizados: tu dirección de Netlify.
- URI de redirección: `https://<tu-proyecto>.supabase.co/auth/v1/callback`.
- Copiá Client ID y Client Secret → Supabase → Authentication → Sign In / Providers → Google → pegarlos → Save.
- Supabase → Authentication → URL Configuration: *Site URL* = tu dirección de Netlify; *Redirect URLs* = `https://<tu-dirección>/auth/callback`.

**Paso 5 · Mercado Pago (cobros de prueba).** mercadopago.com.ar/developers → Tus integraciones → Crear aplicación (Pagos online, Checkout Pro).
- Cuentas de prueba: creá un **vendedor** y un **comprador** de prueba.
- Entrá con el vendedor de prueba a Developers → Credenciales de producción de esa cuenta → copiá el *Access Token* → en Netlify `MP_ACCESS_TOKEN`, y `MP_MODO=prueba`.
- Webhooks → URL `https://<tu-dirección>/api/mp/webhook`, evento **Pagos** → Guardar → copiá la *clave secreta* → en Netlify `MP_WEBHOOK_SECRET`.
- Netlify → Deploys → Trigger deploy (para que tome las variables).

**Paso 6 · Probar todo.** Entrá a la web → Comprar → ingresá con Google → pagá con el comprador de prueba y una tarjeta de prueba de Mercado Pago → tenés que volver a la web con la guía en tu biblioteca. Probá abrirla en un tercer navegador: el primero se tiene que cerrar.

**Paso 7 · La guía.** Exportá la guía como imágenes (una por página) y pasáselas a Claude: las sube con `scripts/subir-guia.mjs` y te dice qué número poner en `GUIA_PAGINAS`. Reemplazá también `public/muestra/pagina-1/2/3.webp` por las 3 páginas elegidas.

**Paso 8 · Dominio.** Registrá bajotension.ar en nic.ar → en Netlify, Domain management → Add domain → seguí los pasos de DNS. Después actualizá la dirección en Google, Supabase, Mercado Pago y `NEXT_PUBLIC_SITE_URL`.

### Cómo se atiende un arrepentimiento
Los pedidos llegan a Supabase → Table editor → `arrepentimientos`. Devolvé el dinero desde Mercado Pago (Actividad → la venta → Devolver). El aviso de Mercado Pago le quita el acceso a la guía solo. Después marcá `resuelto` con la fecha.

## Para probar en la PC
```
npm install
npm run dev       # abre http://localhost:3000
npm run probar    # pruebas de marca de agua, firma de pagos y redirecciones
```

## Pasar a cobro real (solo cuando Danik lo decida)
Cambiar `MP_ACCESS_TOKEN` por el de producción de tu cuenta real, `MP_MODO=produccion`, completar los datos de vendedor y tener monotributo para facturar (con el QR de Data Fiscal de ARCA en el pie, si corresponde).
