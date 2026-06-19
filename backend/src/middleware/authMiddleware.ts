/**
 * authMiddleware.ts
 * Extracts and verifies the Bearer JWT from Authorization header.
 * Sets req.user on success. Returns 401 on failure.
 * Use optionalAuth for routes where auth is optional (e.g. guest gameplay).
 */

import { Request, Response, NextFunction } from "express";
import { verifyToken, AuthTokenPayload } from "../services/authService";

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return null;
}

/** Require a valid JWT. Returns 401 if missing or invalid. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Optionally parse JWT if present, but do not block the request. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // ignore invalid tokens for optional auth
    }
  }
  next();
}
