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
    threeCprOnly: false,
    furnishedOnly: false,
    periodType: 'all',
    statusFilter: 'all',
    recommendedOnly: false,
  });

  const [sort, setSort] = useState<SortOption>('score_desc');

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
    <>
      <Header
        peopleCount={peopleCount}
        onPeopleCountChange={setPeopleCount}
        count={count}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-24">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Main Listings Section */}
          <section className="flex-grow w-full min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              
              {comparedListings.length > 0 && (
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
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
    </>
  );
}
