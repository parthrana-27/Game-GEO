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
  if (pct >= 0.9) return <span className="text-brand-400 font-mono font-bold tracking-wider">🥇 SYS_RATING // EXCELLENT</span>;
  if (pct >= 0.7) return <span className="text-amber-400 font-mono font-bold tracking-wider">🥈 SYS_RATING // OPTIMAL</span>;
  if (pct >= 0.5) return <span className="text-orange-400 font-mono font-bold tracking-wider">🥉 SYS_RATING // ACCEPTABLE</span>;
  return <span className="text-red-400 font-mono font-bold tracking-wider">🌍 SYS_RATING // SUB-OPTIMAL</span>;
}

export function SummaryPage({ summary, auth, onHome, onLeaderboard, onShowAuth }: Props) {
  const [saved] = useState(!!auth.user); // auto-saved if logged in

  const pct = Math.round((summary.totalScore / MAX_TOTAL) * 100);

  return (
    <div className="min-h-dvh bg-surface-950 bg-grid scanline flex flex-col items-center justify-start py-12 px-4 relative overflow-hidden">
      <div className="max-w-xl w-full animate-slide-up relative z-10">

        {/* Score card */}
        <div className="card text-center mb-6 bg-surface-900 border border-surface-800 rounded-none relative p-6 glow-brand">
          <span className="tactical-corner-tl"></span>
          <span className="tactical-corner-tr"></span>
          <span className="tactical-corner-bl"></span>
          <span className="tactical-corner-br"></span>

          <div className="text-4xl mb-3">🏁</div>
          <h1 className="font-mono font-bold text-2xl text-gradient uppercase tracking-widest mb-1">
            SESSION CONCLUDED
          </h1>
          <p className="text-surface-500 font-mono text-xs uppercase mb-6">
            SECTOR: <span className="text-surface-300 font-bold">{summary.region}</span>
          </p>

          <div className="text-5xl font-mono font-bold text-surface-50 tracking-wider my-4">
            {summary.totalScore.toLocaleString()}
          </div>
          <div className="mb-6">
            <ScoreGrade total={summary.totalScore} />
          </div>

          {/* Total score bar */}
          <div className="w-full bg-surface-950 border border-surface-800 h-3 overflow-hidden p-[1px] mb-2">
            <div
              className="h-full bg-brand-500 shadow-[0_0_8px_rgba(0,255,60,0.4)] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-surface-500 font-mono text-[10px] uppercase">
            Efficiency Level: {pct}% of {MAX_TOTAL.toLocaleString()} max credits
          </p>
        </div>

        {/* Round breakdown */}
        <div className="card mb-6 bg-surface-900 border border-surface-800 rounded-none relative p-6">
          <span className="tactical-corner-tl opacity-45"></span>
          <span className="tactical-corner-tr opacity-45"></span>
          <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-surface-200 mb-4 border-b border-surface-800 pb-2">
            TELEMETRY BREAKDOWN
          </h2>
          <div className="space-y-3">
            {summary.rounds.map((r) => {
              const roundPct = r.score ? Math.round((r.score / 5000) * 100) : 0;
              const barColor =
                roundPct > 75
                  ? "bg-brand-500 shadow-[0_0_6px_rgba(0,255,60,0.3)]"
                  : roundPct > 40
                  ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]"
                  : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.3)]";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-3 bg-surface-950/70 border border-surface-850 font-mono"
                >
                  <div className="w-7 h-7 flex-shrink-0 border border-surface-800 bg-surface-900 flex items-center justify-center text-xs font-bold text-brand-400">
                    {r.roundNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[11px] text-surface-400 mb-1.5">
                      <span>
                        OFFSET // {r.distanceKm != null
                          ? r.distanceKm < 1
                            ? `${Math.round(r.distanceKm * 1000)} m`
                            : `${r.distanceKm.toFixed(1)} km`
                          : "—"}
                      </span>
                      <span className="font-bold text-surface-200">
                        +{r.score?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                    <div className="w-full bg-surface-900 border border-surface-850 h-2 p-[1px] overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-700`}
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
          <div className="card mb-6 border-brand-500/20 bg-brand-500/5 rounded-none relative p-6 text-center">
            <span className="tactical-corner-tl"></span>
            <span className="tactical-corner-tr"></span>
            <p className="text-surface-300 font-mono text-xs mb-4">
              🔒 AUTHENTICATE TO SUBMIT COGNITIVE DATA TO LEADERBOARD
            </p>
            <button
              id="summary-login-btn"
              onClick={onShowAuth}
              className="btn-primary w-full text-xs font-mono tracking-wider py-3"
            >
              LOGIN / CREATE ACCOUNT
            </button>
          </div>
        ) : (
          <div className="card mb-6 border-brand-500/20 bg-brand-500/5 rounded-none relative p-4 text-center font-mono text-xs text-brand-400 font-bold uppercase tracking-wider">
            {saved && "✅ Core system sync successful. Score recorded."}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button id="summary-home-btn" onClick={onHome} className="btn-secondary flex-1 font-mono tracking-widest text-xs py-3.5">
            🏠 RESTART SYS
          </button>
          <button id="summary-leaderboard-btn" onClick={onLeaderboard} className="btn-primary flex-1 font-mono tracking-widest text-xs py-3.5">
            🏆 RANKINGS
          </button>
        </div>
      </div>
    </div>
  );
}
