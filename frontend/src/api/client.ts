/**
 * client.ts
 * Typed API client for StreetSight backend.
 * All fetch calls go through here.
 */

import type {
  GameStartResponse,
  RoundLocationResponse,
  GuessResult,
  GameSummary,
  LeaderboardEntry,
  Region,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("ss_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiSignup(email: string, password: string) {
  return request<{ message: string; user: { id: string; email: string } }>(
    "/auth/signup",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export async function apiSignin(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string } }>(
    "/auth/signin",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

// ── Game ─────────────────────────────────────────────────────────────────────

export async function apiStartGame(region: Region): Promise<GameStartResponse> {
  return request<GameStartResponse>("/game/start", {
    method: "POST",
    body: JSON.stringify({ region }),
  });
}

export async function apiGetRound(gameId: string): Promise<RoundLocationResponse> {
  return request<RoundLocationResponse>(`/game/round?gameId=${gameId}`);
}

export async function apiSubmitGuess(
  gameId: string,
  lat: number,
  lng: number
): Promise<GuessResult> {
  return request<GuessResult>("/game/guess", {
    method: "POST",
    body: JSON.stringify({ gameId, lat, lng }),
  });
}

export async function apiNextRound(gameId: string) {
  return request<{ gameId: string; roundNumber: number; totalRounds: number }>(
    "/game/next",
    { method: "POST", body: JSON.stringify({ gameId }) }
  );
}

export async function apiGetSummary(gameId: string): Promise<GameSummary> {
  return request<GameSummary>(`/game/summary?gameId=${gameId}`);
}

// ── Leaderboard ──────────────────────────────────────────────────────────────

export async function apiGetLeaderboard(
  region?: string
): Promise<{ entries: LeaderboardEntry[] }> {
  const qs = region ? `?region=${region}` : "";
  return request<{ entries: LeaderboardEntry[] }>(`/leaderboard${qs}`);
}
