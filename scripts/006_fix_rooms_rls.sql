-- Migration: Fix Rooms RLS
-- Allows public (unauthenticated) users to see the list of active rooms.
-- This is necessary for the public booking request form to function.

-- 1. Drop existing policy if it exists (to avoid duplicates)
DROP POLICY IF EXISTS "public_read_rooms" ON rooms;

-- 2. Create the new policy
CREATE POLICY "public_read_rooms" ON rooms
  FOR SELECT TO anon USING (is_active = true);

-- Note: 'anon' includes all unauthenticated public visitors.
-- We restrict the visibility to only 'is_active = true' rooms for security.
