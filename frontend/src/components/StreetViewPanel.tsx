import { MapillaryPanel } from "./MapillaryPanel";

interface Props {
  lat: number;
  lng: number;
}

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN ?? "";

export function StreetViewPanel({ lat, lng }: Props) {
  if (MAPILLARY_TOKEN) {
    return <MapillaryPanel lat={lat} lng={lng} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 rounded-2xl border border-surface-800 text-center p-8 gap-4" style={{ minHeight: 400 }}>
      <div className="text-5xl">🗺️</div>
      <div>
        <p className="text-surface-300 font-semibold text-lg">Street View not configured</p>
        <p className="text-surface-500 text-sm mt-2 max-w-md leading-relaxed">
          Please configure Mapillary. Add <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">VITE_MAPILLARY_ACCESS_TOKEN</code> to your <code className="bg-surface-800 px-1 py-0.5 rounded text-brand-400">.env</code> file.
        </p>
      </div>
      <div className="mt-2 px-4 py-3 bg-surface-800 rounded-xl text-sm text-surface-400 max-w-md">
        <strong className="text-surface-200">Dev hint:</strong> The location is at{" "}
        <span className="text-brand-400 font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
      </div>
    </div>
  );
}

