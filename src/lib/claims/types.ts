import type { BonusId } from "@/lib/bonus/types";

export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface PromotionClaim {
  id: string;
  userId: string;
  username: string;
  bonusId: BonusId;
  promotionTitle: string;
  amountMnt: number;
  status: ClaimStatus;
  createdAt: string;
  sourceScratchAt?: string;
  reviewedAt?: string;
}
