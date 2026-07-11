/**
 * gameService.ts
 * Core game logic: starting games, advancing rounds, processing guesses.
 */

import prisma from "../utils/db";
import { haversine } from "../utils/haversine";
import { calculateScore } from "../utils/scoring";

const ROUNDS_PER_GAME = 5;

type Region = "WORLD" | "INDIA" | "CITY_SURAT";

/** Pick a random location from the specified region. */
async function pickLocation(region: Region, excludeIds: string[] = []) {
  const count = await prisma.location.count({
    where: { region, NOT: { id: { in: excludeIds } } },
  });
  if (count === 0) throw new Error(`No locations available for region: ${region}`);

  const skip = Math.floor(Math.random() * count);
  const [location] = await prisma.location.findMany({
    where: { region, NOT: { id: { in: excludeIds } } },
    skip,
    take: 1,
  });
  return location;
}

/** Start a new game and immediately create round 1. */
export async function startGame(region: Region, userId?: string) {
  const location = await pickLocation(region);

  const game = await prisma.game.create({
    data: {
      userId: userId ?? null,
      region,
      totalScore: 0,
    },
  });

  const round = await prisma.round.create({
    data: {
      gameId: game.id,
      roundNumber: 1,
      locationId: location.id,
      trueLat: location.lat,
      trueLng: location.lng,
    },
  });

  return {
    gameId: game.id,
    roundNumber: round.roundNumber,
    totalRounds: ROUNDS_PER_GAME,
    // Do NOT reveal true location to client here
  };
}

/** Get the Street View location for the current round (hidden from client until guess). */
export async function getCurrentRoundLocation(gameId: string) {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new Error("Game not found");
  if (game.completed) throw new Error("Game already completed");

  const round = await prisma.round.findFirst({
    where: { gameId, completed: false },
    orderBy: { roundNumber: "asc" },
    include: { location: true },
  });

  if (!round) throw new Error("No active round found");

  return {
    gameId,
    roundNumber: round.roundNumber,
    totalRounds: ROUNDS_PER_GAME,
    streetViewLat: round.trueLat,
    streetViewLng: round.trueLng,
    locationId: round.locationId,
    totalScore: game.totalScore,
  };
}

/** Accept a player's guess, compute result, and optionally advance to next round. */
export async function processGuess(
  gameId: string,
  guessLat: number,
  guessLng: number
) {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new Error("Game not found");
  if (game.completed) throw new Error("Game is already completed");

  const round = await prisma.round.findFirst({
    where: { gameId, completed: false },
    orderBy: { roundNumber: "asc" },
  });
  if (!round) throw new Error("No active round found");

  const distanceKm = haversine(round.trueLat, round.trueLng, guessLat, guessLng);
  const score = calculateScore(distanceKm);

  const updatedRound = await prisma.round.update({
    where: { id: round.id },
    data: {
      guessLat,
      guessLng,
      distanceKm,
      score,
      completed: true,
    },
  });

  const newTotalScore = game.totalScore + score;
  const isLastRound = round.roundNumber >= ROUNDS_PER_GAME;

  await prisma.game.update({
    where: { id: gameId },
    data: {
      totalScore: newTotalScore,
      completed: isLastRound,
    },
  });

  return {
    roundNumber: round.roundNumber,
    trueLat: round.trueLat,
    trueLng: round.trueLng,
    guessLat,
    guessLng,
    distanceKm: Math.round(distanceKm * 100) / 100,
    score,
    totalScore: newTotalScore,
    isLastRound,
  };
}

/** Advance to next round (creates a new round record). */
export async function nextRound(gameId: string) {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new Error("Game not found");
  if (game.completed) throw new Error("Game is already completed");

  // Find the last completed round
  const lastRound = await prisma.round.findFirst({
    where: { gameId, completed: true },
    orderBy: { roundNumber: "desc" },
  });
  if (!lastRound) throw new Error("No completed round found — submit a guess first");

  const nextRoundNumber = lastRound.roundNumber + 1;
  if (nextRoundNumber > ROUNDS_PER_GAME) throw new Error("All rounds completed");

  // Check if next round already exists
  const existing = await prisma.round.findFirst({
    where: { gameId, roundNumber: nextRoundNumber },
  });
  if (existing) {
    return { gameId, roundNumber: nextRoundNumber, totalRounds: ROUNDS_PER_GAME };
  }

  // Get IDs of locations already used in this game
  const usedRounds = await prisma.round.findMany({
    where: { gameId },
    select: { locationId: true },
  });
  const excludeIds = usedRounds.map((r) => r.locationId);

  const location = await pickLocation(game.region as Region, excludeIds);

  await prisma.round.create({
    data: {
      gameId,
      roundNumber: nextRoundNumber,
      locationId: location.id,
      trueLat: location.lat,
      trueLng: location.lng,
    },
  });

  return { gameId, roundNumber: nextRoundNumber, totalRounds: ROUNDS_PER_GAME };
}

/** Get the final summary for a completed game. */
export async function getGameSummary(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      rounds: { orderBy: { roundNumber: "asc" } },
      user: { select: { email: true } },
    },
  });
  if (!game) throw new Error("Game not found");

  return game;
}
