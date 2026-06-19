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
  html: `<div style="
    width:32px;height:32px;
    background:#22c55e;
    border:3px solid #fff;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;
    box-shadow:0 2px 10px rgba(34,197,94,0.6);
  ">✓</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const GUESS_ICON = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;
    background:#33a5fc;
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 10px rgba(51,165,252,0.6);
  "></div>`,
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
        color: "#a78bfa",
        weight: 2,
        dashArray: "8 6",
        opacity: 0.8,
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
