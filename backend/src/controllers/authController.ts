/**
 * authController.ts
 * Handles signup and signin HTTP requests.
 */

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { registerUser, loginUser } from "../services/authService";

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = credentialsSchema.parse(req.body);
    const user = await registerUser(email, password);
    res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = credentialsSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
}
