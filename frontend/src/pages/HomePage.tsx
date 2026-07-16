/**
 * HomePage.tsx
 * Landing / home screen.
 */

import { useState } from "react";
import type { Region } from "../types";
import type { AuthState } from "../types";

interface Props {
  auth: AuthState;
  onPlay: (region: Region) => void;
  onShowAuth: () => void;
  onSignout: () => void;
  onLeaderboard: () => void;
}

const REGIONS: { value: Region; label: string; emoji: string; desc: string }[] = [
  { value: "WORLD", label: "World Grid", emoji: "🌍", desc: "Global coordinates across major landmasses" },
  { value: "INDIA", label: "India Sector", emoji: "🇮🇳", desc: "National sectors and landmark coordinates" },
  { value: "CITY_SURAT", label: "Surat Local", emoji: "🏙️", desc: "High-resolution local coordinates in Gujarat" },
];

const getRegionStyles = (val: Region, active: boolean) => {
  const base = "group relative p-5 border text-left rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer";
  return active
    ? `${base} border-white bg-surface-900/80 shadow-[0_0_20px_rgba(255,255,255,0.1)]`
    : `${base} border-surface-800 bg-surface-900/30 hover:border-surface-600 hover:bg-surface-900/40`;
};

const getBadgeColor = (val: Region) => {
  return "bg-white text-surface-950 font-semibold";
};

export function HomePage({ auth, onPlay, onShowAuth, onSignout, onLeaderboard }: Props) {
  const [region, setRegion] = useState<Region>("WORLD");

  return (
    <div className="min-h-dvh flex flex-col bg-surface-950 bg-grid relative overflow-hidden font-sans">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-surface-700 to-transparent opacity-80" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-800/80 bg-surface-950/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-sans text-white text-xs font-bold shadow-sm select-none">
            🗺️
          </div>
          <span className="font-sans font-extrabold text-lg uppercase tracking-wider text-surface-50">StreetSight</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="leaderboard-nav-btn"
            onClick={onLeaderboard}
            className="btn-ghost text-xs font-sans"
          >
            🏆 Leaderboard
          </button>
          {auth.user ? (
            <div className="flex items-center gap-3">
              <span className="text-surface-400 font-sans text-xs hidden sm:block border-l border-surface-800 pl-3">
                Operator: {auth.user.email.split("@")[0]}
              </span>
              <button id="signout-btn" onClick={onSignout} className="btn-secondary text-xs px-3 py-1.5 font-sans">
                Sign out
              </button>
            </div>
          ) : (
            <button id="signin-nav-btn" onClick={onShowAuth} className="btn-primary text-xs px-4 py-2 font-sans">
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative z-10">
        <div className="animate-slide-up max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-900 border border-surface-800 text-surface-200 text-xs font-sans tracking-wide uppercase mb-8 rounded-full shadow-sm">
            🌍 Geography Exploration Game
          </div>

          <h1 className="text-gradient font-display font-extrabold text-5xl sm:text-7xl mb-4 uppercase tracking-tight">
            StreetSight
          </h1>
          <p className="text-surface-400 text-base sm:text-lg max-w-xl mx-auto mb-12 font-sans font-medium leading-relaxed">
            Explore panoramic street-level views, analyze nearby landmarks, 
            and guess your exact location on the map.
          </p>

          {/* Region selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {REGIONS.map((r) => {
              const active = region === r.value;
              return (
                <button
                  key={r.value}
                  id={`region-${r.value.toLowerCase()}`}
                  onClick={() => setRegion(r.value)}
                  className={getRegionStyles(r.value, active)}
                >
                  <span className="text-3xl block mb-3 select-none">{r.emoji}</span>
                  <span className="font-sans font-bold text-surface-50 block tracking-wide uppercase text-xs">{r.label}</span>
                  <span className="text-surface-400 text-[11px] mt-1.5 block font-sans leading-relaxed">{r.desc}</span>
                  {active && (
                    <div className={`absolute top-3 right-3 text-[8px] font-sans font-bold px-1.5 py-0.5 tracking-wider rounded ${getBadgeColor(r.value)}`}>
                      SELECTED
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="play-guest-btn"
              onClick={() => onPlay(region)}
              className="btn-primary text-sm px-10 py-4 tracking-widest font-sans font-bold shadow-lg"
            >
              Start Playing
            </button>
            {!auth.user && (
              <button
                id="signin-play-btn"
                onClick={onShowAuth}
                className="btn-secondary text-sm px-8 py-4 tracking-widest font-sans font-bold"
              >
                Sign Up & Save Scores
              </button>
            )}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mx-auto mt-20 animate-fade-in">
          {[
            { icon: "🗺️", title: "5 Rounds", desc: "Pinpoint locations across 5 randomized rounds" },
            { icon: "📏", title: "Haversine Distance", desc: "Precise calculation in kilometers from your guess" },
            { icon: "⚡", title: "Live Leaderboard", desc: "Instantly compete for top rankings and saved history" },
          ].map((f) => (
            <div key={f.title} className="card rounded-2xl bg-surface-900/50 border border-surface-800/80 p-5 text-center relative overflow-hidden">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-sans font-bold text-xs tracking-wide text-white mb-1.5 uppercase">{f.title}</h3>
              <p className="text-surface-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-surface-600 text-xs font-sans border-t border-surface-900 relative z-10 bg-surface-950/20">
        StreetSight Game // Map Imagery © Mapillary · Cartography by OpenStreetMap
      </footer>
    </div>
  );
}
