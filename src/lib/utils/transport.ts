// Transport cost estimator for Egypt
// Prices are approximate and based on 2024-2025 rates

export interface TransportOption {
  type: string;
  icon: string;
  name_en: string;
  name_ar: string;
  cost_egp_min: number;
  cost_egp_max: number;
  duration_min: number; // minutes
  notes_en: string;
  notes_ar: string;
}

// Rough EGP per km rates
const UBER_PER_KM = 8; // EGP per km (UberX)
const TAXI_PER_KM = 12; // white taxi per km (metered)
const CAREEM_PER_KM = 9; // Careem per km

export function estimateTransportCosts(
  distanceKm: number,
  fromAirport: boolean = false
): TransportOption[] {
  const options: TransportOption[] = [];

  // Uber/Careem
  const uberMin = Math.round(Math.max(30, distanceKm * UBER_PER_KM * 0.9));
  const uberMax = Math.round(Math.max(50, distanceKm * UBER_PER_KM * 1.4));
  options.push({
    type: "uber",
    icon: "car",
    name_en: "Uber / Careem",
    name_ar: "اوبر / كريم",
    cost_egp_min: uberMin,
    cost_egp_max: uberMax,
    duration_min: Math.round(distanceKm * 2.5 + 10),
    notes_en: "Book via app. AC, tracked ride. Safest option for tourists.",
    notes_ar: "احجز عبر التطبيق. تكييف ورحلة متتبعة. الخيار الأكثر أماناً للسياح.",
  });

  // White Taxi
  const taxiMin = Math.round(Math.max(25, distanceKm * TAXI_PER_KM * 0.8));
  const taxiMax = Math.round(Math.max(60, distanceKm * TAXI_PER_KM * 1.5));
  options.push({
    type: "taxi",
    icon: "taxi",
    name_en: "White Taxi (metered)",
    name_ar: "تاكسي أبيض (بالعداد)",
    cost_egp_min: taxiMin,
    cost_egp_max: taxiMax,
    duration_min: Math.round(distanceKm * 2.5 + 10),
    notes_en: "Insist on meter. Agree price before if no meter. Have small bills ready.",
    notes_ar: "أصر على العداد. اتفق على السعر قبلاً إذا لم يكن هناك عداد.",
  });

  // Airport specific
  if (fromAirport) {
    options.push({
      type: "airport_bus",
      icon: "bus",
      name_en: "Airport Shuttle Bus",
      name_ar: "حافلة المطار",
      cost_egp_min: 35,
      cost_egp_max: 50,
      duration_min: Math.round(distanceKm * 3 + 20),
      notes_en: "Cheapest option. Goes to major areas. Ask at airport info desk.",
      notes_ar: "الخيار الأرخص. يذهب للمناطق الرئيسية. اسأل في مكتب معلومات المطار.",
    });
  }

  // Metro (only if within Cairo)
  if (distanceKm < 30 && !fromAirport) {
    options.push({
      type: "metro",
      icon: "train",
      name_en: "Cairo Metro",
      name_ar: "مترو القاهرة",
      cost_egp_min: 8,
      cost_egp_max: 12,
      duration_min: Math.round(distanceKm * 3 + 15),
      notes_en: "Cheapest option in Cairo. 3 lines. Women-only car available. Avoid rush hours.",
      notes_ar: "الخيار الأرخص في القاهرة. 3 خطوط. عربة مخصصة للسيدات. تجنب ساعات الذروة.",
    });
  }

  // Walking (if close)
  if (distanceKm < 3) {
    options.push({
      type: "walk",
      icon: "footprints",
      name_en: "Walking",
      name_ar: "المشي",
      cost_egp_min: 0,
      cost_egp_max: 0,
      duration_min: Math.round(distanceKm * 15),
      notes_en: "Free! Stay on main roads. Use Google Maps for navigation.",
      notes_ar: "مجاني! ابق على الطرق الرئيسية. استخدم خرائط جوجل للتنقل.",
    });
  }

  return options;
}

export function getGoogleMapsUrl(lat: number, lng: number, name?: string): string {
  if (name) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=`;
  }
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getGoogleMapsDirectionsUrl(
  destLat: number,
  destLng: number,
  originLat?: number,
  originLng?: number
): string {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
  if (originLat && originLng) {
    url += `&origin=${originLat},${originLng}`;
  }
  return url;
}

// Egypt airport coordinates
export const airports = {
  cairo: { name: "Cairo International Airport (CAI)", name_ar: "مطار القاهرة الدولي", lat: 30.1219, lng: 31.4056 },
  hurghada: { name: "Hurghada International Airport (HRG)", name_ar: "مطار الغردقة الدولي", lat: 27.1783, lng: 33.7994 },
  sharm: { name: "Sharm El Sheikh Airport (SSH)", name_ar: "مطار شرم الشيخ", lat: 27.9773, lng: 34.3947 },
  luxor: { name: "Luxor International Airport (LXR)", name_ar: "مطار الأقصر الدولي", lat: 25.6731, lng: 32.7067 },
  aswan: { name: "Aswan International Airport (ASW)", name_ar: "مطار أسوان الدولي", lat: 23.9644, lng: 32.8200 },
  alexandria: { name: "Borg El Arab Airport (HBE)", name_ar: "مطار برج العرب", lat: 30.9177, lng: 29.6964 },
};
