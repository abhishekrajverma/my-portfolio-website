import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import {
  isBlobStorageConfigured,
  readSubscribersFromBlob,
  writeSubscribersToBlob,
} from "@/lib/newsletter/blob-store";
import {
  getSubscriberStorageError,
  isRedisConfigured,
  isSubscriberStorageConfigured,
} from "@/lib/newsletter/config";
import {
  addSubscriberToSupabase,
  getSubscribersFromSupabase,
  removeSubscriberFromSupabase,
} from "@/lib/newsletter/supabase-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const SUBSCRIBERS_KEY = "newsletter:subscribers";
const FILE_PATH = path.join(process.cwd(), "data", "subscribers.json");

function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) {
    return new Redis({ url: upstashUrl, token: upstashToken });
  }

  const kvUrl = process.env.KV_REST_API_URL?.trim();
  const kvToken = process.env.KV_REST_API_TOKEN?.trim();
  if (kvUrl && kvToken) {
    return new Redis({ url: kvUrl, token: kvToken });
  }

  return null;
}

function assertSubscriberStorage(): void {
  if (!isSubscriberStorageConfigured()) {
    throw new Error(getSubscriberStorageError());
  }
}

async function readFromFile(): Promise<string[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function writeToFile(emails: string[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(emails, null, 2));
}

async function readSubscribers(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    return getSubscribersFromSupabase();
  }

  const redis = getRedis();
  if (redis) {
    const members = await redis.smembers(SUBSCRIBERS_KEY);
    return Array.isArray(members)
      ? members.filter((item): item is string => typeof item === "string")
      : [];
  }

  if (isBlobStorageConfigured()) {
    return readSubscribersFromBlob();
  }

  return readFromFile();
}

async function writeSubscribers(emails: string[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(SUBSCRIBERS_KEY);
    for (const subscriber of emails) {
      await redis.sadd(SUBSCRIBERS_KEY, subscriber);
    }
    return;
  }

  if (isBlobStorageConfigured()) {
    await writeSubscribersToBlob(emails);
    return;
  }

  await writeToFile(emails);
}

export async function getSubscribers(): Promise<string[]> {
  return readSubscribers();
}

export async function addSubscriber(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    return addSubscriberToSupabase(normalized);
  }

  const redis = getRedis();

  if (redis) {
    const added = await redis.sadd(SUBSCRIBERS_KEY, normalized);
    return added === 1;
  }

  assertSubscriberStorage();

  const emails = await readSubscribers();
  if (emails.includes(normalized)) {
    return false;
  }

  emails.push(normalized);
  await writeSubscribers(emails);
  return true;
}

export async function removeSubscriber(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    await removeSubscriberFromSupabase(normalized);
    return;
  }

  const redis = getRedis();

  if (redis) {
    await redis.srem(SUBSCRIBERS_KEY, normalized);
    return;
  }

  assertSubscriberStorage();

  const emails = await readSubscribers();
  await writeSubscribers(emails.filter((item) => item !== normalized));
}

export async function ensureSubscriberStore(): Promise<void> {
  if (isSupabaseConfigured()) return;

  const redis = getRedis();
  if (redis || isBlobStorageConfigured()) return;

  assertSubscriberStorage();

  try {
    await fs.access(FILE_PATH);
  } catch {
    await writeToFile([]);
  }
}
