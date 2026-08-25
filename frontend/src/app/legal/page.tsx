import Link from 'next/link';

export const metadata = {
  title: 'Términos de Servicio — DK Rentals',
  description: 'Términos y condiciones de uso de DK Rentals.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#080d1a]">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <Link href="/" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold mb-6 inline-block">← Volver al inicio</Link>
        
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Términos de Servicio</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">Última actualización: Agosto 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Naturaleza y Propósito del Servicio</h2>
            <p>
              DK Rentals es un <strong>proyecto personal, 100% gratuito y sin fines de lucro</strong>, nacido como un experimento por una necesidad propia de búsqueda de alojamiento en Copenhague. Su única finalidad es servir como herramienta comunitaria de apoyo para ayudar a las personas a buscar y comparar viviendas en Dinamarca. 
            </p>
            <p>
              La plataforma actúa únicamente como un servicio de <strong>indexación, búsqueda y redirección</strong> que agrega metadatos factuales públicos (precio, tamaño, habitaciones, ubicación) de listados de alquiler publicados en portales inmobiliarios de terceros.
            </p>
            <p>
              <strong>No es un portal inmobiliario, agencia de alquiler ni intermediario comercial.</strong> No se cobra dinero, no se gestionan reservas, no se cobran depósitos y no persigue ningún fin comercial ni de monetización.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Datos de Terceros</h2>
            <p>
              Los listados mostrados provienen de portales de terceros y son propiedad de sus respectivos anunciantes y plataformas. 
              DK Rentals únicamente indexa metadatos factuales (precio, m², habitaciones, barrio) y proporciona un enlace directo al anuncio original.
            </p>
            <p>
              No almacenamos fotografías, datos de contacto personal de anunciantes, ni textos completos de los anuncios.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Sin Garantía de Exactitud</h2>
            <p>
              Los datos mostrados pueden estar desactualizados, ser inexactos o incompletos. Los precios, disponibilidad y condiciones 
              pueden haber cambiado desde la última indexación. Para información actualizada, visite siempre el portal original a través del enlace proporcionado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Scoring Algorítmico</h2>
            <p>
              El puntaje de recomendación ("Match Score") es un cálculo algorítmico orientativo basado en criterios generales 
              (precio por persona, tamaño, ubicación, condiciones de registro CPR). <strong>No constituye asesoramiento inmobiliario, 
              financiero ni legal.</strong> Las decisiones de alquiler son responsabilidad exclusiva del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Redirección al Portal Original</h2>
            <p>
              Toda interacción con el anunciante (contacto, solicitud de visita, firma de contrato, pago de depósito) ocurre 
              exclusivamente en el portal de origen. DK Rentals no tiene relación comercial, de agencia ni de intermediación 
              con los anunciantes ni con los portales indexados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Solicitudes de Remoción (Takedown)</h2>
            <p>
              Si usted es propietario de un portal indexado o un anunciante y desea que sus listados sean removidos de DK Rentals, 
              contáctenos a <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">lucasgarrone4@gmail.com</a>. 
              Procesaremos su solicitud dentro de las 72 horas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Limitación de Responsabilidad</h2>
            <p>
              DK Rentals se proporciona "tal cual" (as-is) sin garantías de ningún tipo. No nos responsabilizamos por pérdidas, 
              daños o perjuicios derivados del uso de la información mostrada en la plataforma, incluyendo decisiones de alquiler 
              basadas en el scoring algorítmico o en los datos agregados.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
