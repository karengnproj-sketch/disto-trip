import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat") || "30.0444";
  const lonStr = searchParams.get("lon") || "31.2357";

  // Validate lat/lon are valid numbers in range
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      temp: 28, feels_like: 30, description: "Clear sky",
      icon: "01d", humidity: 45, wind_speed: 12, city: "Cairo",
    });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } }
    );
    const data = await res.json();

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed * 3.6),
      city: data.name,
    });
  } catch {
    return NextResponse.json({ error: "Weather service unavailable" }, { status: 500 });
  }
}
