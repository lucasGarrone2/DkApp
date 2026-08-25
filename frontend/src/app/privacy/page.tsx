export const metadata = {
  title: 'Política de Privacidad — DK Rentals',
  description: 'Información sobre el tratamiento de datos personales conforme al Reglamento General de Protección de Datos (RGPD / GDPR).',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Política de Privacidad
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Conforme al Reglamento (UE) 2016/679 (RGPD / GDPR) · Última actualización: Agosto 2026
        </p>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
            <h2 className="text-base font-bold text-blue-900 dark:text-blue-200 mb-1">
              🌱 Proyecto Personal Sin Fines de Lucro
            </h2>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              DK Rentals es un proyecto personal, gratuito y de código abierto desarrollado con fines comunitarios. 
              <strong> No recopilamos datos personales con fines comerciales, no vendemos datos a terceros ni mostramos publicidad.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Responsable del Tratamiento</h2>
            <p>
              DK Rentals es operado de forma independiente como proyecto personal de código abierto. Para cualquier consulta sobre privacidad 
              o ejercicio de derechos, puede contactar al responsable en: <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">lucasgarrone4@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Datos que Recopilamos</h2>
            <div className="space-y-2">
              <p><strong>A. Datos de listados inmobiliarios (fuentes públicas):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Título y descripción del anuncio</li>
                <li>Precio de alquiler, depósito y costos asociados</li>
                <li>Ubicación geográfica general (barrio, código postal)</li>
                <li>Características del inmueble (m², habitaciones, amueblado, condiciones de registro CPR)</li>
                <li>URL original del anuncio público</li>
              </ul>
              <p className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                Nota: No indexamos ni almacenamos nombres personales, números de teléfono ni direcciones de correo electrónico de los arrendadores.
              </p>

              <p className="pt-2"><strong>B. Datos de navegación de los usuarios:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>No utilizamos cookies de seguimiento publicitario.</li>
                <li>El almacenamiento local (localStorage) se utiliza exclusivamente para guardar preferencias del usuario (modo oscuro, filtros seleccionados) en su propio dispositivo.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Base Jurídica del Tratamiento</h2>
            <p>
              El tratamiento de datos de listados públicos se fundamenta en el <strong>interés legítimo</strong> (Art. 6.1.f RGPD) 
              de proporcionar un servicio de indexación y comparación de información pública sobre vivienda para la comunidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Finalidad del Tratamiento</h2>
            <p>
              Los datos se procesan exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Permitir la búsqueda y filtrado de opciones de alquiler en Copenhague.</li>
              <li>Calcular puntuaciones orientativas de compatibilidad (Scoring Algorítmico).</li>
              <li>Facilitar el acceso al portal original donde se encuentra publicado el anuncio.</li>
            </ul>
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
              <li><strong>Supresión</strong> (Art. 17): Solicitar la eliminación de sus datos (&ldquo;derecho al olvido&rdquo;).</li>
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Modificaciones a esta Política</h2>
            <p>
              Esta política puede actualizarse periódicamente. La versión más reciente siempre estará disponible en este enlace 
              con la fecha de última actualización indicada al inicio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
