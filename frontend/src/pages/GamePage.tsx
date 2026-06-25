/**
 * GamePage.tsx
 * Main game screen: Street View on the left, Leaflet map on the right.
 * Responsive: stacked on mobile, side-by-side on desktop.
 */

import { useState, useCallback } from "react";
import { StreetViewPanel } from "../components/StreetViewPanel";
import { GuessMap } from "../components/GuessMap";
import { ResultOverlay } from "../components/ResultOverlay";
import type { RoundLocationResponse, GuessResult } from "../types";

interface Props {
  roundInfo: RoundLocationResponse;
  guessResult: GuessResult | null;
  loading: boolean;
  onSubmitGuess: (lat: number, lng: number) => void;
  onNext: () => void;
  onHome: () => void;
}

export function GamePage({
  roundInfo,
  guessResult,
  loading,
  onSubmitGuess,
  onNext,
  onHome,
}: Props) {
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleGuessChange = useCallback((lat: number, lng: number) => {
    setGuessCoords({ lat, lng });
  }, []);

  const handleSubmit = () => {
    if (!guessCoords) return;
    onSubmitGuess(guessCoords.lat, guessCoords.lng);
  };

  const { roundNumber, totalRounds, totalScore, streetViewLat, streetViewLng } = roundInfo;
  const pct = Math.round((roundNumber / totalRounds) * 100);

  return (
    <div className="flex flex-col h-dvh bg-surface-950 overflow-hidden font-sans">
      {/* Top HUD */}
      <div className="flex items-center gap-4 px-4 py-3 bg-surface-900/90 border-b border-surface-800/80 backdrop-blur-md flex-shrink-0 relative z-10">
        <button
          id="game-home-btn"
          onClick={onHome}
          className="btn-ghost text-xs px-3 py-1.5 font-mono"
          title="Back to home"
        >
          ← ABORT
        </button>

        <div className="flex-1 flex flex-col gap-1.5 max-w-xl">
          <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-surface-400">
            <span>ROUND // 0{roundNumber}._0{totalRounds}</span>
            <span>SYSTEM STATE: {pct}%</span>
          </div>
          <div className="w-full bg-surface-950 border border-surface-800 h-2 overflow-hidden p-[1px]">
            <div
              className="h-full bg-brand-500 transition-all duration-500 shadow-[0_0_8px_rgba(0,255,60,0.5)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-950 border border-surface-850 text-xs font-mono">
          <span className="text-surface-500 font-bold uppercase tracking-wider">SCORE //</span>
          <span className="font-bold text-brand-400 font-mono tracking-widest">{totalScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden relative">
        {/* Street View Panel */}
        <div className="flex-1 md:flex-[2] relative overflow-hidden p-2 md:p-3 bg-surface-950">
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="px-3 py-1.5 bg-surface-950/90 border border-surface-800 text-surface-400 text-[10px] font-mono tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 animate-pulse"></span>
              IMAGERY FEED // SRC_ROUND_0{roundNumber}
            </div>
          </div>
          <StreetViewPanel lat={streetViewLat} lng={streetViewLng} />
        </div>

        {/* Map Panel */}
        <div className="flex-none md:flex-1 flex flex-col p-2 md:p-3 gap-3 h-80 md:h-auto md:min-h-0 bg-surface-900 border-t md:border-t-0 md:border-l border-surface-800/80">
          <div className="flex-1 relative min-h-0">
            <GuessMap
              onGuessChange={handleGuessChange}
              disabled={!!guessResult || loading}
            />
          </div>

          {/* Submit button */}
          <button
            id="submit-guess-btn"
            onClick={handleSubmit}
            disabled={!guessCoords || loading || !!guessResult}
            className="btn-primary w-full text-xs font-mono font-bold tracking-widest uppercase py-3.5 flex-shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4 text-surface-950" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                </svg>
                CALCULATING OFFSET...
              </span>
            ) : !guessCoords ? (
              "PLOT COORDINATES ON MAP"
            ) : (
              "🎯 SUBMIT TARGET COORDINATES"
            )}
          </button>
        </div>
      </div>

      {/* Result Overlay */}
      {guessResult && (
        <ResultOverlay result={guessResult} onNext={onNext} loading={loading} />
      )}
    </div>
  );
}
