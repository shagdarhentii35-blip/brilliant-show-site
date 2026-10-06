/** Shared Promotions username rule. Must match typical DIAMOND username characters. */
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export function isValidPromotionUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username.trim());
}
