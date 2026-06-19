/**
 * leaderboardController.ts
 * Handles leaderboard HTTP requests.
 */

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getTopScores } from "../services/leaderboardService";

const regionSchema = z.enum(["WORLD", "INDIA", "CITY_SURAT", "GLOBAL"]).optional();

/** GET /api/leaderboard?region=WORLD */
export async function leaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const region = regionSchema.parse(req.query.region);
    const entries = await getTopScores(region);
    res.json({ entries });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid region parameter" });
      return;
    }
    next(err);
  }
}
