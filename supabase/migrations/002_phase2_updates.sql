-- =============================================
-- DkApp Phase 2 Migration: Denmark-specific fields & Group Collaboration
-- =============================================

-- Add new Danish housing & collaboration columns to listings table
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS cpr_allowed         BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rental_period_type  TEXT DEFAULT 'unknown' CHECK (rental_period_type IN ('unlimited', 'temporary', 'unknown')),
  ADD COLUMN IF NOT EXISTS is_furnished        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS prepaid_rent_dkk    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status              TEXT DEFAULT 'new' CHECK (status IN ('new', 'interested', 'applied', 'rejected')),
  ADD COLUMN IF NOT EXISTS notes               TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_favorite         BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS contacted_by        TEXT DEFAULT NULL;

-- Create indexes for the new filterable columns
CREATE INDEX IF NOT EXISTS idx_listings_cpr_allowed        ON listings (cpr_allowed);
CREATE INDEX IF NOT EXISTS idx_listings_rental_period     ON listings (rental_period_type);
CREATE INDEX IF NOT EXISTS idx_listings_is_furnished      ON listings (is_furnished);
CREATE INDEX IF NOT EXISTS idx_listings_status            ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_is_favorite        ON listings (is_favorite);

-- Allow public / anon update of collaboration fields (status, notes, is_favorite, contacted_by)
-- This allows group members to mark favorites, edit notes, and update statuses directly from the SPA.
CREATE POLICY "Allow public update on collaboration fields"
  ON listings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
