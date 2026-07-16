/**
 * ResultMap.tsx
 * Leaflet map displayed in the result overlay.
 * Shows both the true location and the guess, connected by a dashed polyline.
 */

import { useEffect, useRef } from "react";
import L from "leaflet";

const OSM_TILE_URL =
  import.meta.env.VITE_OSM_TILE_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const TRUE_ICON = L.divIcon({
  className: "",
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center animate-bounce">
      <div class="w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-lg">
        <span class="text-emerald-500 font-sans font-extrabold text-[12px]">✓</span>
      </div>
      <div class="absolute bottom-0 w-1.5 h-1.5 bg-emerald-500 rotate-45 transform translate-y-0.5 shadow-sm"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const GUESS_ICON = L.divIcon({
  className: "",
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <div class="w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-lg">
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
      </div>
      <div class="absolute bottom-0 w-1.5 h-1.5 bg-indigo-600 rotate-45 transform translate-y-0.5 shadow-sm"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface Props {
  trueLat: number;
  trueLng: number;
  guessLat: number;
  guessLng: number;
}

export function ResultMap({ trueLat, trueLng, guessLat, guessLng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [
        (trueLat + guessLat) / 2,
        (trueLng + guessLng) / 2,
      ],
      zoom: 3,
      scrollWheelZoom: true,
    });

    L.tileLayer(OSM_TILE_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // True location marker
    L.marker([trueLat, trueLng], { icon: TRUE_ICON })
      .addTo(map)
      .bindPopup("📍 True location");

    // Guess marker
    L.marker([guessLat, guessLng], { icon: GUESS_ICON })
      .addTo(map)
      .bindPopup("🎯 Your guess");

    // Dashed line between them
    L.polyline(
      [
        [trueLat, trueLng],
        [guessLat, guessLng],
      ],
      {
        color: "#818cf8",
        weight: 3,
        dashArray: "6 6",
        opacity: 0.9,
      }
    ).addTo(map);

    // Fit bounds to show both markers
    const bounds = L.latLngBounds(
      [trueLat, trueLng],
      [guessLat, guessLng]
    ).pad(0.3);
    map.fitBounds(bounds);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [trueLat, trueLng, guessLat, guessLng]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: 280 }}
      aria-label="Result map showing true location and guess"
    />
  );
}
