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

export function HomePage({ auth, onPlay, onShowAuth, onSignout, onLeaderboard }: Props) {
  const [region, setRegion] = useState<Region>("WORLD");

  return (
    <div className="min-h-dvh flex flex-col bg-surface-950 bg-grid scanline relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-80" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-800/80 bg-surface-950/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-brand-500 flex items-center justify-center font-mono text-brand-400 text-xs font-bold relative">
            SS
            <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-brand-500"></span>
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-brand-500"></span>
          </div>
          <span className="font-mono font-bold text-lg uppercase tracking-wider text-surface-50">StreetSight</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="leaderboard-nav-btn"
            onClick={onLeaderboard}
            className="btn-ghost text-xs"
          >
            🏆 Leaderboard
          </button>
          {auth.user ? (
            <div className="flex items-center gap-3">
              <span className="text-surface-400 font-mono text-xs hidden sm:block border-l border-surface-800 pl-3">
                USR // {auth.user.email}
              </span>
              <button id="signout-btn" onClick={onSignout} className="btn-secondary text-xs px-3 py-1.5">
                Sign out
              </button>
            </div>
          ) : (
            <button id="signin-nav-btn" onClick={onShowAuth} className="btn-primary text-xs px-4 py-2">
              Access Terminal
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative z-10">
        <div className="animate-slide-up max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 bg-brand-400 animate-pulse" />
            Tactical Cartography System
          </div>

          <h1 className="text-gradient font-display font-extrabold text-5xl sm:text-7xl mb-4 uppercase tracking-tight">
            StreetSight
          </h1>
          <p className="text-surface-400 text-base sm:text-lg max-w-xl mx-auto mb-12 font-sans font-medium leading-relaxed">
            Analyze geographic features, cross-reference Street View imagery, 
            and plot coordinates to pinpoint target locations.
          </p>

          {/* Region selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {REGIONS.map((r) => (
              <button
                key={r.value}
                id={`region-${r.value.toLowerCase()}`}
                onClick={() => setRegion(r.value)}
                className={`group relative p-5 border transition-all duration-150 text-left rounded-none overflow-hidden
                  ${region === r.value
                    ? "border-brand-500 bg-brand-500/5"
                    : "border-surface-800 bg-surface-900/30 hover:border-surface-700"
                  }`}
              >
                {region === r.value && (
                  <>
                    <span className="tactical-corner-tl"></span>
                    <span className="tactical-corner-tr"></span>
                    <span className="tactical-corner-bl"></span>
                    <span className="tactical-corner-br"></span>
                  </>
                )}
                <span className="text-3xl block mb-3">{r.emoji}</span>
                <span className="font-mono font-bold text-surface-50 block tracking-wide uppercase text-xs">{r.label}</span>
                <span className="text-surface-400 text-[11px] mt-1.5 block font-mono leading-relaxed">{r.desc}</span>
                {region === r.value && (
                  <div className="absolute top-3 right-3 text-[9px] font-mono bg-brand-500 text-surface-950 font-bold px-1.5 py-0.5 tracking-wider">
                    LOCKED
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="play-guest-btn"
              onClick={() => onPlay(region)}
              className="btn-primary text-sm px-10 py-4 tracking-widest font-mono font-bold glow-brand"
            >
              🎮 INITIATE SYSTEM
            </button>
            {!auth.user && (
              <button
                id="signin-play-btn"
                onClick={onShowAuth}
                className="btn-secondary text-sm px-8 py-4 tracking-widest font-mono font-bold"
              >
                AUTH & SAVE DATA
              </button>
            )}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mx-auto mt-24 animate-fade-in">
          {[
            { icon: "🗺️", title: "05 ROUNDS", desc: "Pinpoint five randomized coordinates per session" },
            { icon: "📏", title: "HAVERSINE CALC", desc: "Precise spherical distance calculation in kilometers" },
            { icon: "⚡", title: "REDIS CACHE", desc: "Top scores cached instantly for competitive rankings" },
          ].map((f) => (
            <div key={f.title} className="card bg-surface-900/40 border border-surface-800/60 p-5 text-center relative overflow-hidden">
              <span className="tactical-corner-tl opacity-30"></span>
              <span className="tactical-corner-tr opacity-30"></span>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-mono font-bold text-xs tracking-wider text-brand-400 mb-1.5 uppercase">{f.title}</h3>
              <p className="text-surface-500 text-[11px] font-mono leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-surface-600 text-[10px] font-mono border-t border-surface-800/40 relative z-10 bg-surface-950/20">
        SYS_STATUS: ONLINE // IMAGERY DATA © MAPILLARY · CARTOGRAPHY BY OPENSTREETMAP
      </footer>
    </div>
  );
}
