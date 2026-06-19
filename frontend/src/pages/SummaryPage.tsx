/**
 * SummaryPage.tsx
 * Final game summary: all rounds listed with scores, total, and save prompt.
 */

import { useState } from "react";
import type { GameSummary, AuthState } from "../types";

interface Props {
  summary: GameSummary;
  auth: AuthState;
  onHome: () => void;
  onLeaderboard: () => void;
  onShowAuth: () => void;
}

const MAX_TOTAL = 25000; // 5 rounds × 5000

function ScoreGrade({ total }: { total: number }) {
  const pct = total / MAX_TOTAL;
  if (pct >= 0.9) return <span className="text-emerald-400">🥇 World-class!</span>;
  if (pct >= 0.7) return <span className="text-yellow-400">🥈 Impressive!</span>;
  if (pct >= 0.5) return <span className="text-orange-400">🥉 Good effort!</span>;
  return <span className="text-red-400">🌍 Keep exploring!</span>;
}

export function SummaryPage({ summary, auth, onHome, onLeaderboard, onShowAuth }: Props) {
  const [saved] = useState(!!auth.user); // auto-saved if logged in

  const pct = Math.round((summary.totalScore / MAX_TOTAL) * 100);

  return (
    <div className="min-h-dvh bg-surface-950 bg-grid flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-xl w-full animate-slide-up">

        {/* Score card */}
        <div className="card text-center mb-6 glow-brand">
          <div className="text-5xl mb-3">🏁</div>
          <h1 className="font-display font-extrabold text-4xl text-gradient mb-1">
            Game Over!
          </h1>
          <p className="text-surface-400 mb-4">
            Region: <span className="text-surface-200 font-semibold">{summary.region}</span>
          </p>

          <div className="text-6xl font-bold font-display text-surface-50 my-4">
            {summary.totalScore.toLocaleString()}
          </div>
          <div className="text-lg mb-4">
            <ScoreGrade total={summary.totalScore} />
          </div>

          {/* Total score bar */}
          <div className="w-full bg-surface-800 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-surface-500 text-xs">{pct}% of maximum {MAX_TOTAL.toLocaleString()} pts</p>
        </div>

        {/* Round breakdown */}
        <div className="card mb-6">
          <h2 className="font-display font-bold text-lg text-surface-200 mb-4">Round Breakdown</h2>
          <div className="space-y-3">
            {summary.rounds.map((r) => {
              const roundPct = r.score ? Math.round((r.score / 5000) * 100) : 0;
              const barColor =
                roundPct > 75
                  ? "from-emerald-500 to-green-400"
                  : roundPct > 40
                  ? "from-yellow-500 to-amber-400"
                  : "from-red-600 to-orange-500";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-3 bg-surface-800/50 rounded-xl"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-surface-700 flex items-center justify-center text-sm font-bold text-surface-200">
                    {r.roundNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-surface-400 mb-1">
                      <span>
                        {r.distanceKm != null
                          ? r.distanceKm < 1
                            ? `${Math.round(r.distanceKm * 1000)} m away`
                            : `${r.distanceKm.toFixed(1)} km away`
                          : "—"}
                      </span>
                      <span className="font-semibold text-surface-200">
                        +{r.score?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                    <div className="w-full bg-surface-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                        style={{ width: `${roundPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save / Login prompt */}
        {!auth.user ? (
          <div className="card mb-6 border-brand-600/30 bg-brand-600/5">
            <p className="text-surface-300 text-sm mb-3 text-center">
              🔒 Log in to save your score to the leaderboard!
            </p>
            <button
              id="summary-login-btn"
              onClick={onShowAuth}
              className="btn-primary w-full"
            >
              Login / Sign up to Save Score
            </button>
          </div>
        ) : (
          <div className="card mb-6 border-emerald-500/30 bg-emerald-500/5 text-center">
            {saved && <p className="text-emerald-400 font-semibold">✅ Score saved to the leaderboard!</p>}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button id="summary-home-btn" onClick={onHome} className="btn-secondary flex-1">
            🏠 Play Again
          </button>
          <button id="summary-leaderboard-btn" onClick={onLeaderboard} className="btn-primary flex-1">
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
