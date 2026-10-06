import { drainTelegramCallbackQueries } from "@/lib/notify/telegram.server";
import { reviewScratchClaim } from "@/lib/persist/store.server";

const pollerKey = "__diamondTelegramCallbackPoller";

function canPollTelegramCallbacks() {
  if (process.env.TELEGRAM_DISABLE_POLLING === "1") return false;
  if (process.env.NETLIFY || process.env.NETLIFY_DEV || process.env.NETLIFY_BLOBS_CONTEXT) return false;
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  if (process.env.CF_PAGES) return false;
  return Boolean(process.versions?.node);
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => resolve(), ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

/** Local Vite/Node only. Production should use /api/telegram/webhook instead of getUpdates. */
export function startTelegramCallbackPoller() {
  if (!canPollTelegramCallbacks()) return;

  const globalState = globalThis as typeof globalThis & { [pollerKey]?: AbortController };
  globalState[pollerKey]?.abort();
  const controller = new AbortController();
  globalState[pollerKey] = controller;
  const { signal } = controller;

  void (async () => {
    while (!signal.aborted) {
      try {
        const mode = await drainTelegramCallbackQueries(reviewScratchClaim, signal);
        if (signal.aborted) return;
        if (mode === "webhook") await sleep(30_000, signal);
        else if (mode === "unconfigured" || mode === "error") await sleep(5_000, signal);
      } catch {
        if (!signal.aborted) await sleep(3_000, signal);
      }
    }
  })();
}
