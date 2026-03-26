import { NextRequest, NextResponse } from "next/server";

// Fetch real places from OpenStreetMap Overpass API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "30.0444");
  const lon = parseFloat(searchParams.get("lon") || "31.2357");
  const type = searchParams.get("type") || "hotels"; // hotels, restaurants, attractions, pharmacies, hospitals, mosques, banks, shops
  const radius = parseInt(searchParams.get("radius") || "10000"); // meters

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const safeRadius = Math.min(Math.max(radius, 1000), 50000);

  const queries: Record<string, string> = {
    hotels: '["tourism"~"hotel|hostel|guest_house|motel|apartment"]',
    restaurants: '["amenity"~"restaurant|fast_food|cafe|bar|pub"]',
    attractions: '["tourism"~"museum|attraction|viewpoint|artwork|gallery|zoo|theme_park|archaeological_site"]',
    pharmacies: '["amenity"="pharmacy"]',
    hospitals: '["amenity"~"hospital|clinic|doctors"]',
    mosques: '["amenity"="place_of_worship"]["religion"="muslim"]',
    banks: '["amenity"~"bank|atm"]',
    shops: '["shop"~"supermarket|convenience|mall|department_store"]',
    historic: '["historic"~"monument|memorial|castle|ruins|archaeological_site|fort"]',
    nature: '["leisure"~"park|garden|nature_reserve"]["name"]',
  };

  const query = queries[type] || queries.hotels;

  const overpassQuery = `
    [out:json][timeout:15];
    (
      node${query}(around:${safeRadius},${lat},${lon});
      way${query}(around:${safeRadius},${lat},${lon});
    );
    out body center 200;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Overpass API error", places: [] }, { status: 502 });
    }

    const data = await res.json();

    const places = (data.elements || [])
      .filter((el: any) => el.tags?.name)
      .map((el: any) => ({
        id: `osm-${el.id}`,
        name: el.tags.name,
        name_ar: el.tags["name:ar"] || null,
        type: el.tags.tourism || el.tags.amenity || el.tags.historic || el.tags.shop || el.tags.leisure || type,
        latitude: el.lat || el.center?.lat,
        longitude: el.lon || el.center?.lon,
        phone: el.tags.phone || el.tags["contact:phone"] || null,
        website: el.tags.website || el.tags["contact:website"] || null,
        address: [el.tags["addr:street"], el.tags["addr:housenumber"], el.tags["addr:city"]].filter(Boolean).join(", ") || null,
        stars: el.tags.stars ? parseInt(el.tags.stars) : null,
        cuisine: el.tags.cuisine || null,
        opening_hours: el.tags.opening_hours || null,
        wheelchair: el.tags.wheelchair || null,
      }))
      .filter((p: any) => p.latitude && p.longitude);

    return NextResponse.json({
      count: places.length,
      type,
      center: { lat, lon },
      radius: safeRadius,
      places,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch places", places: [] }, { status: 500 });
  }
}
