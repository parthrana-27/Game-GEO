/**
 * leaderboardService.ts
 * Fetches top scores with Redis caching.
 * Cache TTL: 60 seconds (configurable).
 */

import prisma from "../utils/db";
import { cacheGet, cacheSet } from "./cacheService";

const CACHE_TTL = 60; // seconds
const TOP_N = 20;

export interface LeaderboardEntry {
  gameId: string;
  userId: string | null;
  email: string | null;
  totalScore: number;
  region: string;
  createdAt: Date;
}

/**
 * Get top N scores, optionally filtered by region.
 * Results are cached in Redis.
 */
export async function getTopScores(region?: string): Promise<LeaderboardEntry[]> {
  const cacheKey = `leaderboard:${region ?? "GLOBAL"}`;

  // 1. Try cache
  const cached = await cacheGet(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as LeaderboardEntry[];
    } catch {
      // corrupted cache — fall through
    }
  }

  // 2. Query DB
  const where = region && region !== "GLOBAL" ? { region, completed: true } : { completed: true };

  const games = await prisma.game.findMany({
    where,
    orderBy: { totalScore: "desc" },
    take: TOP_N,
    include: { user: { select: { email: true } } },
  });

  const entries: LeaderboardEntry[] = games.map((g) => ({
    gameId: g.id,
    userId: g.userId,
    email: g.user?.email ?? null,
    totalScore: g.totalScore,
    region: g.region,
    createdAt: g.createdAt,
  }));

  // 3. Store in cache
  await cacheSet(cacheKey, JSON.stringify(entries), CACHE_TTL);

  return entries;
}
