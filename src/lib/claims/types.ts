import type { BonusId } from "@/lib/bonus/types";

export type ClaimStatus = "PENDING" | "COMPLETED";

export interface PromotionClaim {
  id: string;
  userId: string;
  username: string;
  bonusId: BonusId;
  promotionTitle: string;
  amountMnt: number;
  status: ClaimStatus;
  createdAt: string;
}
