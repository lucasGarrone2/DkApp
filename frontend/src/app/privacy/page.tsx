import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad — DK Rentals',
  description: 'Política de privacidad y protección de datos de DK Rentals conforme al RGPD.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#080d1a]">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <Link href="/" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold mb-6 inline-block">← Volver al inicio</Link>
        
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Política de Privacidad</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">Última actualización: Agosto 2026 · Conforme al Reglamento General de Protección de Datos (RGPD/GDPR) de la UE</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Responsable del Tratamiento</h2>
            <p>
              DK Rentals es un <strong>proyecto personal y comunitario sin fines de lucro</strong> operado por Lucas Garrone con el único fin de ayudar a la búsqueda de alojamiento en Copenhague.<br />
              📧 Contacto: <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">lucasgarrone4@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Datos que Procesamos</h2>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">2.1 Datos agregados de listados inmobiliarios</h3>
            <p>Recopilamos exclusivamente <strong>metadatos factuales</strong> de listados de alquiler publicados públicamente en portales inmobiliarios daneses:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Precio mensual (DKK)</li>
              <li>Tamaño (m²) y cantidad de habitaciones</li>
              <li>Barrio / código postal</li>
              <li>Condiciones del contrato (período, amoblado, registro CPR)</li>
              <li>URL directa al anuncio original</li>
            </ul>
            <p className="mt-2"><strong>NO almacenamos:</strong> fotografías de los listados, nombres de anunciantes, números de teléfono, direcciones de email, ni ningún dato de contacto personal.</p>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">2.2 Datos de usuarios de la plataforma</h3>
            <p>Actualmente DK Rentals no requiere registro de usuarios. No recopilamos datos personales de los visitantes de la plataforma más allá de logs técnicos estándar del servidor (dirección IP, tipo de navegador) procesados por Vercel según su propia política de privacidad.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Base Legal del Tratamiento (Art. 6 RGPD)</h2>
            <p>
              La indexación de metadatos factuales de listados inmobiliarios públicos se fundamenta en el <strong>interés legítimo</strong> (Art. 6(1)(f) RGPD) 
              de facilitar la búsqueda de vivienda en Copenhague mediante la agregación y comparación de información pública de mercado sin fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Fuentes de Datos (Art. 14 RGPD)</h2>
            <p>Los datos de listados se obtienen de portales inmobiliarios daneses de acceso público. Solo indexamos información disponible sin necesidad de autenticación o suscripción, respetando las directivas robots.txt de cada portal.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Retención de Datos</h2>
            <p>
              Los datos de listados se actualizan periódicamente y se eliminan automáticamente cuando un listado deja de estar activo 
              o no se detecta en las indexaciones subsiguientes. Los datos no se retienen por más de 90 días tras la última detección.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Sus Derechos (Arts. 15-21 RGPD)</h2>
            <p>Si usted es un interesado cuyos datos pudieran haber sido procesados, tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Acceso</strong> (Art. 15): Solicitar confirmación de si procesamos datos que le conciernen.</li>
              <li><strong>Rectificación</strong> (Art. 16): Solicitar la corrección de datos inexactos.</li>
              <li><strong>Supresión</strong> (Art. 17): Solicitar la eliminación de sus datos ("derecho al olvido").</li>
              <li><strong>Oposición</strong> (Art. 21): Oponerse al tratamiento basado en interés legítimo.</li>
              <li><strong>Reclamación</strong>: Tiene derecho a presentar una reclamación ante la autoridad de protección de datos danesa (Datatilsynet) en <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">datatilsynet.dk</a>.</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos, contacte a: <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">lucasgarrone4@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Transferencias Internacionales</h2>
            <p>
              Los datos se almacenan en Supabase (infraestructura en la UE). El frontend se sirve a través de Vercel. 
              Ambos proveedores cuentan con mecanismos adecuados de protección de datos conforme al RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Cookies</h2>
            <p>
              DK Rentals utiliza únicamente cookies técnicas esenciales para el funcionamiento de la plataforma (preferencia de tema oscuro/claro). 
              No utilizamos cookies de seguimiento, analíticas ni publicitarias.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
