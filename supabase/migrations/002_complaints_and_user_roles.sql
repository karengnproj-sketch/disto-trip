-- Disto-Trip: Complaints + User Roles
-- Run this in Supabase SQL Editor

-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  category TEXT NOT NULL, -- 'service', 'safety', 'scam', 'transport', 'hotel', 'attraction', 'other'
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_review', 'resolved', 'forwarded', 'dismissed'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Users can insert their own complaints
CREATE POLICY "Users can create complaints" ON complaints
  FOR INSERT WITH CHECK (true);

-- Users can read their own complaints
CREATE POLICY "Users can read own complaints" ON complaints
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Admins can update complaints (change status, add notes)
CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Set the admin user role
UPDATE profiles SET role = 'admin' WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@distotrip.com'
);

-- Allow admins to read all profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile or admin reads all" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Allow admins to update any profile (for banning, role changes)
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
