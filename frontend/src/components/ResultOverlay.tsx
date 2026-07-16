/**
 * ResultOverlay.tsx
 * Shown after submitting a guess. Displays the result map,
 * distance, score, and a "Next Round" or "See Summary" button.
 */

import { ResultMap } from "./ResultMap";
import type { GuessResult } from "../types";

interface Props {
  result: GuessResult;
  onNext: () => void;
  loading?: boolean;
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min((score / 5000) * 100, 100);
  const color =
    pct > 75
      ? "bg-brand-500 shadow-[0_0_12px_rgba(0,255,60,0.6)]"
      : pct > 40
      ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
      : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]";

  return (
    <div className="w-full bg-surface-950 border border-surface-800 h-3 overflow-hidden p-[1px] rounded-sm">
      <div
        className={`h-full ${color} transition-all duration-1000 animate-progress-stripe`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ResultOverlay({ result, onNext, loading }: Props) {
  const {
    trueLat,
    trueLng,
    guessLat,
    guessLng,
    distanceKm,
    score,
    totalScore,
    roundNumber,
    isLastRound,
  } = result;

  const scoreColor =
    score > 4000
      ? "text-white"
      : score > 2000
      ? "text-indigo-300"
      : "text-surface-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-lg w-full bg-surface-900 border border-surface-800 rounded-2xl p-6 relative animate-slide-up max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-surface-800 pb-4 font-sans">
          <div>
            <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider">
              Round {roundNumber} Results
            </p>
            <h2 className="text-xl font-bold text-white uppercase mt-1">
              {distanceKm < 50 ? "🎯 Direct Hit!" : distanceKm < 500 ? "👍 Very Close!" : distanceKm < 2000 ? "😬 Nice Try" : "🌍 Long Distance"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider">TOTAL SCORE</p>
            <p className="text-white font-bold text-lg tracking-wide">{totalScore.toLocaleString()}</p>
          </div>
        </div>

        {/* Map */}
        <ResultMap
          trueLat={trueLat}
          trueLng={trueLng}
          guessLat={guessLat}
          guessLng={guessLng}
        />

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-xs font-sans border-b border-surface-800/50 pb-3 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-surface-400">Target Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" />
            <span className="text-surface-400">Your Guess</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 border-t border-dashed border-indigo-400" />
            <span className="text-surface-400">Distance</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 font-sans">
          <div className="bg-surface-950 border border-surface-800 p-4 text-center rounded-xl">
            <p className="text-surface-400 text-xs font-semibold">Distance</p>
            <p className="text-white font-bold text-lg mt-1 tracking-wide">
              {distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m`
                : `${distanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`}
            </p>
          </div>
          <div className="bg-surface-950 border border-surface-800 p-4 text-center rounded-xl">
            <p className="text-surface-400 text-xs font-semibold">Round Score</p>
            <p className={`font-bold text-lg mt-1 tracking-wide ${scoreColor}`}>
              +{score.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 font-sans">
          <div className="flex justify-between text-xs text-surface-400 mb-1">
            <span>0</span>
            <span>5,000 max</span>
          </div>
          <ScoreBar score={score} />
        </div>

        {/* CTA */}
        <button
          id="result-next-btn"
          onClick={onNext}
          disabled={loading}
          className="btn-primary w-full mt-6 text-xs font-sans font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin w-4 h-4 text-surface-950" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
              </svg>
              Saving score...
            </span>
          ) : isLastRound ? (
            "🏁 Final Summary"
          ) : (
            "Next Round →"
          )}
        </button>
      </div>
    </div>
  );
}
