import { ensureTelegramProcessEnv } from "@/lib/env/load-telegram-env.server";
import { inspectTelegramUpdates, isTelegramConfigured, sendTelegramConnectionTest } from "@/lib/notify/telegram.server";

function env(name: string): string | undefined {
  ensureTelegramProcessEnv();
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function allowTelegramTest(request: Request): boolean {
  const required = env("TELEGRAM_TEST_KEY");
  if (required) {
    const url = new URL(request.url);
    const provided = url.searchParams.get("key") ?? request.headers.get("x-telegram-test-key");
    return provided === required;
  }
  return process.env.NODE_ENV !== "production";
}

export async function handleTelegramChatInspect(request: Request): Promise<Response> {
  if (!allowTelegramTest(request)) {
    return Response.json(
      { ok: false, error: "Set TELEGRAM_TEST_KEY and pass it as ?key= to inspect chats in production." },
      { status: 403 },
    );
  }
  const result = await inspectTelegramUpdates();
  return Response.json(result, { status: result.error ? 500 : 200 });
}

export async function handleTelegramConnectionTest(request: Request): Promise<Response> {
  if (!allowTelegramTest(request)) {
    return Response.json(
      { ok: false, error: "Set TELEGRAM_TEST_KEY and pass it as ?key= to run this test in production." },
      { status: 403 },
    );
  }

  const result = await sendTelegramConnectionTest();
  return Response.json(
    {
      ok: result.ok,
      configured: isTelegramConfigured(),
      hasToken: Boolean(env("TELEGRAM_BOT_TOKEN")),
      hasChatId: Boolean(env("TELEGRAM_CHAT_ID")),
      ...(result.ok ? {} : { error: result.error }),
    },
    { status: result.ok ? 200 : 500 },
  );
}
