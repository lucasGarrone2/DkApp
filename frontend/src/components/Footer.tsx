'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-4">
        
        {/* Legal Disclaimer */}
        <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-4">
          <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            <strong>⚠️ Aviso Legal:</strong> DK Rentals es un servicio de indexación y búsqueda que agrega información pública de portales inmobiliarios de terceros. 
            No somos un portal inmobiliario, una agencia de alquiler ni un intermediario. Los listados mostrados pertenecen a sus respectivos portales de origen 
            y pueden no reflejar la disponibilidad actual. El scoring de conveniencia es un cálculo algorítmico orientativo y no constituye asesoramiento inmobiliario ni financiero.
          </p>
        </div>

        {/* Links and Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/legal" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
              Términos de Servicio
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
              Política de Privacidad
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link href="/bot-info" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
              Sobre nuestro Bot
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>
              📧 Takedown / Contacto: <a href="mailto:lucasgarrone4@gmail.com" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">lucasgarrone4@gmail.com</a>
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center">
          © {new Date().getFullYear()} DK Rentals — Proyecto personal de búsqueda de alquileres en Copenhague. No afiliado con ningún portal de origen.
        </p>
      </div>
    </footer>
  );
}
