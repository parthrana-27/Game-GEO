/**
 * MapillaryPanel.tsx
 * Embeds Mapillary panorama using the mapillary-js library.
 * Resolves latitude/longitude coordinates to the closest Mapillary image ID.
 */

import { useEffect, useRef, useState } from "react";
import { Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";

interface Props {
  lat: number;
  lng: number;
}

interface MapillaryImage {
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN ?? "";

// Simple distance calculation helper to find the closest image
function getSquaredDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return dLat * dLat + dLng * dLng;
}

export function MapillaryPanel({ lat, lng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Resolve coordinates to closest image ID
  useEffect(() => {
    if (!MAPILLARY_TOKEN) {
      setError("Mapillary Access Token not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Expand search area slightly if needed (0.01 degrees is ~1km)
    const offset = 0.01;
    const minLng = lng - offset;
    const minLat = lat - offset;
    const maxLng = lng + offset;
    const maxLat = lat + offset;

    const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,geometry&bbox=${minLng},${minLat},${maxLng},${maxLat}&limit=10`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const images: MapillaryImage[] = data.data ?? [];
        if (images.length === 0) {
          setImageId(null);
          return;
        }

        // Find the image that is physically closest to the target coordinates
        let closestImage = images[0];
        let minDistance = getSquaredDistance(
          lat,
          lng,
          images[0].geometry.coordinates[1],
          images[0].geometry.coordinates[0]
        );

        for (let i = 1; i < images.length; i++) {
          const img = images[i];
          const dist = getSquaredDistance(
            lat,
            lng,
            img.geometry.coordinates[1],
            img.geometry.coordinates[0]
          );
          if (dist < minDistance) {
            minDistance = dist;
            closestImage = img;
          }
        }

        setImageId(closestImage.id);
      })
      .catch((err) => {
        console.error("Failed to query Mapillary images:", err);
        setError("Failed to fetch Mapillary panorama metadata.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lng]);

  // 2. Initialize or navigate the mapillary-js Viewer
  useEffect(() => {
    if (!containerRef.current || !imageId || !MAPILLARY_TOKEN) return;

    let viewer: Viewer;

    try {
      if (!viewerRef.current) {
        viewer = new Viewer({
          accessToken: MAPILLARY_TOKEN,
          container: containerRef.current,
          imageId: imageId,
          component: {
            cover: false, // disable cover screen for smoother inline load
          },
        });
        viewerRef.current = viewer;
      } else {
        viewerRef.current.moveTo(imageId).catch((err) => {
          console.error("Failed to navigate Mapillary viewer:", err);
        });
      }
    } catch (err) {
      console.error("Failed to initialize Mapillary Viewer:", err);
      setError("Error initializing the panorama viewer.");
    }

    return () => {
      // Clean up viewer on unmount
      if (viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    };
  }, [imageId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 rounded-2xl border border-surface-800 text-center p-8 gap-4">
        <div className="text-5xl text-brand-500">⚠️</div>
        <div>
          <p className="text-surface-300 font-semibold text-lg">{error}</p>
          {!MAPILLARY_TOKEN && (
            <p className="text-surface-500 text-sm mt-1">
              Add <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">VITE_MAPILLARY_ACCESS_TOKEN</code> to your <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">.env</code> file.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 rounded-2xl border border-surface-800 text-center p-8 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        <p className="text-surface-400 font-mono text-sm tracking-widest uppercase">
          SCANNING IMAGERY SATELLITES...
        </p>
      </div>
    );
  }

  if (!imageId) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 rounded-2xl border border-surface-800 text-center p-8 gap-4">
        <div className="text-5xl">🗺️</div>
        <div>
          <p className="text-surface-300 font-semibold text-lg">Imagery Feed Offline</p>
          <p className="text-surface-500 text-sm mt-1">
            No Mapillary street-level coverage found near this location.
          </p>
        </div>
        <div className="mt-2 px-4 py-3 bg-surface-800 rounded-xl text-sm text-surface-400 max-w-md">
          <strong className="text-surface-200">Coordinates:</strong>{" "}
          <span className="text-brand-400 font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: 400 }}
      aria-label="Mapillary panorama feed"
    />
  );
}
