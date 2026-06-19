import { Router } from "express";
import { signup, signin } from "../controllers/authController";

const router = Router();

/**
 * POST /api/auth/signup
 * Body: { email, password }
 */
router.post("/signup", signup);

/**
 * POST /api/auth/signin
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post("/signin", signin);

export default router;
