import { Redis } from "@upstash/redis";
import { isRedisConfigured } from "@/lib/newsletter/config";

const LAST_NOTIFIED_KEY = "newsletter:last_notified_slug";

function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  return Redis.fromEnv();
}

export async function getLastNotifiedSlug(): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  return redis.get<string>(LAST_NOTIFIED_KEY);
}

export async function setLastNotifiedSlug(slug: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(LAST_NOTIFIED_KEY, slug);
}
