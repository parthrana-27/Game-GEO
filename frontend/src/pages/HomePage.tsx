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
  { value: "WORLD", label: "World", emoji: "🌍", desc: "Random locations across the globe" },
  { value: "INDIA", label: "India", emoji: "🇮🇳", desc: "Major cities and landmarks across India" },
  { value: "CITY_SURAT", label: "Surat City", emoji: "🏙️", desc: "Neighborhoods across Surat, Gujarat" },
];

export function HomePage({ auth, onPlay, onShowAuth, onSignout, onLeaderboard }: Props) {
  const [region, setRegion] = useState<Region>("WORLD");

  return (
    <div className="min-h-dvh flex flex-col bg-surface-950 bg-grid">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-surface-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-xl shadow-lg shadow-brand-600/30">
            🌐
          </div>
          <span className="font-display font-bold text-xl text-surface-50">StreetSight</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="leaderboard-nav-btn"
            onClick={onLeaderboard}
            className="btn-ghost text-sm"
          >
            🏆 Leaderboard
          </button>
          {auth.user ? (
            <div className="flex items-center gap-3">
              <span className="text-surface-400 text-sm hidden sm:block">
                {auth.user.email}
              </span>
              <button id="signout-btn" onClick={onSignout} className="btn-secondary text-sm px-4 py-2">
                Sign out
              </button>
            </div>
          ) : (
            <button id="signin-nav-btn" onClick={onShowAuth} className="btn-primary text-sm px-4 py-2">
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Geography guessing game
          </div>

          <h1 className="text-gradient font-display font-extrabold text-5xl sm:text-7xl mb-4 leading-tight">
            StreetSight
          </h1>
          <p className="text-surface-300 text-lg sm:text-xl max-w-lg mx-auto mb-12">
            Explore Street View panoramas around the world. Guess where you are,
            score points, and climb the leaderboard.
          </p>

          {/* Region selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
            {REGIONS.map((r) => (
              <button
                key={r.value}
                id={`region-${r.value.toLowerCase()}`}
                onClick={() => setRegion(r.value)}
                className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${region === r.value
                    ? "border-brand-500 bg-brand-600/10 shadow-lg shadow-brand-600/10"
                    : "border-surface-800 bg-surface-900/40 hover:border-surface-600"
                  }`}
              >
                <span className="text-3xl block mb-2">{r.emoji}</span>
                <span className="font-semibold text-surface-50 block">{r.label}</span>
                <span className="text-surface-400 text-xs mt-0.5 block">{r.desc}</span>
                {region === r.value && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="play-guest-btn"
              onClick={() => onPlay(region)}
              className="btn-primary text-lg px-10 py-4 animate-pulse-glow"
            >
              🎮 Play Now
            </button>
            {!auth.user && (
              <button
                id="signin-play-btn"
                onClick={onShowAuth}
                className="btn-secondary text-lg px-10 py-4"
              >
                Login to Save Scores
              </button>
            )}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-20 animate-fade-in">
          {[
            { icon: "🗺️", title: "5 Rounds", desc: "Each game has 5 unique locations to identify" },
            { icon: "📏", title: "Distance Scoring", desc: "Score up to 5,000 pts per round based on accuracy" },
            { icon: "🏆", title: "Leaderboard", desc: "Compare your score against the world" },
          ].map((f) => (
            <div key={f.title} className="glass-panel p-5 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-surface-100 mb-1">{f.title}</h3>
              <p className="text-surface-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-surface-600 text-xs border-t border-surface-800/40">
        Powered by OpenStreetMap · Street View imagery © Google
      </footer>
    </div>
  );
}
