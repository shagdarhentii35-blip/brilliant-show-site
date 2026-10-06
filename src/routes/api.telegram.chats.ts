import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/telegram/chats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleTelegramChatInspect } = await import("@/lib/notify/telegram-test.server");
        return handleTelegramChatInspect(request);
      },
    },
  },
});
