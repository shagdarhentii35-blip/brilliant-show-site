import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TELEGRAM_ENV_KEYS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "TELEGRAM_WEBHOOK_SECRET",
  "TELEGRAM_TEST_KEY",
] as const;

let loadedFromFile = false;

function setIfMissing(key: string, value: unknown) {
  if (typeof value !== "string" || value.length === 0) return;
  if (process.env[key]) return;
  process.env[key] = value;
}

function parseDotEnv(text: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

function loadTelegramVarsFromDotEnvFile() {
  if (loadedFromFile) return;
  loadedFromFile = true;
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    const parsed = parseDotEnv(text);
    for (const key of TELEGRAM_ENV_KEYS) {
      setIfMissing(key, parsed[key]);
    }
  } catch {
    // Production runtimes have no local .env; platform env/bindings still apply.
  }
}

/** Copy Cloudflare/Nitro fetch bindings onto process.env (values never logged). */
export function applyServerEnvBindings(env: unknown) {
  if (!env || typeof env !== "object") return;
  const record = env as Record<string, unknown>;
  for (const key of TELEGRAM_ENV_KEYS) {
    setIfMissing(key, record[key]);
  }
}

/** Load gitignored root .env TELEGRAM_* keys into process.env for server-only code. */
export function ensureTelegramProcessEnv() {
  for (const key of TELEGRAM_ENV_KEYS) {
    if (process.env[key]) continue;
    loadTelegramVarsFromDotEnvFile();
    break;
  }
}
