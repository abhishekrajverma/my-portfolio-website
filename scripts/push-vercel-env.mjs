import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const envContent = readFileSync(".env.local", "utf8");
const vars = {};

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const separator = trimmed.indexOf("=");
  if (separator === -1) continue;

  const key = trimmed.slice(0, separator).trim();
  const value = trimmed.slice(separator + 1).trim();
  if (key) vars[key] = value;
}

const keys = Object.keys(vars).filter(
  (key) => vars[key] && !key.startsWith("UPSTASH_") && !key.startsWith("KV_")
);

for (const key of keys) {
  const value = vars[key];
  console.log(`Adding ${key} to production...`);

  try {
    execSync(`npx vercel env rm ${key} production --yes`, {
      stdio: "ignore",
    });
  } catch {
    // Variable may not exist yet.
  }

  execSync(`npx vercel env add ${key} production`, {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
  });
}

console.log("\nProduction environment variables updated.");
console.log("Redeploy on Vercel for changes to take effect.");
