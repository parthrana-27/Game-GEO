/**
 * cacheService.ts
 * Thin wrapper around ioredis.
 * All Redis interactions in the app go through this module so we have
 * one place to swap Redis for another store (Memcached, Valkey, etc.)
 * or mock in tests.
 */

import Redis from "ioredis";

let client: Redis | null = null;
let isRedisDisabled = false;

/** Lazily create and reuse the Redis client. */
function getClient(): Redis | null {
  if (isRedisDisabled) return null;
  if (!client) {
    const url = process.env.REDIS_URL;
    if (!url) {
      console.log("[Redis] No REDIS_URL provided. Redis caching is disabled.");
      isRedisDisabled = true;
      return null;
    }
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
    });

    client.on("error", (err) => {
      console.warn("[Redis] Connection error:", err.message);
      // Disable Redis client on failure to prevent repeated timeout delays in serverless
      isRedisDisabled = true;
      client = null;
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
    const redis = getClient();
    if (!redis) return null;
    return await redis.get(key);
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
    const redis = getClient();
    if (!redis) return;
    await redis.set(key, value, "EX", ttlSeconds);
  } catch {
    // non-fatal
  }
}

/**
 * Invalidate a cached key.
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    const redis = getClient();
    if (!redis) return;
    await redis.del(key);
  } catch {
    // non-fatal
  }
}
