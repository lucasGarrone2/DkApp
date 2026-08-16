export interface Listing {
  id: string;
  external_id: string;
  source_platform: string;
  title: string;
  url: string;
  price_dkk: number | null;
  deposit_dkk: number | null;
  rooms: number | null;
  size_m2: number | null;
  location_name: string | null;
  postal_code: string | null;
  images: string[];
  is_active: boolean;
  scraped_at: string;
  created_at: string;

  // Phase 2 Danish specific fields & Financials
  cpr_allowed: boolean | null;
  rental_period_type: 'unlimited' | 'temporary' | 'unknown';
  is_furnished: boolean;
  prepaid_rent_dkk: number;

  // Group Collaboration fields
  status: 'new' | 'interested' | 'applied' | 'rejected';
  notes: string | null;
  is_favorite: boolean;
  contacted_by: string | null;
}

export interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  roomsMin: number | null;
  sizeMin: number | null;
  locations: string[];
  platforms: string[];

  // Phase 2 Advanced Filters
  cprOnly: boolean;
  furnishedOnly: boolean;
  periodType: 'all' | 'unlimited' | 'temporary';
  statusFilter: 'all' | 'favorites' | 'new' | 'interested' | 'applied' | 'rejected';

  // Phase 3 Score Filter
  recommendedOnly: boolean;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'price_per_m2'
  | 'move_in_cost'
  | 'score_desc';

export type Currency = 'DKK' | 'EUR';
