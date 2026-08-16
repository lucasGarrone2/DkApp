import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Listing, Filters, SortOption } from '@/types/listing';
import { calculateListingMatch } from '@/lib/recommendationScore';

export function useListings(filters: Filters, sort: SortOption) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = getSupabase()
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Numeric filters
      if (filters.priceMin !== null) {
        query = query.gte('price_dkk', filters.priceMin);
      }
      if (filters.priceMax !== null) {
        query = query.lte('price_dkk', filters.priceMax);
      }
      if (filters.roomsMin !== null) {
        query = query.gte('rooms', filters.roomsMin);
      }
      if (filters.sizeMin !== null) {
        query = query.gte('size_m2', filters.sizeMin);
      }

      // Location & Platform filters
      if (filters.locations.length > 0) {
        query = query.in('location_name', filters.locations);
      }
      if (filters.platforms.length > 0) {
        query = query.in('source_platform', filters.platforms);
      }

      // Phase 2 Advanced Filters
      if (filters.cprOnly) {
        query = query.eq('cpr_allowed', true);
      }
      if (filters.furnishedOnly) {
        query = query.eq('is_furnished', true);
      }
      if (filters.periodType !== 'all') {
        query = query.eq('rental_period_type', filters.periodType);
      }

      // Status & Favorites Filter
      if (filters.statusFilter === 'favorites') {
        query = query.eq('is_favorite', true);
      } else if (filters.statusFilter !== 'all') {
        query = query.eq('status', filters.statusFilter);
      }

      // Sorting DB level
      if (sort === 'newest') {
        query = query.order('scraped_at', { ascending: false });
      } else if (sort === 'price_asc') {
        query = query.order('price_dkk', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price_dkk', { ascending: false });
      }

      query = query.limit(100);

      const { data, error: supabaseError, count: rowCount } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      let resultData = (data as Listing[]) || [];

      // Phase 3 Score Filter: "Solo recomendados (Score >= 60)"
      if (filters.recommendedOnly) {
        resultData = resultData.filter(item => calculateListingMatch(item).score >= 60);
      }

      // Client-side computed sorting
      if (sort === 'price_per_m2') {
        resultData = [...resultData].sort((a, b) => {
          const ratioA = a.price_dkk && a.size_m2 ? a.price_dkk / a.size_m2 : Infinity;
          const ratioB = b.price_dkk && b.size_m2 ? b.price_dkk / b.size_m2 : Infinity;
          return ratioA - ratioB;
        });
      } else if (sort === 'move_in_cost') {
        resultData = [...resultData].sort((a, b) => {
          const costA = (a.price_dkk || 0) + (a.deposit_dkk || 0) + (a.prepaid_rent_dkk || 0);
          const costB = (b.price_dkk || 0) + (b.deposit_dkk || 0) + (b.prepaid_rent_dkk || 0);
          return costA - costB;
        });
      } else if (sort === 'score_desc') {
        resultData = [...resultData].sort((a, b) => {
          const scoreA = calculateListingMatch(a).score;
          const scoreB = calculateListingMatch(b).score;
          return scoreB - scoreA;
        });
      }

      setListings(resultData);
      setCount(rowCount || 0);
    } catch (err: any) {
      setError(err.message || 'Error al obtener publicaciones');
      console.error('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(handler);
  }, [fetchListings]);

  // Real-time mutations
  const updateListingStatus = async (id: string, newStatus: Listing['status']) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    const { error } = await getSupabase().from('listings').update({ status: newStatus }).eq('id', id);
    if (error) console.error('Error updating status:', error);
  };

  const toggleFavorite = async (id: string, currentFav: boolean) => {
    const nextFav = !currentFav;
    setListings(prev => prev.map(item => item.id === id ? { ...item, is_favorite: nextFav } : item));
    const { error } = await getSupabase().from('listings').update({ is_favorite: nextFav }).eq('id', id);
    if (error) console.error('Error toggling favorite:', error);
  };

  const updateListingNotes = async (id: string, notes: string, contactedBy: string) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, notes, contacted_by: contactedBy } : item));
    const { error } = await getSupabase()
      .from('listings')
      .update({ notes, contacted_by: contactedBy })
      .eq('id', id);
    if (error) console.error('Error updating notes:', error);
  };

  return {
    listings,
    loading,
    error,
    count,
    refetch: fetchListings,
    updateListingStatus,
    toggleFavorite,
    updateListingNotes,
  };
}
