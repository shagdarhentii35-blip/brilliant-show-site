import type { PromotionClaim } from "@/lib/claims/types";
import { formatMnt } from "@/lib/bonus/format";
import { ensureTelegramProcessEnv } from "@/lib/env/load-telegram-env.server";

function sanitizeTelegramText(value: string): string {
  return value.replaceAll(/bot\d+:[A-Za-z0-9_-]+/gi, "bot[redacted]");
}

function env(name: string): string | undefined {
  ensureTelegramProcessEnv();
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function telegramConfig() {
  const token = env("TELEGRAM_BOT_TOKEN");
  const chatId = env("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return null;
  return { token, chatId, secret: env("TELEGRAM_WEBHOOK_SECRET") };
}

export async function sendTelegramText(text: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = telegramConfig();
  if (!config) {
    return {
      ok: false,
      error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID on the server.",
    };
  }
  const sent = await telegramCall(config.token, "sendMessage", {
    chat_id: config.chatId,
    text,
  });
  if (!sent) return { ok: false, error: "Telegram sendMessage failed. Check bot token, chat ID, and that the bot is in the group." };
  return { ok: true };
}

export async function sendTelegramConnectionTest(): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendTelegramText("✅ DIAMOND Promotion Bot connected successfully.");
}

async function telegramApi(
  token: string,
  method: string,
  body: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const json = (await response.json().catch(() => null)) as
      | { ok?: boolean; result?: unknown; description?: string }
      | null;
    const description = typeof json?.description === "string" ? json.description : undefined;
    if (description?.toLowerCase().includes("message is not modified")) {
      return { ok: true, result: json?.result };
    }
    if (response.status === 409) {
      return { ok: false, description: "conflict" };
    }
    if (!json?.ok) {
      console.error(`Telegram ${method} failed: ${response.status}`);
      return { ok: false, description };
    }
    return { ok: true, result: json.result };
  } catch (error) {
    if (signal?.aborted) return { ok: false, description: "aborted" };
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`Telegram ${method} error:`, sanitizeTelegramText(message));
    return { ok: false };
  }
}

async function telegramCall(token: string, method: string, body: Record<string, unknown>): Promise<boolean> {
  const result = await telegramApi(token, method, body);
  return result.ok;
}

function withTelegramGetUpdatesLock<T>(fn: () => Promise<T>): Promise<T> {
  const globalState = globalThis as typeof globalThis & { __diamondTelegramGetUpdates?: Promise<unknown> };
  const previous = globalState.__diamondTelegramGetUpdates ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(fn);
  globalState.__diamondTelegramGetUpdates = next;
  return next;
}

function claimClock(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function statusLine(status: PromotionClaim["status"]): string {
  if (status === "APPROVED") return "Status: ✅ APPROVED";
  if (status === "REJECTED") return "Status: ❌ REJECTED";
  return "Status: 🟡 PENDING";
}

export function formatScratchClaimMessage(claim: PromotionClaim): string {
  return [
    "🎫 SCRATCH CARD CLAIM",
    "",
    `👤 User: ${claim.username}`,
    `💰 Reward: ${formatMnt(claim.amountMnt)}`,
    `🆔 Claim ID: ${claim.id}`,
    `⏰ Time: ${claimClock(claim.createdAt)}`,
    "",
    statusLine(claim.status),
  ].join("\n");
}

export async function notifyScratchClaim(claim: PromotionClaim): Promise<void> {
  const config = telegramConfig();
  if (!config) {
    console.warn("Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on the server.");
    return;
  }

  const pending = claim.status === "PENDING";
  const body: Record<string, unknown> = {
    chat_id: config.chatId,
    text: formatScratchClaimMessage(claim),
  };
  if (pending) {
    const approveData = `approve:${claim.id}`;
    const rejectData = `reject:${claim.id}`;
    console.info("[telegram-claim] notify", {
      persistedClaimId: claim.id,
      approveCallbackData: approveData,
      rejectCallbackData: rejectData,
    });
    body.reply_markup = {
      inline_keyboard: [
        [
          { text: "✅ APPROVE", callback_data: approveData },
          { text: "❌ REJECT", callback_data: rejectData },
        ],
      ],
    };
  }
  await telegramCall(config.token, "sendMessage", body);
}

/** Other promotions: notify without payout and without inline actions. */
export async function notifyClaim(claim: PromotionClaim): Promise<void> {
  if (claim.bonusId === "scratch") {
    await notifyScratchClaim(claim);
    return;
  }
  const config = telegramConfig();
  if (!config) return;
  await telegramCall(config.token, "sendMessage", {
    chat_id: config.chatId,
    text: [
      `🎫 ${claim.promotionTitle} CLAIM`,
      "",
      `👤 User: ${claim.username}`,
      `💰 Amount: ${formatMnt(claim.amountMnt)}`,
      `🆔 Claim ID: ${claim.id}`,
      `⏰ Time: ${claimClock(claim.createdAt)}`,
      "",
      statusLine(claim.status),
    ].join("\n"),
  });
}

export function verifyTelegramWebhookSecret(request: Request): boolean {
  const config = telegramConfig();
  if (!config) return false;
  if (!config.secret) return true;
  return request.headers.get("x-telegram-bot-api-secret-token") === config.secret;
}

export function isTelegramConfigured(): boolean {
  return telegramConfig() !== null;
}

type TelegramChat = { id: number; type?: string; title?: string; username?: string };

function collectChats(value: unknown, found: Map<number, TelegramChat>) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectChats(item, found);
    return;
  }
  const record = value as Record<string, unknown>;
  const chat = record.chat;
  if (chat && typeof chat === "object") {
    const entry = chat as TelegramChat;
    if (typeof entry.id === "number") {
      found.set(entry.id, {
        id: entry.id,
        type: typeof entry.type === "string" ? entry.type : undefined,
        title: typeof entry.title === "string" ? entry.title : undefined,
        username: typeof entry.username === "string" ? entry.username : undefined,
      });
    }
  }
  for (const nested of Object.values(record)) collectChats(nested, found);
}

export async function inspectTelegramUpdates(): Promise<{
  hasToken: boolean;
  configuredChatId: string | null;
  webhookActive: boolean;
  chats: TelegramChat[];
  promotionMatch: TelegramChat | null;
  configuredMatchesPromotion: boolean | null;
  error?: string;
}> {
  const token = env("TELEGRAM_BOT_TOKEN");
  const configuredChatId = env("TELEGRAM_CHAT_ID") ?? null;
  if (!token) {
    return {
      hasToken: false,
      configuredChatId,
      webhookActive: false,
      chats: [],
      promotionMatch: null,
      configuredMatchesPromotion: null,
      error: "TELEGRAM_BOT_TOKEN is not set on the server.",
    };
  }

  const [webhookRes, updatesRes] = await Promise.all([
    fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`),
    fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=100`),
  ]);
  const webhookJson = (await webhookRes.json()) as { ok?: boolean; result?: { url?: string }; description?: string };
  const updatesJson = (await updatesRes.json()) as { ok?: boolean; result?: unknown; description?: string };

  if (!updatesRes.ok || updatesJson.ok === false) {
    return {
      hasToken: true,
      configuredChatId,
      webhookActive: Boolean(webhookJson.result?.url),
      chats: [],
      promotionMatch: null,
      configuredMatchesPromotion: null,
      error: sanitizeTelegramText(updatesJson.description ?? `getUpdates HTTP ${updatesRes.status}`),
    };
  }

  const found = new Map<number, TelegramChat>();
  collectChats(updatesJson.result, found);
  const chats = [...found.values()];
  const promotionMatch =
    chats.find((chat) => (chat.title ?? "").toLowerCase() === "promotion") ??
    chats.find((chat) => (chat.title ?? "").toLowerCase().includes("promotion")) ??
    null;

  return {
    hasToken: true,
    configuredChatId,
    webhookActive: Boolean(webhookJson.result?.url),
    chats,
    promotionMatch,
    configuredMatchesPromotion: promotionMatch ? configuredChatId === String(promotionMatch.id) : null,
  };
}

type TelegramUpdate = {
  update_id?: number;
  callback_query?: {
    id: string;
    data?: string;
    message?: {
      message_id: number;
      chat: { id: number };
      text?: string;
    };
  };
};

type ClaimDecision = "APPROVED" | "REJECTED";

export async function handleTelegramUpdate(
  update: TelegramUpdate,
  applyDecision: (
    claimId: string,
    decision: ClaimDecision,
  ) => Promise<{ claim: PromotionClaim; applied: boolean } | null>,
): Promise<void> {
  const config = telegramConfig();
  const query = update.callback_query;
  if (!config || !query) return;

  const data = query.data ?? "";
  const approve = data.startsWith("approve:");
  const reject = data.startsWith("reject:");
  if (!approve && !reject) {
    await telegramCall(config.token, "answerCallbackQuery", {
      callback_query_id: query.id,
      text: "Unknown action",
    });
    return;
  }

  if (query.message && String(query.message.chat.id) !== String(config.chatId)) {
    await telegramCall(config.token, "answerCallbackQuery", {
      callback_query_id: query.id,
      text: "This bot only accepts actions in the configured group.",
    });
    return;
  }

  const claimId = data.slice(approve ? "approve:".length : "reject:".length).trim();
  const decision: ClaimDecision = approve ? "APPROVED" : "REJECTED";
  console.info("[telegram-claim] callback", {
    action: approve ? "approve" : "reject",
    callbackClaimId: claimId,
  });
  const result = await applyDecision(claimId, decision);

  let callbackText = "Claim not found";
  if (result?.applied) callbackText = decision === "APPROVED" ? "Claim APPROVED" : "Claim REJECTED";
  else if (result) callbackText = `Already ${result.claim.status}`;

  await telegramCall(config.token, "answerCallbackQuery", {
    callback_query_id: query.id,
    text: callbackText,
  });

  const claim = result?.claim;
  if (claim && query.message) {
    await telegramCall(config.token, "editMessageText", {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      text: formatScratchClaimMessage(claim),
      reply_markup: { inline_keyboard: [] },
    });
  }
}

let telegramUpdateOffset = 0;

export async function drainTelegramCallbackQueries(
  applyDecision: (
    claimId: string,
    decision: ClaimDecision,
  ) => Promise<{ claim: PromotionClaim; applied: boolean } | null>,
  signal?: AbortSignal,
): Promise<"polled" | "webhook" | "unconfigured" | "error"> {
  const config = telegramConfig();
  if (!config) return "unconfigured";

  const webhook = await telegramApi(config.token, "getWebhookInfo", {}, signal);
  const webhookUrl =
    webhook.result && typeof webhook.result === "object"
      ? String((webhook.result as { url?: string }).url ?? "")
      : "";
  if (webhookUrl) return "webhook";

  const updates = await withTelegramGetUpdatesLock(() =>
    telegramApi(
      config.token,
      "getUpdates",
      {
        ...(telegramUpdateOffset ? { offset: telegramUpdateOffset } : {}),
        timeout: 25,
        allowed_updates: ["callback_query"],
      },
      signal,
    ),
  );
  if (!updates.ok || !Array.isArray(updates.result)) return "error";

  for (const item of updates.result) {
    if (!item || typeof item !== "object") continue;
    const update = item as TelegramUpdate;
    if (typeof update.update_id === "number") telegramUpdateOffset = update.update_id + 1;
    await handleTelegramUpdate(update, applyDecision);
  }
  return "polled";
}
