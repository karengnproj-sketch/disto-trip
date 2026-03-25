export interface City {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

export interface Hotel {
  id: string;
  city_id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  star_rating: number;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  price_per_night_usd: number;
  latitude: number;
  longitude: number;
  address: string;
  amenities: string[];
  image_urls: string[];
  booking_url: string;
  rating: number;
  review_count: number;
  city?: City;
}

export interface Attraction {
  id: string;
  city_id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  category: 'historical' | 'adventure' | 'water_sports' | 'cultural' | 'food' | 'nature';
  image_urls: string[];
  latitude: number;
  longitude: number;
  address: string;
  entry_fee_usd: number;
  duration_hours: number;
  opening_hours: Record<string, string>;
  ticket_url: string;
  rating: number;
  review_count: number;
  crowd_data: Record<string, Record<string, string>>;
  wikipedia_slug: string;
  city?: City;
}

export interface EmergencyFacility {
  id: string;
  city_id: string;
  name: string;
  name_ar: string;
  type: 'hospital' | 'pharmacy' | 'police' | 'fire_station' | 'embassy';
  phone: string;
  latitude: number;
  longitude: number;
  address: string;
  address_ar: string;
  is_24h: boolean;
}

export interface SavedPlace {
  id: string;
  user_id: string;
  place_type: 'hotel' | 'attraction' | 'emergency';
  place_id: string;
  created_at: string;
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  city: string;
}

export interface WikipediaArticle {
  title: string;
  extract: string;
  thumbnail?: string;
  pageid: number;
}

export interface CrowdLevel {
  level: 'low' | 'moderate' | 'busy' | 'very_busy';
  label: string;
  color: string;
}

export interface POI {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distance?: number;
  tags?: Record<string, string>;
}
