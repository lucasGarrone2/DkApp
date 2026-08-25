export const metadata = {
  title: 'Aviso Legal y Términos de Uso — DK Rentals',
  description: 'Información legal, términos de uso, disclaimer de responsabilidad y políticas de indexación de DK Rentals.',
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Aviso Legal y Términos de Uso
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Última actualización: Agosto 2026
        </p>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
            <h2 className="text-base font-bold text-blue-900 dark:text-blue-200 mb-1">
              🌱 Proyecto Personal Sin Fines de Lucro
            </h2>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              DK Rentals es un proyecto personal, gratuito y de código abierto desarrollado como herramienta comunitaria 
              para facilitar la búsqueda de vivienda a expatriados y participantes del programa Working Holiday en Copenhague. 
              <strong> No tiene fines de lucro, no vende servicios ni cobra comisiones.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Naturaleza del Servicio</h2>
            <p>
              DK Rentals es un <strong>motor de búsqueda y agregador de información pública</strong> sobre alquileres 
              inmobiliarios en el área metropolitana de Copenhague, Dinamarca. No somos una inmobiliaria, portal de clasificados, 
              arrendador ni intermediario. No intervenimos en contratos de arrendamiento ni en transacciones económicas entre 
              usuarios y anunciantes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Propiedad Intelectual y Fuentes de Datos</h2>
            <p>
              Todos los listados de propiedades indexados en este sitio provienen de fuentes de acceso público en Internet. 
              Los derechos de autor sobre las descripciones, marcas y logotipos corresponden a sus respectivos titulares. 
              DK Rentals indexa únicamente metadatos factuales (precio, ubicación, número de habitaciones, tamaño) y 
              proporciona enlaces directos a las publicaciones originales.
            </p>
            <p className="mt-2 font-semibold">
              DK Rentals no almacena ni redistribuye imágenes de los portales indexados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Exactitud de la Información</h2>
            <p>
              Los datos mostrados pueden estar desactualizados, ser inexactos o incompletos. Los precios, disponibilidad y condiciones 
              pueden haber cambiado desde la última indexación. Para información actualizada, visite siempre el portal original a través del enlace proporcionado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Scoring Algorítmico</h2>
            <p>
              El puntaje de recomendación (&ldquo;Match Score&rdquo;) es un cálculo algorítmico orientativo basado en criterios generales 
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
              DK Rentals se proporciona &ldquo;tal cual&rdquo; (as-is) sin garantías de ningún tipo. No nos responsabilizamos por pérdidas, 
              daños o perjuicios derivados del uso de la información mostrada en la plataforma, incluyendo decisiones de alquiler 
              basadas en el scoring algorítmico o en los datos agregados.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
