'use client';

import { Listing } from '@/types/listing';
import ListingCard from '@/components/ListingCard';

interface ListingGridProps {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  count: number;
  peopleCount: number;
  onStatusChange: (id: string, newStatus: Listing['status']) => void;
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onUpdateNotes: (id: string, notes: string, contactedBy: string) => void;
}

export default function ListingGrid({
  listings,
  loading,
  error,
  count,
  peopleCount,
  onStatusChange,
  onToggleFavorite,
  onUpdateNotes,
}: ListingGridProps) {
  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-6 rounded-2xl text-center my-6">
        <p className="text-rose-700 dark:text-rose-300 font-bold text-sm mb-1">
          ❌ Error al cargar publicaciones
        </p>
        <p className="text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
        <span>
          Mostrando <strong className="text-slate-900 dark:text-white font-bold">{listings.length}</strong> de{' '}
          <strong className="text-slate-900 dark:text-white font-bold">{count}</strong> opciones encontradas (÷ {peopleCount} personas)
        </span>
        {loading && <span className="animate-pulse text-blue-600 dark:text-blue-400 font-bold">Actualizando...</span>}
      </div>

      {/* Grid or Skeletons */}
      {loading && listings.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl h-[380px] animate-pulse border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
            >
              <div className="bg-slate-200 dark:bg-slate-700 h-44 w-full" />
              <div className="p-5 space-y-3 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-8 bg-slate-100 dark:bg-slate-700/50 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center my-6 bg-white/50 dark:bg-slate-900/50">
          <div className="text-4xl mb-3">🏡</div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">
            No se encontraron departamentos
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
            Prueba ajustando o limpiando los filtros para ver más opciones disponibles en Copenhague.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              peopleCount={peopleCount}
              onStatusChange={onStatusChange}
              onToggleFavorite={onToggleFavorite}
              onUpdateNotes={onUpdateNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
