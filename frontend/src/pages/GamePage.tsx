/**
 * GamePage.tsx
 * Main game screen: Street View on the left, Leaflet map on the right.
 * Responsive: stacked on mobile, side-by-side on desktop.
 */

import { useState, useCallback } from "react";
import { StreetViewPanel } from "../components/StreetViewPanel";
import { GuessMap } from "../components/GuessMap";
import { ResultOverlay } from "../components/ResultOverlay";
import type { RoundLocationResponse, GuessResult, Region } from "../types";

interface Props {
  roundInfo: RoundLocationResponse;
  guessResult: GuessResult | null;
  loading: boolean;
  region: Region | null;
  onSubmitGuess: (lat: number, lng: number) => void;
  onNext: () => void;
  onHome: () => void;
}

export function GamePage({
  roundInfo,
  guessResult,
  loading,
  region,
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
          className="btn-ghost text-xs px-3 py-1.5 font-sans"
          title="Back to home"
        >
          ← Home
        </button>

        <div className="flex-1 flex flex-col gap-1 max-w-xl">
          <div className="flex justify-between text-xs font-sans font-bold tracking-wide text-surface-200">
            <span>Round {roundNumber} of {totalRounds}</span>
            <span className="text-surface-400 font-normal">Progress</span>
          </div>
          <div className="w-full bg-surface-950 border border-surface-800 h-2.5 overflow-hidden p-[1px] rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-950 border border-surface-800 text-xs font-sans rounded-xl">
          <span className="text-surface-400 font-semibold">Score:</span>
          <span className="font-bold text-white font-mono tracking-wide">{totalScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden relative">
        {/* Street View Panel */}
        <div className="flex-1 md:flex-[2] relative overflow-hidden p-2 md:p-3 bg-surface-950">
          <div className="absolute top-5 left-5 z-10 pointer-events-none">
            <div className="px-3 py-1.5 bg-surface-900/95 border border-surface-800 text-surface-200 text-xs font-sans font-semibold tracking-wide flex items-center gap-2 rounded-xl shadow-lg">
              Round {roundNumber} Panorama
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
              region={region}
            />
          </div>

          {/* Submit button */}
          <button
            id="submit-guess-btn"
            onClick={handleSubmit}
            disabled={!guessCoords || loading || !!guessResult}
            className="btn-primary w-full text-xs font-sans font-bold tracking-widest uppercase py-3.5 flex-shrink-0 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4 text-surface-950" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                </svg>
                Submitting Guess...
              </span>
            ) : !guessCoords ? (
              "Select location on map"
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
