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
    <div className="flex flex-col h-dvh bg-surface-950 overflow-hidden">
      {/* Top HUD */}
      <div className="flex items-center gap-4 px-4 py-3 bg-surface-900/80 border-b border-surface-800 backdrop-blur-sm flex-shrink-0">
        <button
          id="game-home-btn"
          onClick={onHome}
          className="btn-ghost text-sm px-3 py-1.5"
          title="Back to home"
        >
          ← Home
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>Round {roundNumber} / {totalRounds}</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-surface-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 rounded-xl border border-surface-700">
          <span className="text-xs text-surface-400">Score</span>
          <span className="font-bold text-brand-400 font-mono">{totalScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden">
        {/* Street View */}
        <div className="flex-1 md:flex-[2] relative overflow-hidden p-2 md:p-3">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="px-3 py-1.5 bg-surface-900/80 backdrop-blur rounded-full border border-surface-700 text-surface-300 text-xs font-medium">
              📷 Street View — Round {roundNumber}
            </div>
          </div>
          <StreetViewPanel lat={streetViewLat} lng={streetViewLng} />
        </div>

        {/* Map panel */}
        <div className="flex-none md:flex-1 flex flex-col p-2 md:p-3 gap-3 h-72 md:h-auto md:min-h-0">
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
            className="btn-primary w-full text-base flex-shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                </svg>
                Checking…
              </span>
            ) : !guessCoords ? (
              "Place your guess on the map first"
            ) : (
              "🎯 Submit Guess"
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
