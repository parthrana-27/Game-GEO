/**
 * GuessMap.tsx
 * Leaflet map for placing a guess marker.
 * Single click places/moves the marker.
 * Uses OpenStreetMap tiles (configurable via env).
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Region } from "../types";

// Fix Leaflet's default icon path when bundled with Vite
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
});

const OSM_TILE_URL =
  import.meta.env.VITE_OSM_TILE_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const GUESS_ICON = L.divIcon({
  className: "",
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <div class="w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
      </div>
      <div class="absolute bottom-0 w-1.5 h-1.5 bg-indigo-600 rotate-45 transform translate-y-0.5 shadow-sm"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface Props {
  onGuessChange: (lat: number, lng: number) => void;
  disabled?: boolean;
  region?: Region | null;
}

export function GuessMap({ onGuessChange, disabled = false, region = null }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasGuess, setHasGuess] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let initialCenter: L.LatLngExpression = [20, 0];
    let initialZoom = 2;

    if (region === "INDIA") {
      initialCenter = [20.5937, 78.9629];
      initialZoom = 5;
    } else if (region === "CITY_SURAT") {
      initialCenter = [21.1702, 72.8311];
      initialZoom = 12;
    }

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 1,
      maxZoom: 18,
      worldCopyJump: true,
    });

    L.tileLayer(OSM_TILE_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (disabled) return;
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: GUESS_ICON }).addTo(map);
      }

      setHasGuess(true);
      onGuessChange(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  // Sync disabled state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (disabled) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    }
  }, [disabled]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: 300 }}
        aria-label="Guess map — click to place your guess"
      />
      {!hasGuess && !disabled && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none z-[1000]">
          <div className="px-5 py-2.5 bg-surface-900/95 backdrop-blur-md border border-surface-800 text-surface-200 text-xs font-sans font-semibold tracking-wide rounded-xl shadow-lg flex items-center gap-2">
            <span>📍 Click on the map to guess the location</span>
          </div>
        </div>
      )}
    </div>
  );
}
