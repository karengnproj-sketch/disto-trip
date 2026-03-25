"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

// Default to Cairo if geolocation unavailable
const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: error.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return state;
}
