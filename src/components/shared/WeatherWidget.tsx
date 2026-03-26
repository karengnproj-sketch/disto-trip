"use client";

import { useState, useEffect } from "react";
import { Cloud, Droplets, Wind, Thermometer, Sun } from "lucide-react";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  city: string;
}

export default function WeatherWidget({ city = "Cairo" }: { city?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Use Cairo coordinates by default
    const coords: Record<string, [number, number]> = {
      Cairo: [30.0444, 31.2357],
      Giza: [30.0131, 31.2089],
      Luxor: [25.6872, 32.6396],
      Aswan: [24.0889, 32.8998],
      Hurghada: [27.2579, 33.8116],
      "Sharm El Sheikh": [27.9158, 34.3300],
      Alexandria: [31.2001, 29.9187],
      Dahab: [28.5091, 34.5131],
    };
    const [lat, lon] = coords[city] || coords.Cairo;

    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => {});
  }, [city]);

  if (!weather) return null;

  return (
    <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-[#333]/50 rounded-2xl p-4 inline-flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Sun className="w-8 h-8 text-[#FFB300]" />
        <div>
          <p className="text-2xl font-bold text-white">{weather.temp}C</p>
          <p className="text-xs text-[#888] capitalize">{weather.description}</p>
        </div>
      </div>
      <div className="h-10 w-px bg-[#333]" />
      <div className="space-y-1">
        <p className="text-xs text-[#888] flex items-center gap-1">
          <Thermometer className="w-3 h-3" /> {weather.feels_like}C feels like
        </p>
        <p className="text-xs text-[#888] flex items-center gap-1">
          <Droplets className="w-3 h-3" /> {weather.humidity}% humidity
        </p>
        <p className="text-xs text-[#888] flex items-center gap-1">
          <Wind className="w-3 h-3" /> {weather.wind_speed} km/h
        </p>
      </div>
    </div>
  );
}
