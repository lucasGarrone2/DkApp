'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import SortSelect from '@/components/SortSelect';
import ListingGrid from '@/components/ListingGrid';
import ComparisonDrawer from '@/components/ComparisonDrawer';
import { useListings } from '@/hooks/useListings';
import { Filters, SortOption, Listing } from '@/types/listing';

export default function Home() {
  const [peopleCount, setPeopleCount] = useState<number>(3); // Default group size: 3 people
  const [comparedListings, setComparedListings] = useState<Listing[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    priceMin: null,
    priceMax: null,
    roomsMin: null,
    sizeMin: null,
    locations: [],
    platforms: [],
    cprOnly: false,
    cprMin: null, // Dynamic CPR dropdown filter (null = all, 1, 2, 3)
    furnishedOnly: false,
    periodType: 'all',
    statusFilter: 'all',
    recommendedOnly: false,
  });

  // Default sort is price asc (Menor precio a mayor precio)
  const [sort, setSort] = useState<SortOption>('price_asc');

  const {
    listings,
    loading,
    error,
    count,
    updateListingStatus,
    toggleFavorite,
    updateListingNotes,
  } = useListings(filters, sort);

  const handleRemoveCompared = (id: string) => {
    setComparedListings(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-[#080d1a] relative overflow-x-hidden">
      
      {/* Subtle top ambient glow for deep navy aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <Header
        peopleCount={peopleCount}
        onPeopleCountChange={setPeopleCount}
        count={count}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-20 z-10 flex-shrink-0">
            <FilterBar filters={filters} onFilterChange={setFilters} peopleCount={peopleCount} />
          </aside>

          {/* Main Listings Section */}
          <section className="flex-grow w-full min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              
              {comparedListings.length > 0 && (
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  📊 Comparar {comparedListings.length} departamentos side-by-side
                </button>
              )}

              <div className="ml-auto">
                <SortSelect sort={sort} onSortChange={setSort} />
              </div>
            </div>

            <ListingGrid
              listings={listings}
              loading={loading}
              error={error}
              count={count}
              peopleCount={peopleCount}
              onStatusChange={updateListingStatus}
              onToggleFavorite={toggleFavorite}
              onUpdateNotes={updateListingNotes}
            />
          </section>

        </div>
      </main>

      {showComparisonModal && (
        <ComparisonDrawer
          listings={comparedListings}
          peopleCount={peopleCount}
          onClose={() => setShowComparisonModal(false)}
          onRemove={handleRemoveCompared}
        />
      )}
    </div>
  );
}
