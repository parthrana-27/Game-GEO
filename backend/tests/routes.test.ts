/**
 * routes.test.ts
 * Basic integration-style tests for key API endpoints.
 * Uses supertest against the Express app directly (no real DB).
 * Mocks Prisma to isolate route + controller logic.
 */

import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

// Mock Prisma before importing the app
vi.mock("@prisma/client", () => {
  const mockPrismaClient = vi.fn(() => ({
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: "user1",
        email: "test@example.com",
        createdAt: new Date(),
      }),
    },
    game: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), findMany: vi.fn() },
    round: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    location: { count: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() },
    $disconnect: vi.fn(),
  }));

  return { PrismaClient: mockPrismaClient };
});

// Mock ioredis
vi.mock("ioredis", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue("OK"),
      del: vi.fn().mockResolvedValue(1),
      on: vi.fn(),
    })),
  };
});

// Set required env vars
process.env.JWT_SECRET = "test-secret-for-vitest";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.REDIS_URL = "redis://localhost:6379";

let app: any;

beforeAll(async () => {
  const serverModule = await import("../src/server");
  app = serverModule.default;
});

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/auth/signup", () => {
  it("validates email format", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "not-an-email", password: "password123" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("email");
  });

  it("validates password length", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "abc" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/leaderboard", () => {
  it("rejects unknown region param", async () => {
    const res = await request(app).get("/api/leaderboard?region=UNKNOWN_REGION");
    expect(res.status).toBe(400);
  });
});

describe("404 handler", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });
});
