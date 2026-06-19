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
      ? "from-emerald-500 to-green-400"
      : pct > 40
      ? "from-yellow-500 to-amber-400"
      : "from-red-600 to-orange-500";

  return (
    <div className="w-full bg-surface-800 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
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
      ? "text-emerald-400"
      : score > 2000
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-lg w-full animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-surface-400 text-sm uppercase tracking-widest font-semibold">
              Round {roundNumber} Result
            </p>
            <h2 className="text-2xl font-display font-bold text-surface-50 mt-0.5">
              {distanceKm < 50 ? "🎯 Incredible!" : distanceKm < 500 ? "👍 Not Bad!" : distanceKm < 2000 ? "😬 Getting there..." : "🌍 Way off!"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-surface-400 text-xs">Total Score</p>
            <p className="text-brand-400 font-bold text-xl">{totalScore.toLocaleString()}</p>
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
        <div className="flex gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-surface-300">True location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-brand-500" />
            <span className="text-surface-300">Your guess</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 border-t-2 border-dashed border-violet-400" />
            <span className="text-surface-300">Distance</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-surface-800 rounded-xl p-4 text-center">
            <p className="text-surface-400 text-xs uppercase tracking-wider">Distance</p>
            <p className="text-surface-50 font-bold text-xl mt-1">
              {distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m`
                : `${distanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`}
            </p>
          </div>
          <div className="bg-surface-800 rounded-xl p-4 text-center">
            <p className="text-surface-400 text-xs uppercase tracking-wider">Round Score</p>
            <p className={`font-bold text-xl mt-1 ${scoreColor}`}>
              +{score.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-surface-500 mb-1">
            <span>0</span>
            <span>5,000</span>
          </div>
          <ScoreBar score={score} />
        </div>

        {/* CTA */}
        <button
          id="result-next-btn"
          onClick={onNext}
          disabled={loading}
          className="btn-primary w-full mt-6 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
              </svg>
              Loading…
            </span>
          ) : isLastRound ? (
            "🏁 See Final Summary"
          ) : (
            "Next Round →"
          )}
        </button>
      </div>
    </div>
  );
}
