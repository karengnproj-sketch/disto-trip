-- Disto-Trip Initial Schema
-- Run this in Supabase SQL Editor

-- Profiles (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  image_url TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id TEXT PRIMARY KEY,
  city_id TEXT REFERENCES cities(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
  price_range TEXT,
  price_per_night_usd NUMERIC(10,2),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  amenities TEXT[],
  image_urls TEXT[],
  booking_url TEXT,
  rating NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attractions
CREATE TABLE IF NOT EXISTS attractions (
  id TEXT PRIMARY KEY,
  city_id TEXT REFERENCES cities(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  category TEXT NOT NULL,
  image_urls TEXT[],
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  entry_fee_usd NUMERIC(10,2),
  duration_hours NUMERIC(4,1),
  opening_hours JSONB,
  ticket_url TEXT,
  rating NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  crowd_data JSONB,
  wikipedia_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency Facilities
CREATE TABLE IF NOT EXISTS emergency_facilities (
  id TEXT PRIMARY KEY,
  city_id TEXT REFERENCES cities(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  type TEXT NOT NULL,
  phone TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  address_ar TEXT,
  is_24h BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Places
CREATE TABLE IF NOT EXISTS saved_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  place_type TEXT NOT NULL,
  place_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_type, place_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  place_type TEXT NOT NULL,
  place_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read public data
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read for hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Public read for attractions" ON attractions FOR SELECT USING (true);
CREATE POLICY "Public read for emergency" ON emergency_facilities FOR SELECT USING (true);
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own saved places" ON saved_places FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved places" ON saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved places" ON saved_places FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
