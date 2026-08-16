import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';
import { ListingInput } from './types';

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const isValidUrl = config.supabaseUrl.startsWith('http://') || config.supabaseUrl.startsWith('https://');
    if (!isValidUrl) {
      console.warn('⚠️ Warning: SUPABASE_URL is not a valid HTTP/HTTPS URL. Set real credentials in .env');
    }
    _supabase = createClient(
      isValidUrl ? config.supabaseUrl : 'https://placeholder.supabase.co',
      config.supabaseServiceKey || 'placeholder'
    );
  }
  return _supabase;
}

/**
 * Upsert listings into the Supabase database
 * @param listings Array of listing objects
 */
export async function upsertListings(listings: ListingInput[]): Promise<void> {
  if (listings.length === 0) {
    console.log('ℹ️ No listings to insert.');
    return;
  }

  // Deduplicate by external_id to avoid Postgres error 21000 ("ON CONFLICT DO UPDATE command cannot affect row a second time")
  const uniqueMap = new Map<string, ListingInput>();
  listings.forEach((item) => {
    if (item.external_id) {
      uniqueMap.set(item.external_id, item);
    }
  });

  const uniqueListings = Array.from(uniqueMap.values());

  const listingsToUpsert = uniqueListings.map((listing) => ({
    ...listing,
    is_active: listing.is_active !== undefined ? listing.is_active : true,
    scraped_at: new Date().toISOString(),
  }));

  try {
    const { error } = await getSupabaseClient()
      .from('listings')
      .upsert(listingsToUpsert, {
        onConflict: 'external_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('❌ Supabase upsert error:', error.message);
      throw error;
    }

    console.log(`✅ Successfully upserted ${listingsToUpsert.length} unique listings to Supabase.`);
  } catch (error) {
    console.error('❌ Failed to upsert listings:', error);
  }
}
