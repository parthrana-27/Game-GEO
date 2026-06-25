/**
 * LeaderboardPage.tsx
 * Global and per-region leaderboard tabs.
 */

import { useState, useEffect } from "react";
import { apiGetLeaderboard } from "../api/client";
import type { LeaderboardEntry } from "../types";

interface Props {
  onHome: () => void;
}

type Tab = "GLOBAL" | "WORLD" | "INDIA" | "CITY_SURAT";

const TABS: { value: Tab; label: string; emoji: string }[] = [
  { value: "GLOBAL", label: "GLOBAL NET", emoji: "🌐" },
  { value: "WORLD", label: "WORLD GRID", emoji: "🌍" },
  { value: "INDIA", label: "INDIA SEC", emoji: "🇮🇳" },
  { value: "CITY_SURAT", label: "SURAT LOC", emoji: "🏙️" },
];

function getRankBadge(rank: number) {
  const pad = rank.toString().padStart(2, "0");
  if (rank === 1) return <span className="text-brand-400 font-mono font-bold">[{pad}]</span>;
  if (rank === 2) return <span className="text-amber-400 font-mono font-bold">[{pad}]</span>;
  if (rank === 3) return <span className="text-orange-400 font-mono font-bold">[{pad}]</span>;
  return <span className="text-surface-500 font-mono">[{pad}]</span>;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10).replace(/-/g, ".");
  } catch {
    return "----.--.--";
  }
}

export function LeaderboardPage({ onHome }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("GLOBAL");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const region = activeTab === "GLOBAL" ? undefined : activeTab;
    apiGetLeaderboard(region)
      .then((data) => setEntries(data.entries))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load leaderboard")
      )
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="min-h-dvh bg-surface-950 bg-grid scanline flex flex-col items-center px-4 py-10 relative overflow-hidden">
      <div className="max-w-2xl w-full animate-slide-up relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-surface-800 pb-4">
          <div>
            <h1 className="font-mono font-bold text-2xl uppercase tracking-widest text-gradient">
              🏆 STANDINGS BOARD
            </h1>
            <p className="text-surface-500 font-mono text-[10px] uppercase mt-1">TOP 20 COGNITIVE COORD ALIGNMENTS</p>
          </div>
          <button id="leaderboard-home-btn" onClick={onHome} className="btn-secondary text-xs px-4 py-2 font-mono">
            ← RETURN
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-surface-900 border border-surface-800 rounded-none mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              id={`leaderboard-tab-${tab.value.toLowerCase()}`}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-none text-xs font-mono font-bold tracking-wider transition-all duration-150
                ${activeTab === tab.value
                  ? "bg-brand-500 text-surface-950 border border-brand-400"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/40"
                }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="card bg-surface-900/90 border border-surface-800 p-0 overflow-hidden relative">
          <span className="tactical-corner-tl"></span>
          <span className="tactical-corner-tr"></span>
          <span className="tactical-corner-bl"></span>
          <span className="tactical-corner-br"></span>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent animate-spin" />
            </div>
          )}

          {error && (
            <div className="px-6 py-8 text-center text-red-400 font-mono text-xs">{error}</div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="px-6 py-12 text-center font-mono">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-surface-300 text-sm uppercase tracking-wider font-bold">NO ALIGNMENT RECORDS</p>
              <p className="text-surface-500 text-[10px] uppercase mt-1">Complete a gaming sequence to sync data.</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-surface-800 bg-surface-950/40">
                  <th className="px-5 py-3 text-surface-500 font-bold uppercase tracking-wider w-16">RANK</th>
                  <th className="px-3 py-3 text-surface-500 font-bold uppercase tracking-wider">OPERATOR ID</th>
                  <th className="px-3 py-3 text-surface-500 font-bold uppercase tracking-wider text-right">CREDITS</th>
                  <th className="px-3 py-3 text-surface-500 font-bold uppercase tracking-wider text-right hidden sm:table-cell">SECTOR</th>
                  <th className="px-5 py-3 text-surface-500 font-bold uppercase tracking-wider text-right hidden sm:table-cell">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.gameId}
                    className="border-b border-surface-800/50 hover:bg-surface-800/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold">
                      {getRankBadge(idx + 1)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-surface-200 font-semibold">
                        {entry.email
                          ? entry.email.split("@")[0].toUpperCase()
                          : "GUEST_OPERATOR"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="font-bold text-brand-400 tracking-wider">
                        {entry.totalScore.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right hidden sm:table-cell">
                      <span className="score-badge text-[9px] font-mono tracking-widest">{entry.region}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-surface-500 hidden sm:table-cell">
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
