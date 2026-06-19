/**
 * haversine.test.ts
 * Unit tests for the haversine distance formula.
 */

import { describe, it, expect } from "vitest";
import { haversine } from "../src/utils/haversine";

describe("haversine", () => {
  it("returns 0 for identical points", () => {
    expect(haversine(0, 0, 0, 0)).toBe(0);
    expect(haversine(48.8584, 2.2945, 48.8584, 2.2945)).toBe(0);
  });

  it("calculates Paris → London correctly (~341 km)", () => {
    const dist = haversine(48.8584, 2.2945, 51.5007, -0.1246);
    expect(dist).toBeGreaterThan(335);
    expect(dist).toBeLessThan(350);
  });

  it("calculates New York → Los Angeles correctly (~3940 km)", () => {
    const dist = haversine(40.7128, -74.006, 34.0522, -118.2437);
    expect(dist).toBeGreaterThan(3900);
    expect(dist).toBeLessThan(4000);
  });

  it("handles antipodal points (~20015 km)", () => {
    const dist = haversine(0, 0, 0, 180);
    expect(dist).toBeGreaterThan(20000);
    expect(dist).toBeLessThan(20030);
  });

  it("handles negative coordinates", () => {
    // Sydney → Buenos Aires
    const dist = haversine(-33.8688, 151.2093, -34.6037, -58.3816);
    expect(dist).toBeGreaterThan(11700);
    expect(dist).toBeLessThan(12000);
  });
});
