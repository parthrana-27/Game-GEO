// Shared TypeScript types for the StreetSight frontend

export type Region = "WORLD" | "INDIA" | "CITY_SURAT";

export interface GameStartResponse {
  gameId: string;
  roundNumber: number;
  totalRounds: number;
}

export interface RoundLocationResponse {
  gameId: string;
  roundNumber: number;
  totalRounds: number;
  streetViewLat: number;
  streetViewLng: number;
  locationId: string;
  totalScore: number;
}

export interface GuessResult {
  roundNumber: number;
  trueLat: number;
  trueLng: number;
  guessLat: number;
  guessLng: number;
  distanceKm: number;
  score: number;
  totalScore: number;
  isLastRound: boolean;
}

export interface RoundSummary {
  id: string;
  roundNumber: number;
  trueLat: number;
  trueLng: number;
  guessLat: number | null;
  guessLng: number | null;
  distanceKm: number | null;
  score: number | null;
}

export interface GameSummary {
  id: string;
  totalScore: number;
  region: string;
  completed: boolean;
  rounds: RoundSummary[];
  user: { email: string } | null;
}

export interface LeaderboardEntry {
  gameId: string;
  userId: string | null;
  email: string | null;
  totalScore: number;
  region: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

/** Game phases driving which screen to show. */
export type GamePhase =
  | "idle"        // Home
  | "playing"     // In-game: Street View + map
  | "result"      // Round result overlay
  | "summary"     // Final game summary
  | "leaderboard";
