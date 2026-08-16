'use client';

import { SortOption } from '@/types/listing';

interface SortSelectProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortSelect({ sort, onSortChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ordenar por:</span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
      >
        <option value="score_desc">🎯 Mejor puntuados para el grupo</option>
        <option value="price_asc">💰 Menor precio a mayor precio</option>
        <option value="newest">🕒 Más recientes primero</option>
        <option value="move_in_cost">🔑 Menor costo de entrada (Move-in Cost)</option>
        <option value="price_desc">📈 Mayor precio a menor precio</option>
        <option value="price_per_m2">📐 Mejor relación DKK / m²</option>
      </select>
    </div>
  );
}
