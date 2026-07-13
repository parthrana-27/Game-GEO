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
  html: `<div style="
    width:28px;height:28px;
    background:#33a5fc;
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(51,165,252,0.6);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
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
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <div className="px-4 py-2 bg-surface-900/90 backdrop-blur rounded-xl border border-surface-700 text-surface-300 text-sm font-medium shadow-lg animate-pulse">
            👆 Click on the map to place your guess
          </div>
        </div>
      )}
    </div>
  );
}
