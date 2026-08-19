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
      threeCprOnly: false,
      furnishedOnly: false,
      periodType: 'all',
      statusFilter: 'all',
      recommendedOnly: false,
    });
  };

  return (
    <div className="w-full flex-shrink-0">
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden w-full py-3 px-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex justify-between items-center shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 text-sm">🔍 Filtros y Preferencias</span>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{isOpen ? '▲ Ocultar' : '▼ Mostrar'}</span>
      </button>

      {/* Independently Scrollable Sticky Sidebar */}
      <div className={`space-y-5 lg:block ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm max-h-[calc(100vh-6.5rem)] overflow-y-auto custom-sidebar-scroll pr-2.5`}>
        
        {/* Header Title */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Filtros de búsqueda
          </h2>
          <button
            onClick={clearFilters}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Limpiar
          </button>
        </div>

        {/* Phase 3: Algorithm Recommendation Filter */}
        <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            🎯 Match Algorítmico (Grupo)
          </h3>
          
          {/* 3 CPRs Mandatory Group Filter */}
          <label className="flex items-center justify-between cursor-pointer group bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 p-3 rounded-xl border border-blue-200/80 dark:border-blue-900/60 transition-all hover:border-blue-300 dark:hover:border-blue-700">
            <div className="flex flex-col pr-2">
              <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1">
                🪪 Apto para 3 CPR
              </span>
              <span className="text-[10px] text-blue-700/80 dark:text-blue-300/80 leading-tight mt-0.5">
                Capacidad y registro legal para 3 personas
              </span>
            </div>
            <input
              type="checkbox"
              checked={filters.threeCprOnly}
              onChange={(e) => updateFilter('threeCprOnly', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-blue-300 dark:border-blue-700 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 transition-all hover:border-emerald-300">
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
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
        <div className="space-y-2.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            🇩🇰 Filtros Dinamarca
          </h3>

          <label className="flex items-center justify-between cursor-pointer group py-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Solo con registro CPR 🪪
            </span>
            <input
              type="checkbox"
              checked={filters.cprOnly}
              onChange={(e) => updateFilter('cprOnly', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group py-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
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
                className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl border transition-all text-left ${
                  filters.statusFilter === item.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rental Period Type */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            ⏳ Período de Contrato
          </h3>
          <div className="flex gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'unlimited', label: 'Ilimitado' },
              { id: 'temporary', label: 'Temporal' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => updateFilter('periodType', item.id)}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                  filters.periodType === item.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Precio Mensual (DKK)
          </h3>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min DKK" 
              className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : null)}
            />
            <span className="text-slate-400 text-xs font-bold">-</span>
            <input 
              type="number" 
              placeholder="Max DKK" 
              className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Habitaciones Mínimas
          </h3>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => updateFilter('roomsMin', filters.roomsMin === num ? null : num)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  filters.roomsMin === num 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {num}{num === 4 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Tamaño Mínimo (m²)
          </h3>
          <input 
            type="number" 
            placeholder="Ej. 60 m²" 
            className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={filters.sizeMin || ''}
            onChange={(e) => updateFilter('sizeMin', e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {/* Neighborhoods */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Zonas / Barrios
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {NEIGHBORHOODS.map(zone => (
              <button
                key={zone}
                onClick={() => toggleArrayItem('locations', zone)}
                className={`px-3 py-1 text-xs rounded-xl border transition-all font-semibold ${
                  filters.locations.includes(zone)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button 
          onClick={clearFilters}
          className="w-full py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
        >
          Restablecer todos los filtros
        </button>
      </div>
    </div>
  );
}
