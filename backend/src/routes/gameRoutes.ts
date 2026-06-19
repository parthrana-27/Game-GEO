import { Router } from "express";
import { start, getRound, guess, next, summary } from "../controllers/gameController";
import { optionalAuth } from "../middleware/authMiddleware";

const router = Router();

// All game routes support optional auth (guest play allowed)
router.use(optionalAuth);

/**
 * POST /api/game/start
 * Body: { region?: "WORLD" | "INDIA" | "CITY_SURAT" }
 */
router.post("/start", start);

/**
 * GET /api/game/round?gameId=xxx
 * Returns the Street View coords for the current round.
 */
router.get("/round", getRound);

/**
 * POST /api/game/guess
 * Body: { gameId, lat, lng }
 */
router.post("/guess", guess);

/**
 * POST /api/game/next
 * Body: { gameId }
 */
router.post("/next", next);

/**
 * GET /api/game/summary?gameId=xxx
 */
router.get("/summary", summary);

export default router;
