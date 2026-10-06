import { handleTelegramUpdate, verifyTelegramWebhookSecret, isTelegramConfigured } from "@/lib/notify/telegram.server";
import { reviewScratchClaim } from "@/lib/persist/store.server";

export async function handleTelegramWebhook(request: Request): Promise<Response> {
  if (!isTelegramConfigured()) {
    return new Response("telegram not configured", { status: 503 });
  }
  if (!verifyTelegramWebhookSecret(request)) {
    return new Response("unauthorized", { status: 401 });
  }

  let update: unknown;
  try {
    update = await request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  await handleTelegramUpdate(update as Parameters<typeof handleTelegramUpdate>[0], reviewScratchClaim);
  return new Response("ok");
}
