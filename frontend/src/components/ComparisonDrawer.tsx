'use client';

import { Listing } from '@/types/listing';
import { calculateListingMatch } from '@/lib/recommendationScore';
import { formatPrice, calculateMoveInCost, calculateCostPerPerson } from '@/utils/format';

interface ComparisonDrawerProps {
  listings: Listing[];
  peopleCount: number;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function ComparisonDrawer({
  listings,
  peopleCount,
  onClose,
  onRemove,
}: ComparisonDrawerProps) {
  if (listings.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              📊 Comparador de Departamentos Side-by-Side
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparando {listings.length} departamentos divididos por {peopleCount} personas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Comparison Table Content */}
        <div className="p-6 overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40 min-w-[140px]">
                  Criterio
                </th>
                {listings.map((item) => {
                  const match = calculateListingMatch(item);
                  return (
                    <th key={item.id} className="p-3 font-bold text-slate-900 dark:text-white min-w-[240px]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="line-clamp-2 text-sm font-extrabold">{item.title}</span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-rose-500 hover:text-rose-700 text-sm font-bold ml-1"
                          title="Quitar de comparación"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                        🎯 {match.score}% {match.label}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Row 1: Price Total */}
              <tr>
                <td className="p-3 font-bold text-slate-500 dark:text-slate-400">Precio Mensual Total</td>
                {listings.map((item) => (
                  <td key={item.id} className="p-3 font-extrabold text-slate-900 dark:text-white text-xs">
                    {formatPrice(item.price_dkk)}
                  </td>
                ))}
              </tr>

              {/* Row 2: Price per person */}
              <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-bold">
                <td className="p-3 text-blue-900 dark:text-blue-200">👥 Alquiler por Persona (÷ {peopleCount})</td>
                {listings.map((item) => (
                  <td key={item.id} className="p-3 text-blue-700 dark:text-blue-400 text-xs font-extrabold">
                    {formatPrice(calculateCostPerPerson(item.price_dkk, peopleCount))} / mes
                  </td>
                ))}
              </tr>

              {/* Row 3: Move-in Cost Total */}
              <tr>
                <td className="p-3 font-bold text-slate-500 dark:text-slate-400">Costo Inicial Total (Move-in)</td>
                {listings.map((item) => {
                  const total = calculateMoveInCost(item.price_dkk, item.deposit_dkk, item.prepaid_rent_dkk);
                  return (
                    <td key={item.id} className="p-3 font-bold text-slate-900 dark:text-white text-xs">
                      {formatPrice(total)}
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Move-in Cost Per Person */}
              <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-bold">
                <td className="p-3 text-blue-900 dark:text-blue-200">🔑 Costo Inicial por Persona (÷ {peopleCount})</td>
                {listings.map((item) => {
                  const total = calculateMoveInCost(item.price_dkk, item.deposit_dkk, item.prepaid_rent_dkk);
                  const perPerson = calculateCostPerPerson(total, peopleCount);
                  return (
                    <td key={item.id} className="p-3 text-blue-700 dark:text-blue-400 text-xs font-extrabold">
                      {formatPrice(perPerson)} total inicial
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Rooms & Size */}
              <tr>
                <td className="p-3 font-bold text-slate-500 dark:text-slate-400">Distribución</td>
                {listings.map((item) => (
                  <td key={item.id} className="p-3 text-slate-700 dark:text-slate-300">
                    📐 {item.size_m2 || '–'} m² · 🛏️ {item.rooms || '–'} hab.
                  </td>
                ))}
              </tr>

              {/* Row 6: CPR */}
              <tr>
                <td className="p-3 font-bold text-slate-500 dark:text-slate-400">Registro CPR</td>
                {listings.map((item) => (
                  <td key={item.id} className="p-3 font-bold">
                    {item.cpr_allowed === true ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ Permite CPR</span>
                    ) : item.cpr_allowed === false ? (
                      <span className="text-rose-600 dark:text-rose-400">⚠️ No permite CPR</span>
                    ) : (
                      <span className="text-slate-400">? Sin especificar</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 7: Location */}
              <tr>
                <td className="p-3 font-bold text-slate-500 dark:text-slate-400">Ubicación</td>
                {listings.map((item) => (
                  <td key={item.id} className="p-3 text-slate-700 dark:text-slate-300">
                    📍 {item.location_name || 'Copenhague'}
                  </td>
                ))}
              </tr>

              {/* Row 8: Recommendation Pros */}
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Puntos a favor</td>
                {listings.map((item) => {
                  const match = calculateListingMatch(item);
                  return (
                    <td key={item.id} className="p-3 space-y-1 align-top text-slate-700 dark:text-slate-300">
                      {match.pros.map((p, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">✓</span> {p}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>

              {/* Row 9: Recommendation Cons */}
              <tr>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">Contras / Riesgos</td>
                {listings.map((item) => {
                  const match = calculateListingMatch(item);
                  return (
                    <td key={item.id} className="p-3 space-y-1 align-top text-slate-700 dark:text-slate-300">
                      {match.cons.map((c, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span className="text-rose-500 font-bold">⚠️</span> {c}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
