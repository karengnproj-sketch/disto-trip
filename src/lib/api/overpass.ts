export interface OverpassPOI {
  id: string;
  name: string;
  type: string;
  category: string;
  latitude: number;
  longitude: number;
}

const categoryQueries: Record<string, string> = {
  restaurants: '["amenity"~"restaurant|fast_food|cafe"]',
  hotels: '["tourism"~"hotel|hostel|guest_house|motel"]',
  attractions: '["tourism"~"museum|attraction|viewpoint|artwork|gallery"]',
  pharmacies: '["amenity"="pharmacy"]',
  hospitals: '["amenity"~"hospital|clinic|doctors"]',
  mosques: '["amenity"="place_of_worship"]["religion"="muslim"]',
  banks: '["amenity"~"bank|atm"]',
  shops: '["shop"~"supermarket|convenience|mall"]',
};

export async function fetchNearbyPOIs(
  lat: number,
  lon: number,
  category: string = "restaurants",
  radiusMeters: number = 3000,
  limit: number = 30
): Promise<OverpassPOI[]> {
  const query = categoryQueries[category] || categoryQueries.restaurants;

  const overpassQuery = `
    [out:json][timeout:10];
    (
      node${query}(around:${radiusMeters},${lat},${lon});
    );
    out body ${limit};
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) return [];

    const data = await res.json();

    return (data.elements || [])
      .filter((el: any) => el.tags?.name)
      .map((el: any) => ({
        id: `osm-${el.id}`,
        name: el.tags.name,
        type: el.tags.amenity || el.tags.tourism || el.tags.shop || "poi",
        category,
        latitude: el.lat,
        longitude: el.lon,
      }));
  } catch {
    return [];
  }
}
