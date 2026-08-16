export interface ListingInput {
  external_id: string;
  source_platform: string;
  title: string;
  url: string;
  price_dkk: number;
  deposit_dkk: number | null;
  rooms: number | null;
  size_m2: number | null;
  location_name: string;
  postal_code: string | null;
  images: string[];
  is_active?: boolean;

  // Phase 2 Danish Specific & Financials
  cpr_allowed?: boolean | null;
  rental_period_type?: 'unlimited' | 'temporary' | 'unknown';
  is_furnished?: boolean;
  prepaid_rent_dkk?: number;

  // Collaboration fields
  status?: 'new' | 'interested' | 'applied' | 'rejected';
  notes?: string | null;
  is_favorite?: boolean;
  contacted_by?: string | null;
}
