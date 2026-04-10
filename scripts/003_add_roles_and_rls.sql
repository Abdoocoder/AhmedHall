-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert admin role function (run manually with service role)
-- INSERT INTO user_roles (user_id, role) VALUES ('USER_ID_HERE', 'admin');

-- Update bookings RLS to be more secure
DROP POLICY IF EXISTS "Allow authenticated read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated insert bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated delete bookings" ON bookings;

CREATE POLICY "Authenticated users can read bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'user')
    )
  );

CREATE POLICY "Admins and managers can insert bookings" ON bookings
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update bookings" ON bookings
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Only admins can delete bookings" ON bookings
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update organizations RLS
DROP POLICY IF EXISTS "Allow authenticated read organizations" ON organizations;
DROP POLICY IF EXISTS "Allow authenticated insert organizations" ON organizations;
DROP POLICY IF EXISTS "Allow authenticated update organizations" ON organizations;
DROP POLICY IF EXISTS "Allow authenticated delete organizations" ON organizations;

CREATE POLICY "Authenticated users can read organizations" ON organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'user')
    )
  );

CREATE POLICY "Admins and managers can insert organizations" ON organizations
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update organizations" ON organizations
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Only admins can delete organizations" ON organizations
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update rooms RLS
DROP POLICY IF EXISTS "Allow authenticated read rooms" ON rooms;
DROP POLICY IF EXISTS "Allow authenticated insert rooms" ON rooms;
DROP POLICY IF EXISTS "Allow authenticated update rooms" ON rooms;
DROP POLICY IF EXISTS "Allow authenticated delete rooms" ON rooms;

CREATE POLICY "Authenticated users can read rooms" ON rooms
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'user')
    )
  );

CREATE POLICY "Only admins can insert rooms" ON rooms
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update rooms" ON rooms
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete rooms" ON rooms
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
