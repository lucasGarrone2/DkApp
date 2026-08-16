-- =============================================
-- DkApp: Copenhagen Rental Listings
-- Supabase / PostgreSQL Migration
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: listings
-- =============================================
CREATE TABLE IF NOT EXISTS listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     TEXT UNIQUE NOT NULL,
  source_platform TEXT NOT NULL CHECK (source_platform IN ('DBA', 'Lejebolig', 'BoligPortal', 'BoligZonen', 'Other')),
  title           TEXT NOT NULL,
  url             TEXT NOT NULL,
  price_dkk       INTEGER,
  deposit_dkk     INTEGER,
  rooms           REAL,
  size_m2         INTEGER,
  location_name   TEXT,
  postal_code     TEXT,
  images          JSONB DEFAULT '[]'::jsonb,
  is_active       BOOLEAN DEFAULT TRUE,
  scraped_at      TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Indexes for fast filtering & sorting
-- =============================================
CREATE INDEX IF NOT EXISTS idx_listings_source_platform ON listings (source_platform);
CREATE INDEX IF NOT EXISTS idx_listings_price_dkk       ON listings (price_dkk);
CREATE INDEX IF NOT EXISTS idx_listings_location_name   ON listings (location_name);
CREATE INDEX IF NOT EXISTS idx_listings_postal_code     ON listings (postal_code);
CREATE INDEX IF NOT EXISTS idx_listings_is_active       ON listings (is_active);
CREATE INDEX IF NOT EXISTS idx_listings_scraped_at      ON listings (scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_rooms           ON listings (rooms);
CREATE INDEX IF NOT EXISTS idx_listings_size_m2         ON listings (size_m2);

-- Composite index for the most common frontend query pattern
CREATE INDEX IF NOT EXISTS idx_listings_active_scraped
  ON listings (is_active, scraped_at DESC)
  WHERE is_active = TRUE;

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public read access via anon key (for the frontend)
CREATE POLICY "Allow public read access"
  ON listings
  FOR SELECT
  USING (true);

-- Only service_role can insert (scraper uses service key)
CREATE POLICY "Allow service_role insert"
  ON listings
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service_role can update
CREATE POLICY "Allow service_role update"
  ON listings
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Only service_role can delete
CREATE POLICY "Allow service_role delete"
  ON listings
  FOR DELETE
  USING (auth.role() = 'service_role');

-- =============================================
-- Helper: auto-update scraped_at on upsert
-- =============================================
CREATE OR REPLACE FUNCTION update_scraped_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.scraped_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scraped_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_scraped_at();
