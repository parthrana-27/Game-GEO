/**
 * gameController.ts
 * HTTP layer for game operations.
 */

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  startGame,
  getCurrentRoundLocation,
  processGuess,
  nextRound,
  getGameSummary,
} from "../services/gameService";

const regionSchema = z.enum(["WORLD", "INDIA", "CITY_SURAT"]).default("WORLD");

const startSchema = z.object({
  region: regionSchema,
});

const guessSchema = z.object({
  gameId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const nextSchema = z.object({
  gameId: z.string().min(1),
});

/** POST /api/game/start */
export async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const { region } = startSchema.parse(req.body);
    const result = await startGame(region, req.user?.userId);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
}

/** GET /api/game/round?gameId=xxx */
export async function getRound(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = z.string().min(1).parse(req.query.gameId);
    const result = await getCurrentRoundLocation(gameId);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "gameId is required" });
      return;
    }
    next(err);
  }
}

/** POST /api/game/guess */
export async function guess(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, lat, lng } = guessSchema.parse(req.body);
    const result = await processGuess(gameId, lat, lng);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
}

/** POST /api/game/next */
export async function next(req: Request, res: Response, next_: NextFunction) {
  try {
    const { gameId } = nextSchema.parse(req.body);
    const result = await nextRound(gameId);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next_(err);
  }
}

/** GET /api/game/summary?gameId=xxx */
export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = z.string().min(1).parse(req.query.gameId);
    const result = await getGameSummary(gameId);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "gameId is required" });
      return;
    }
    next(err);
  }
}
