import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const texto = localFont({
  src: [
    { path: "../fonts/Inter-Regular.otf", weight: "400" },
    { path: "../fonts/Inter-Medium.otf", weight: "500" },
  ],
  variable: "--f-texto",
  display: "swap",
});
const titulo = localFont({
  src: [
    { path: "../fonts/plus-jakarta-sans-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/plus-jakarta-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--f-titulo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Electricidad básica · La guía de Bajo Tensión",
  description:
    "La guía ilustrada para entender la electricidad de tu casa: tablero, térmicas, disyuntor, cables, enchufes y qué hacer cuando algo falla.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: { locale: "es_AR", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f7f6f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${texto.variable} ${titulo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
