/**
 * scoring.test.ts
 * Unit tests for the scoring function.
 */

import { describe, it, expect } from "vitest";
import { calculateScore } from "../src/utils/scoring";

describe("calculateScore", () => {
  it("returns max score (5000) for distance 0", () => {
    expect(calculateScore(0)).toBe(5000);
  });

  it("returns max score for negative distance (edge case)", () => {
    expect(calculateScore(-1)).toBe(5000);
  });

  it("returns a high score for very short distances", () => {
    const score = calculateScore(10); // 10 km
    expect(score).toBeGreaterThan(4900);
  });

  it("returns a moderate score for medium distances (~1000 km)", () => {
    const score = calculateScore(1000);
    expect(score).toBeGreaterThan(1000);
    expect(score).toBeLessThan(4000);
  });

  it("returns a lower score for large distances (~5000 km)", () => {
    const score = calculateScore(5000);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(2000);
  });

  it("score is non-negative for extreme distances", () => {
    const score = calculateScore(20000);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("score decreases monotonically with distance", () => {
    const distances = [0, 100, 500, 1000, 5000, 10000];
    const scores = distances.map(calculateScore);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
    }
  });
});
