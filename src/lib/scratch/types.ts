export interface ScratchRewardView {
  amountMnt: number;
  kind?: "cash" | "jackpot";
}

export interface ScratchStatus {
  authenticated: boolean;
  canScratch: boolean;
  canClaim: boolean;
  lastScratchAt: string | null;
  nextScratchAt: string | null;
  remainingMs: number;
  lastReward: ScratchRewardView | null;
  claimStatus: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | null;
}

export type ScratchCompleteResult =
  | { ok: true; status: ScratchStatus; reward: ScratchRewardView }
  | { ok: false; error: string; code: "unauthorized" | "cooldown"; status: ScratchStatus };

export type ScratchClaimResult =
  | { ok: true; status: ScratchStatus; claimId: string }
  | {
      ok: false;
      error: string;
      code: "unauthorized" | "duplicate" | "nothing_to_claim";
      status: ScratchStatus;
    };
