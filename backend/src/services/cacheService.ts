/**
 * cacheService.ts
 * Thin wrapper around ioredis.
 * All Redis interactions in the app go through this module so we have
 * one place to swap Redis for another store (Memcached, Valkey, etc.)
 * or mock in tests.
 */

import Redis from "ioredis";

let client: Redis | null = null;

/** Lazily create and reuse the Redis client. */
function getClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL ?? "redis://localhost:6379";
    client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    client.on("error", (err) => {
      // Log but don't crash — the app works without Redis
      console.warn("[Redis] Connection error:", err.message);
    });
  }
  return client;
}

/**
 * Get a cached value.
 * Returns null on miss or if Redis is unavailable.
 */
export async function cacheGet(key: string): Promise<string | null> {
  try {
    return await getClient().get(key);
  } catch {
    return null;
  }
}

/**
 * Set a cached value with an optional TTL (seconds).
 * Silently no-ops if Redis is unavailable.
 */
export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds = 60
): Promise<void> {
  try {
    await getClient().set(key, value, "EX", ttlSeconds);
  } catch {
    // non-fatal
  }
}

/**
 * Invalidate a cached key.
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    await getClient().del(key);
  } catch {
    // non-fatal
  }
}
