'use client';

import { Filters } from '@/types/listing';
import { useState } from 'react';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const NEIGHBORHOODS = [
  'Vesterbro', 'Nørrebro', 'Østerbro', 'Amager', 
  'Frederiksberg', 'Indre By', 'Valby', 'NV', 'Brønshøj/Vanløse'
];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = (key: 'locations' | 'platforms', item: string) => {
    const current = filters[key];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFilterChange({
      priceMin: null,
      priceMax: null,
      roomsMin: null,
      sizeMin: null,
      locations: [],
      platforms: [],
      cprOnly: false,
      furnishedOnly: false,
      periodType: 'all',
      statusFilter: 'all',
      recommendedOnly: false,
    });
  };

  return (
    <div className="w-full flex-shrink-0">
      <button 
        className="lg:hidden w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex justify-between items-center shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">🔍 Filtros y Preferencias</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      <div className={`space-y-6 lg:block ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm`}>
        
        {/* Phase 3: Algorithm Recommendation Filter */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            🎯 Match Algorítmico (3 personas)
          </h3>
          <label className="flex items-center justify-between cursor-pointer group bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Solo recomendados (Score ≥ 60%)
            </span>
            <input
              type="checkbox"
              checked={filters.recommendedOnly}
              onChange={(e) => updateFilter('recommendedOnly', e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 dark:border-emerald-700 cursor-pointer"
            />
          </label>
        </div>

        {/* Phase 2: Denmark Specific Toggles */}
        <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            🇩🇰 Filtros Dinamarca
          </h3>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Solo registro de CPR 🪪
            </span>
            <input
              type="checkbox"
              checked={filters.cprOnly}
              onChange={(e) => updateFilter('cprOnly', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Amoblado (Møbleret) 🛋️
            </span>
            <input
              type="checkbox"
              checked={filters.furnishedOnly}
              onChange={(e) => updateFilter('furnishedOnly', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
            />
          </label>
        </div>

        {/* Collaboration & Status Filter */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
            👥 Estado de Grupo
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'favorites', label: '⭐ Favoritos' },
              { id: 'interested', label: '🟡 Interesado' },
              { id: 'applied', label: '🔵 Aplicado' },
              { id: 'rejected', label: '🔴 Descartado' },
              { id: 'new', label: '⚪ Sin revisar' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => updateFilter('statusFilter', item.id)}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-lg border transition-all text-left ${
                  filters.statusFilter === item.id
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rental Period Type */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
            ⏳ Período de Contrato
          </h3>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'unlimited', label: 'Ilimitado' },
              { id: 'temporary', label: 'Temporal' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => updateFilter('periodType', item.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  filters.periodType === item.id
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Precio Mensual (DKK)
          </h3>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : null)}
            />
            <span className="text-slate-400">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Habitaciones Mínimas
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => updateFilter('roomsMin', filters.roomsMin === num ? null : num)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                  filters.roomsMin === num 
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {num}{num === 4 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Tamaño Mínimo (m²)
          </h3>
          <input 
            type="number" 
            placeholder="Mínimo m²" 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={filters.sizeMin || ''}
            onChange={(e) => updateFilter('sizeMin', e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {/* Neighborhoods */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Zonas / Barrios
          </h3>
          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOODS.map(zone => (
              <button
                key={zone}
                onClick={() => toggleArrayItem('locations', zone)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  filters.locations.includes(zone)
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600 font-semibold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={clearFilters}
          className="w-full py-2.5 mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-xl"
        >
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  );
}
