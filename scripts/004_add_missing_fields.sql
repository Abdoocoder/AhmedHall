-- Migration: Add missing fields to bookings table
-- Adds soft delete support and payment tracking fields

-- Soft delete
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Payment tracking
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10, 2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_date DATE DEFAULT NULL;

-- Index to filter out soft-deleted rows efficiently
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at
  ON bookings (deleted_at)
  WHERE deleted_at IS NULL;

-- Update SELECT policy to exclude soft-deleted rows
DROP POLICY IF EXISTS "Authenticated users can read bookings" ON bookings;

CREATE POLICY "Authenticated users can read bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'user')
    )
  );

-- Only admins can view soft-deleted bookings
CREATE POLICY "Admins can read deleted bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Soft delete function (use instead of DELETE for regular users)
CREATE OR REPLACE FUNCTION soft_delete_booking(booking_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE bookings
  SET deleted_at = NOW()
  WHERE id = booking_uuid
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
