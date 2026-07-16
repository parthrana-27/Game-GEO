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
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-surface-900 border border-surface-800 text-center p-8 gap-6 min-h-[400px] rounded-2xl select-none">
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />

      {/* Map Pin / Globe Icon */}
      <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center text-4xl shadow-md">
        🗺️
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-white font-sans font-bold text-lg">
          Street View Not Configured
        </h3>
        <p className="text-surface-400 text-xs leading-relaxed font-sans">
          To explore street-level panoramas in the game, add your Mapillary Access Token to your workspace environment.
        </p>
      </div>

      <div className="w-full max-w-sm p-4 bg-surface-950 border border-surface-800 font-sans text-xs text-left space-y-2 rounded-xl">
        <div className="text-surface-400 font-semibold">Setup Instructions:</div>
        <div className="text-surface-300">
          Add the following key to your <span className="font-semibold text-white">.env</span> file:
        </div>
        <div className="bg-surface-900 p-2.5 border border-surface-800 overflow-x-auto text-[11px] select-all whitespace-nowrap text-indigo-300 font-mono rounded-lg">
          VITE_MAPILLARY_ACCESS_TOKEN=your_token
        </div>
      </div>

      <div className="px-4 py-2 bg-surface-800/80 border border-surface-700 text-xs text-surface-300 font-sans rounded-xl">
        Coordinates: <span className="text-white font-semibold font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
      </div>
    </div>
  );
}



