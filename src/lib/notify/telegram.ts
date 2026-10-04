import type { PromotionClaim } from "@/lib/claims/types";

/**
 * Telegram delivery is not implemented.
 * Call this after a PENDING claim is saved; leave the body empty until a bot is configured.
 * Do not put bot tokens in the frontend.
 */
export async function notifyClaim(_claim: PromotionClaim): Promise<void> {
  // TODO: send claim to Telegram bot
}
