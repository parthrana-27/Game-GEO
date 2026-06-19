/**
 * errorHandler.ts
 * Global Express error handling middleware.
 * Catches any thrown errors and returns a consistent JSON error response.
 */

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof Error) {
    console.error("[ErrorHandler]", err.message);
    // Map known error messages to HTTP status codes
    const msg = err.message.toLowerCase();
    if (msg.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (
      msg.includes("already registered") ||
      msg.includes("invalid email") ||
      msg.includes("invalid or expired") ||
      msg.includes("no locations") ||
      msg.includes("completed")
    ) {
      res.status(400).json({ error: err.message });
      return;
    }
  }
  res.status(500).json({ error: "Internal server error" });
}
