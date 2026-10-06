import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/telegram/test")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleTelegramConnectionTest } = await import("@/lib/notify/telegram-test.server");
        return handleTelegramConnectionTest(request);
      },
    },
  },
});
