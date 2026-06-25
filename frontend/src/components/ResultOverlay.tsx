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
      ? "bg-brand-500 shadow-[0_0_8px_rgba(0,255,60,0.4)]"
      : pct > 40
      ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
      : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";

  return (
    <div className="w-full bg-surface-950 border border-surface-800 h-3 overflow-hidden p-[1px]">
      <div
        className={`h-full ${color} transition-all duration-1000`}
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
      ? "text-brand-400"
      : score > 2000
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-lg w-full bg-surface-900 border border-surface-800 rounded-none p-6 relative animate-slide-up max-h-[95vh] overflow-y-auto">
        <span className="tactical-corner-tl"></span>
        <span className="tactical-corner-tr"></span>
        <span className="tactical-corner-bl"></span>
        <span className="tactical-corner-br"></span>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-surface-800/80 pb-4">
          <div>
            <p className="text-surface-500 text-[10px] font-mono uppercase tracking-widest font-bold">
              TELEMETRY ANALYSIS // ROUND_0{roundNumber}
            </p>
            <h2 className="text-xl font-mono font-bold text-surface-50 uppercase mt-1">
              {distanceKm < 50 ? "🎯 DIRECT HIT" : distanceKm < 500 ? "👍 CLOSE PROXIMITY" : distanceKm < 2000 ? "😬 MARGINAL OFFSET" : "🌍 SIGNAL LOST"}
            </h2>
          </div>
          <div className="text-right font-mono">
            <p className="text-surface-500 text-[10px] uppercase font-bold tracking-wider">TOTAL SCORE</p>
            <p className="text-brand-400 font-bold text-lg tracking-wider">{totalScore.toLocaleString()}</p>
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
        <div className="flex gap-4 mt-3 text-[10px] font-mono uppercase border-b border-surface-800/50 pb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-emerald-500" />
            <span className="text-surface-400">Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-brand-500" />
            <span className="text-surface-400">Guess</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 border-t border-dashed border-violet-400" />
            <span className="text-surface-400">Delta Link</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 font-mono">
          <div className="bg-surface-950 border border-surface-800/80 p-4 text-center">
            <p className="text-surface-500 text-[9px] uppercase tracking-wider font-bold">CALCULATED OFFSET</p>
            <p className="text-surface-50 font-bold text-lg mt-1 tracking-wider">
              {distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m`
                : `${distanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`}
            </p>
          </div>
          <div className="bg-surface-950 border border-surface-800/80 p-4 text-center">
            <p className="text-surface-500 text-[9px] uppercase tracking-wider font-bold">ROUND CREDITS</p>
            <p className={`font-bold text-lg mt-1 tracking-wider ${scoreColor}`}>
              +{score.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 font-mono">
          <div className="flex justify-between text-[9px] text-surface-500 mb-1">
            <span>0000_MIN</span>
            <span>5000_MAX</span>
          </div>
          <ScoreBar score={score} />
        </div>

        {/* CTA */}
        <button
          id="result-next-btn"
          onClick={onNext}
          disabled={loading}
          className="btn-primary w-full mt-6 text-xs font-mono font-bold tracking-widest uppercase"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin w-4 h-4 text-surface-950" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
              </svg>
              PROCESSING DATA...
            </span>
          ) : isLastRound ? (
            "🏁 COMMENCE EVALUATION"
          ) : (
            "NEXT ROUND →"
          )}
        </button>
      </div>
    </div>
  );
}
