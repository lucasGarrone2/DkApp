import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://dk-app-woad.vercel.app'),
  title: "DK Rentals — Búsqueda de Alquileres en Copenhague",
  description: "Proyecto personal y comunitario gratuito para buscar y comparar departamentos en Copenhague (registro CPR, costos por persona, zonas).",
  openGraph: {
    title: "DK Rentals — Búsqueda de Alquileres en Copenhague",
    description: "Herramienta gratuita y comunitaria para buscar y comparar departamentos en Copenhague. Filtros por registro CPR, división de gastos por grupo y zonas.",
    url: "https://dk-app-woad.vercel.app",
    siteName: "DK Rentals",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DK Rentals Copenhagen — Búsqueda de Alquileres para la Comunidad",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DK Rentals — Búsqueda de Alquileres en Copenhague",
    description: "Herramienta gratuita y comunitaria para buscar alquileres en Copenhague.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900/50 dark:selection:text-blue-100 flex flex-col`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
