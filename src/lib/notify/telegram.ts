import type { PromotionClaim } from "@/lib/claims/types";

/**
 * Client-safe stub. Real Telegram delivery lives in telegram.server.ts
 * and is only imported from server modules.
 */
export async function notifyClaim(_claim: PromotionClaim): Promise<void> {}
