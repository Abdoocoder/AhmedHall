-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment status enum
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  event_name TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  coordinator_phone TEXT,
  attendees_count INTEGER DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_organization ON bookings(organization_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Allow authenticated read organizations" ON organizations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert organizations" ON organizations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update organizations" ON organizations
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete organizations" ON organizations
  FOR DELETE TO authenticated USING (true);

-- RLS Policies for rooms
CREATE POLICY "Allow authenticated read rooms" ON rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert rooms" ON rooms
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update rooms" ON rooms
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete rooms" ON rooms
  FOR DELETE TO authenticated USING (true);

-- RLS Policies for bookings
CREATE POLICY "Allow authenticated read bookings" ON bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert bookings" ON bookings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update bookings" ON bookings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete bookings" ON bookings
  FOR DELETE TO authenticated USING (true);

-- Function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE room_id = NEW.room_id
      AND booking_date = NEW.booking_date
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND (
        (NEW.start_time >= start_time AND NEW.start_time < end_time) OR
        (NEW.end_time > start_time AND NEW.end_time <= end_time) OR
        (NEW.start_time <= start_time AND NEW.end_time >= end_time)
      )
  ) THEN
    RAISE EXCEPTION 'Booking conflict: This room is already booked during the specified time';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent booking conflicts
DROP TRIGGER IF EXISTS prevent_booking_conflict ON bookings;
CREATE TRIGGER prevent_booking_conflict
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_conflict();
