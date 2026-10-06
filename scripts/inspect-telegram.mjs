function sanitize(value) {
  return String(value).replace(/bot\d+:[A-Za-z0-9_-]+/gi, "bot[redacted]");
}

function collectChats(value, found) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectChats(item, found);
    return;
  }
  if (value.chat && typeof value.chat.id === "number") {
    found.set(value.chat.id, {
      id: value.chat.id,
      type: value.chat.type ?? null,
      title: value.chat.title ?? null,
    });
  }
  for (const nested of Object.values(value)) collectChats(nested, found);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.log(JSON.stringify({ error: "TELEGRAM_BOT_TOKEN is not set" }));
  process.exit(1);
}

const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
const meJson = await meRes.json();
const [webhookRes, updatesRes] = await Promise.all([
  fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`),
  fetch(
    `https://api.telegram.org/bot${token}/getUpdates?offset=-100&limit=100&allowed_updates=${encodeURIComponent(
      JSON.stringify(["message", "edited_message", "my_chat_member", "chat_member", "chat_join_request"]),
    )}`,
  ),
]);
const webhookJson = await webhookRes.json();
const updatesJson = await updatesRes.json();

if (!updatesJson.ok) {
  console.log(
    JSON.stringify({
      error: sanitize(updatesJson.description ?? `getUpdates HTTP ${updatesRes.status}`),
      webhookActive: Boolean(webhookJson.result?.url),
    }),
  );
  process.exit(1);
}

const found = new Map();
collectChats(updatesJson.result, found);
const chats = [...found.values()];
const promotionMatch =
  chats.find((chat) => String(chat.title ?? "").toLowerCase() === "promotion") ??
  chats.find((chat) => String(chat.title ?? "").toLowerCase().includes("promotion")) ??
  null;

const updates = Array.isArray(updatesJson.result) ? updatesJson.result : [];
console.log(
  JSON.stringify({
    botUsername: meJson.ok ? meJson.result.username : null,
    botCanJoinGroups: meJson.ok ? meJson.result.can_join_groups : null,
    botCanReadAllGroupMessages: meJson.ok ? meJson.result.can_read_all_group_messages : null,
    meError: meJson.ok ? null : sanitize(meJson.description ?? "getMe failed"),
    webhookActive: Boolean(webhookJson.result?.url),
    updateCount: updates.length,
    updateKinds: updates.map((update) => Object.keys(update).filter((key) => key !== "update_id")),
    chats,
    promotionMatch,
    configuredChatId: process.env.TELEGRAM_CHAT_ID || null,
  }),
);
