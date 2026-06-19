/**
 * authService.ts
 * Handles user registration, login, and JWT operations.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env variable is not set");
  return secret;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

/** Register a new user. Throws if email already taken. */
export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
  return user;
}

/** Validate credentials and return a signed JWT. Throws on invalid. */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  const payload: AuthTokenPayload = { userId: user.id, email: user.email };
  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });

  return { token, user: { id: user.id, email: user.email } };
}

/** Verify a JWT and return its payload. Throws if invalid/expired. */
export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}
