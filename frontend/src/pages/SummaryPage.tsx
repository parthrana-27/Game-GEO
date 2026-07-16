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
  if (pct >= 0.9) return <span className="text-white font-sans font-bold tracking-wide">🥇 Excellent Performance</span>;
  if (pct >= 0.7) return <span className="text-indigo-300 font-sans font-bold tracking-wide">🥈 Good Game</span>;
  if (pct >= 0.5) return <span className="text-surface-300 font-sans font-bold tracking-wide">🥉 Nice Try</span>;
  return <span className="text-surface-400 font-sans font-bold tracking-wide">🌍 Hard Luck</span>;
}

export function SummaryPage({ summary, auth, onHome, onLeaderboard, onShowAuth }: Props) {
  const [saved] = useState(!!auth.user); // auto-saved if logged in

  const pct = Math.round((summary.totalScore / MAX_TOTAL) * 100);

  return (
    <div className="min-h-dvh bg-surface-950 bg-grid flex flex-col items-center justify-start py-12 px-4 relative overflow-hidden font-sans">
      <div className="max-w-xl w-full animate-slide-up relative z-10">

        {/* Score card */}
        <div className="card text-center mb-6 bg-surface-900 border border-surface-800 rounded-2xl relative p-6 glow-brand">
          <div className="text-4xl mb-3 select-none font-sans">🏆</div>
          <h1 className="font-sans font-extrabold text-2xl text-gradient uppercase tracking-wide mb-1">
            Session Completed
          </h1>
          <p className="text-surface-400 text-xs font-sans mb-6">
            Region: <span className="text-white font-bold">{summary.region}</span>
          </p>

          <div className="text-5xl font-mono font-bold text-white tracking-wide my-4 select-all">
            {summary.totalScore.toLocaleString()}
          </div>
          <div className="mb-6">
            <ScoreGrade total={summary.totalScore} />
          </div>

          {/* Total score bar */}
          <div className="w-full bg-surface-950 border border-surface-800 h-3 overflow-hidden p-[1px] mb-2 rounded-full">
            <div
              className="h-full bg-white shadow-md transition-all duration-1000 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-surface-400 font-sans text-xs">
            Efficiency Level: {pct}% of {MAX_TOTAL.toLocaleString()} max score
          </p>
        </div>

        {/* Round breakdown */}
        <div className="card mb-6 bg-surface-900 border border-surface-800 rounded-2xl relative p-6">
          <h2 className="font-sans font-bold text-sm tracking-wide uppercase text-surface-200 mb-4 border-b border-surface-800 pb-2">
            Round Breakdown
          </h2>
          <div className="space-y-3">
            {summary.rounds.map((r) => {
              const roundPct = r.score ? Math.round((r.score / 5000) * 100) : 0;
              const barColor =
                roundPct > 75
                  ? "bg-white"
                  : roundPct > 40
                  ? "bg-indigo-500"
                  : "bg-surface-700";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-3 bg-surface-950/70 border border-surface-800 font-sans rounded-xl"
                >
                  <div className="w-7 h-7 flex-shrink-0 border border-surface-800 bg-surface-900 flex items-center justify-center text-xs font-bold text-white rounded-lg">
                    {r.roundNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                      <span>
                        Distance: {r.distanceKm != null
                          ? r.distanceKm < 1
                            ? `${Math.round(r.distanceKm * 1000)} m`
                            : `${r.distanceKm.toFixed(1)} km`
                          : "—"}
                      </span>
                      <span className="font-bold text-white font-mono">
                        +{r.score?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                    <div className="w-full bg-surface-900 border border-surface-800 h-2 p-[1px] overflow-hidden rounded-full">
                      <div
                        className={`h-full ${barColor} transition-all duration-700 rounded-full`}
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
          <div className="card mb-6 border-surface-800 bg-surface-900/50 rounded-2xl relative p-6 text-center">
            <p className="text-surface-300 font-sans text-xs mb-4">
              🔒 Sign in to save your score to the leaderboard
            </p>
            <button
              id="summary-login-btn"
              onClick={onShowAuth}
              className="btn-primary w-full text-xs font-sans tracking-wide py-3"
            >
              Sign In / Sign Up
            </button>
          </div>
        ) : (
          <div className="card mb-6 border-surface-800 bg-surface-900/30 rounded-2xl relative p-4 text-center font-sans text-xs text-indigo-400 font-bold uppercase tracking-wider">
            {saved && "✅ Score saved successfully to the leaderboard"}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button id="summary-home-btn" onClick={onHome} className="btn-secondary flex-1 font-sans tracking-wider text-xs py-3.5">
            🏠 Play Again
          </button>
          <button id="summary-leaderboard-btn" onClick={onLeaderboard} className="btn-primary flex-1 font-sans tracking-wider text-xs py-3.5">
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
