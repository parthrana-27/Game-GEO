import { Router } from "express";
import { leaderboard } from "../controllers/leaderboardController";

const router = Router();

/**
 * GET /api/leaderboard?region=GLOBAL|WORLD|INDIA|CITY_SURAT
 */
router.get("/", leaderboard);

export default router;
