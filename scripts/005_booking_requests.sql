-- Migration: Booking Requests System
-- Citizens submit requests online; employees approve/reject from dashboard

CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS booking_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Event details
  event_name       TEXT NOT NULL,
  booking_date     DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  attendees_count  INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  -- Room preference
  room_id          UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  -- Citizen info (no account required)
  citizen_name     TEXT NOT NULL,
  citizen_phone    TEXT NOT NULL,
  citizen_email    TEXT,
  organization_name TEXT NOT NULL,
  -- Workflow
  status           request_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_at      TIMESTAMPTZ,
  -- Timestamps
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent double-submission
  CONSTRAINT valid_request_time CHECK (end_time > start_time)
);

-- Index for quick status filtering in dashboard
CREATE INDEX idx_booking_requests_status ON booking_requests (status, created_at DESC);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (public form - no login required)
CREATE POLICY "public_insert_requests" ON booking_requests
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (employees) can read/update
CREATE POLICY "authenticated_read_requests" ON booking_requests
  FOR SELECT USING (true);

CREATE POLICY "authenticated_update_requests" ON booking_requests
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_requests" ON booking_requests
  FOR DELETE USING (true);
