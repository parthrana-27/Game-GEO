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
  { value: "GLOBAL", label: "Global", emoji: "🌐" },
  { value: "WORLD", label: "World", emoji: "🌍" },
  { value: "INDIA", label: "India", emoji: "🇮🇳" },
  { value: "CITY_SURAT", label: "Surat", emoji: "🏙️" },
];

function getRankEmoji(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
    <div className="min-h-dvh bg-surface-950 bg-grid flex flex-col items-center px-4 py-10">
      <div className="max-w-2xl w-full animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-gradient">
              🏆 Leaderboard
            </h1>
            <p className="text-surface-400 text-sm mt-1">Top 20 scores across regions</p>
          </div>
          <button id="leaderboard-home-btn" onClick={onHome} className="btn-secondary text-sm px-4 py-2">
            ← Home
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-900 rounded-xl border border-surface-800 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              id={`leaderboard-tab-${tab.value.toLowerCase()}`}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.value
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-800"
                }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="px-6 py-8 text-center text-red-400">{error}</div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-surface-300 font-semibold">No scores yet!</p>
              <p className="text-surface-500 text-sm mt-1">Complete a game to appear here.</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left px-5 py-3 text-surface-400 font-medium w-12">#</th>
                  <th className="text-left px-3 py-3 text-surface-400 font-medium">Player</th>
                  <th className="text-right px-3 py-3 text-surface-400 font-medium">Score</th>
                  <th className="text-right px-3 py-3 text-surface-400 font-medium hidden sm:table-cell">Region</th>
                  <th className="text-right px-5 py-3 text-surface-400 font-medium hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.gameId}
                    className="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-bold text-base">
                      {getRankEmoji(idx + 1)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-surface-200 font-medium">
                        {entry.email
                          ? entry.email.split("@")[0]
                          : "Guest"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-bold text-brand-400 font-mono">
                        {entry.totalScore.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right hidden sm:table-cell">
                      <span className="score-badge text-xs">{entry.region}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-surface-500 hidden sm:table-cell">
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
