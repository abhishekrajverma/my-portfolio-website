import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { isRedisConfigured } from "@/lib/newsletter/config";

const SUBSCRIBERS_KEY = "newsletter:subscribers";
const FILE_PATH = path.join(process.cwd(), "data", "subscribers.json");

function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  return Redis.fromEnv();
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

export async function getSubscribers(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    const members = await redis.smembers(SUBSCRIBERS_KEY);
    return Array.isArray(members)
      ? members.filter((item): item is string => typeof item === "string")
      : [];
  }
  return readFromFile();
}

export async function addSubscriber(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const redis = getRedis();

  if (redis) {
    const added = await redis.sadd(SUBSCRIBERS_KEY, normalized);
    return added === 1;
  }

  const emails = await readFromFile();
  if (emails.includes(normalized)) {
    return false;
  }

  emails.push(normalized);
  await writeToFile(emails);
  return true;
}

export async function removeSubscriber(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const redis = getRedis();

  if (redis) {
    await redis.srem(SUBSCRIBERS_KEY, normalized);
    return;
  }

  const emails = await readFromFile();
  await writeToFile(emails.filter((item) => item !== normalized));
}

export async function ensureSubscriberStore(): Promise<void> {
  const redis = getRedis();
  if (redis) return;

  try {
    await fs.access(FILE_PATH);
  } catch {
    await writeToFile([]);
  }
}
