import { useEffect, useRef } from "react";
import { MapillaryPanel } from "./MapillaryPanel";

interface Props {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    initStreetView?: () => void;
  }
}

const PROVIDER = import.meta.env.VITE_STREET_VIEW_PROVIDER ?? "google";
const GOOGLE_API_KEY = import.meta.env.VITE_STREET_VIEW_API_KEY ?? "";
const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN ?? "";

// Determine whether to use Mapillary based on settings & token availability
const useMapillary = 
  (PROVIDER === "mapillary" && !!MAPILLARY_TOKEN) || 
  (!GOOGLE_API_KEY && !!MAPILLARY_TOKEN);

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    if (document.getElementById("google-maps-script")) {
      // Already loading, wait
      window.initStreetView = resolve;
      return;
    }
    window.initStreetView = resolve;
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initStreetView&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function StreetViewPanel({ lat, lng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (useMapillary || !GOOGLE_API_KEY) return;

    let cancelled = false;

    loadGoogleMapsScript(GOOGLE_API_KEY)
      .then(() => {
        if (cancelled || !containerRef.current) return;
        if (!panoramaRef.current) {
          panoramaRef.current = new google.maps.StreetViewPanorama(
            containerRef.current,
            {
              position: { lat, lng },
              pov: { heading: 34, pitch: 10 },
              zoom: 1,
              addressControl: false,
              showRoadLabels: false,
              motionTracking: false,
              motionTrackingControl: false,
            }
          );
        } else {
          panoramaRef.current.setPosition({ lat, lng });
          panoramaRef.current.setPov({ heading: 34, pitch: 10 });
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (useMapillary) {
    return <MapillaryPanel lat={lat} lng={lng} />;
  }

  if (!GOOGLE_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 rounded-2xl border border-surface-800 text-center p-8 gap-4">
        <div className="text-5xl">🗺️</div>
        <div>
          <p className="text-surface-300 font-semibold text-lg">Street View not configured</p>
          <p className="text-surface-500 text-sm mt-2 max-w-md leading-relaxed">
            Please configure either Google Maps Street View or Mapillary. Add <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">VITE_STREET_VIEW_API_KEY</code> or <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">VITE_MAPILLARY_ACCESS_TOKEN</code> to your <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">.env</code> file.
          </p>
        </div>
        <div className="mt-2 px-4 py-3 bg-surface-800 rounded-xl text-sm text-surface-400 max-w-md">
          <strong className="text-surface-200">Dev hint:</strong> The location is at{" "}
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
      aria-label="Street View panorama"
    />
  );
}

