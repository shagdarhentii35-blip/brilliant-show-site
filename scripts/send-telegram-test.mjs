function sanitize(value) {
  return String(value).replace(/bot\d+:[A-Za-z0-9_-]+/gi, "bot[redacted]");
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) {
  console.log(JSON.stringify({ ok: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" }));
  process.exit(1);
}

const text = "✅ DIAMOND Promotion Bot connected successfully.";
const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, text }),
});
const json = await response.json().catch(() => null);

if (!json?.ok) {
  console.log(
    JSON.stringify({
      ok: false,
      chatId,
      error: sanitize(json?.description ?? `sendMessage HTTP ${response.status}`),
    }),
  );
  process.exit(1);
}

console.log(
  JSON.stringify({
    ok: true,
    chatId,
    chatTitle: json.result?.chat?.title ?? null,
    messageId: json.result?.message_id ?? null,
  }),
);
