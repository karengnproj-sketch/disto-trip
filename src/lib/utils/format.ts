export function formatPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    historical: "Historical",
    adventure: "Adventure",
    water_sports: "Water Sports",
    cultural: "Cultural",
    food: "Food & Dining",
    nature: "Nature",
  };
  return labels[category] || category;
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    historical: "🏛️",
    adventure: "🏔️",
    water_sports: "🤿",
    cultural: "🎭",
    food: "🍽️",
    nature: "🌿",
  };
  return emojis[category] || "📍";
}

export function getAmenityLabel(amenity: string): string {
  const labels: Record<string, string> = {
    wifi: "Free WiFi",
    pool: "Swimming Pool",
    spa: "Spa & Wellness",
    gym: "Fitness Center",
    restaurant: "Restaurant",
    bar: "Bar & Lounge",
    parking: "Free Parking",
    beach: "Private Beach",
    diving: "Diving Center",
    water_sports: "Water Sports",
    concierge: "24h Concierge",
    river_view: "Nile River View",
    sea_view: "Sea View",
    pyramid_view: "Pyramid View",
    rooftop: "Rooftop Terrace",
    historic: "Historic Building",
    garden: "Gardens",
    butler: "Butler Service",
    all_inclusive: "All Inclusive",
  };
  return labels[amenity] || amenity.replace(/_/g, " ");
}

export function getAmenityIcon(amenity: string): string {
  const icons: Record<string, string> = {
    wifi: "wifi",
    pool: "waves",
    spa: "sparkles",
    gym: "dumbbell",
    restaurant: "utensils",
    bar: "wine",
    parking: "car",
    beach: "umbrella",
    diving: "waves",
    concierge: "bell",
    river_view: "eye",
    sea_view: "eye",
    pyramid_view: "triangle",
    rooftop: "sun",
    historic: "landmark",
    garden: "flower2",
    all_inclusive: "check-circle",
  };
  return icons[amenity] || "check";
}
