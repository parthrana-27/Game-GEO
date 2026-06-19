/**
 * scoring.ts
 * Maps a distance in km to a 0–5000 point score.
 *
 * Formula: exponential decay so that:
 *   - 0 km   → 5000 pts
 *   - ~50 km → ~4700 pts (still great)
 *   - ~500 km → ~3500 pts
 *   - ~2000 km → ~1500 pts
 *   - ≥ 10000 km → ~0 pts
 */

const MAX_SCORE = 5000;
const DECAY_CONSTANT = 2000; // controls how fast score falls off

/**
 * Calculates the round score from a distance.
 * @param distanceKm - Distance between guess and true location in km
 * @returns Integer score between 0 and 5000
 */
export function calculateScore(distanceKm: number): number {
  if (distanceKm <= 0) return MAX_SCORE;
  const score = MAX_SCORE * Math.exp(-distanceKm / DECAY_CONSTANT);
  return Math.max(0, Math.round(score));
}
