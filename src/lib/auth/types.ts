export interface PublicUser {
  id: string;
  username: string;
  createdAt: string;
}

export interface StoredUser extends PublicUser {
  passwordHash: string;
  lastScratchAt?: string;
  lastScratchAmountMnt?: number;
  lastScratchKind?: "jackpot";
  lastScratchClaimId?: string;
}

export interface StoredSession {
  id: string;
  userId: string;
  expiresAt: string;
}
