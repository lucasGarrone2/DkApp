'use client';

import { useState, useEffect } from 'react';
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

const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever listings change (filters or sort updated)
  useEffect(() => {
    setCurrentPage(1);
  }, [listings.length, count]);

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-6 rounded-2xl text-center my-6">
        <p className="text-rose-700 dark:text-rose-300 font-bold text-sm mb-1">
          ❌ Error al cargar departamentos
        </p>
        <p className="text-rose-600 dark:text-rose-400 text-xs">
          {error}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, listings.length);
  const currentListings = listings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
        <div className="flex items-center gap-2">
          <span>
            {listings.length > 0 ? (
              <>
                Mostrando <strong className="text-slate-900 dark:text-white font-bold">{startIndex + 1}-{endIndex}</strong> de{' '}
                <strong className="text-slate-900 dark:text-white font-bold">{listings.length}</strong> propiedades
              </>
            ) : (
              <>
                <strong className="text-slate-900 dark:text-white font-bold">0</strong> propiedades
              </>
            )}
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline text-blue-600 dark:text-blue-400 font-semibold">
            Presupuesto dividido en {peopleCount} personas
          </span>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"></span>
            Actualizando...
          </span>
        )}
      </div>

      {/* Grid or Skeletons */}
      {loading && listings.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0f172a] rounded-2xl h-[420px] animate-pulse border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <div className="bg-slate-200 dark:bg-slate-800 h-48 w-full" />
              <div className="p-5 space-y-3 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center my-6 bg-white/60 dark:bg-[#0f172a]/60 backdrop-blur-sm">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center text-2xl">
            🏡
          </div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">
            No se encontraron departamentos con estos filtros
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
            Prueba relajando los filtros de precio, habitaciones o zonas para ver más opciones disponibles en Copenhague.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentListings.map((listing) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 pb-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full px-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-xs font-bold rounded-xl border transition-all flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
