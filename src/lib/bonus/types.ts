export type BonusId =
  | "welcome"
  | "daily"
  | "mission"
  | "scratch"
  | "mystery"
  | "race"
  | "weekend";

export type PromoBadge = "pink" | "blue" | "green" | "purple" | "gold";

export type ClaimAvailability =
  | "available"
  | "claimed"
  | "expired"
  | "not_eligible"
  | "locked"
  | "active"
  | "ended";

export interface User {
  id: string;
  displayName: string;
  isNewRegistrant: boolean;
  registeredAt: string;
}

export interface BonusReward {
  amountMnt: number;
  label: string;
  kind?: "cash" | "jackpot";
}

export interface Bonus {
  id: BonusId;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  action: string;
  badge: PromoBadge;
  imageKey: BonusId;
  placement: "featured" | "more";
}

export interface BonusClaim {
  id: string;
  userId: string;
  bonusId: BonusId;
  status: ClaimAvailability;
  claimedAt?: string;
  reward?: BonusReward;
  sourceId?: string;
}

export interface WelcomeBonus {
  catalog: Bonus;
  status: Extract<ClaimAvailability, "available" | "claimed" | "expired" | "not_eligible">;
  rules: {
    newRegisteredUsersOnly: boolean;
    registrationBonusMnt: number;
    firstDepositPercent: number;
    minDepositMnt: number;
    maxBonusMnt: number;
    wageringMultiplier: number;
    claimPeriodHours: number;
    oneClaimPerAccount: boolean;
  };
  claim?: BonusClaim;
}

export type DailyBonusDayState = "claimed" | "claimable" | "locked";

export interface DailyBonusDay {
  day: number;
  amountMnt: number;
  state: DailyBonusDayState;
  isJackpot: boolean;
}

export interface DailyBonus {
  catalog: Bonus;
  currentDay: number;
  days: DailyBonusDay[];
  claimedToday: boolean;
  nextClaimAt: string | null;
  lastClaimedAt: string | null;
  status: Extract<ClaimAvailability, "available" | "claimed" | "locked">;
}

export type MissionStatus = "in_progress" | "claimable" | "claimed";

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: "mnt" | "games";
  reward: BonusReward;
  status: MissionStatus;
  resetsAt: string;
}

export interface DailyMissionBoard {
  catalog: Bonus;
  missions: DailyMission[];
  resetsAt: string;
}

export type ScratchCardStatus = "ready" | "claimed";

export interface ScratchCard {
  id: string;
  status: ScratchCardStatus;
  source: string;
  reward?: BonusReward;
  claimedAt?: string;
}

export interface ScratchCardBoard {
  catalog: Bonus;
  cards: ScratchCard[];
  possibleRewards: BonusReward[];
  earnRules: { minDepositMnt: number; cards: number }[];
}

export type MysteryBoxTier = "bronze" | "silver" | "gold";

export interface MysteryBox {
  id: string;
  tier: MysteryBoxTier;
  status: "available" | "opened";
  reward?: BonusReward;
  openedAt?: string;
}

export interface MysteryBoxPool {
  tier: MysteryBoxTier;
  rewards: { amountMnt: number; weight: number; kind?: "cash" | "jackpot" }[];
}

export interface MysteryBoxBoard {
  catalog: Bonus;
  boxes: MysteryBox[];
  pools: MysteryBoxPool[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  prizeMnt: number;
  isCurrentUser: boolean;
}

export interface DiamondRace {
  catalog: Bonus;
  title: string;
  startsAt: string;
  endsAt: string;
  remainingMs: number;
  status: Extract<ClaimAvailability, "active" | "ended">;
  currentUser: { rank: number | null; points: number; prizeMnt: number };
  prizeTiers: { rankLabel: string; prizeMnt: number }[];
  leaderboard: LeaderboardEntry[];
}

export interface WeekendBoostTier {
  minDepositMnt: number;
  bonusPercent: number;
}

export interface WeekendBoost {
  catalog: Bonus;
  status: Extract<ClaimAvailability, "active" | "ended">;
  startsAt: string;
  endsAt: string;
  remainingMs: number;
  maxBonusMnt: number;
  tiers: WeekendBoostTier[];
  eligibility: Extract<ClaimAvailability, "available" | "claimed" | "not_eligible">;
  claim?: BonusClaim;
}

/** Shape for a future Bonus Management admin UI (this project has no admin app yet). */
export interface BonusAdminConfig {
  bonusName: string;
  description: string;
  reward: string;
  minimumDepositMnt: number | null;
  maximumRewardMnt: number | null;
  wageringMultiplier: number | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  claimLimit: number | null;
  eligibility: string;
  rewardProbabilities?: { amountMnt: number; weight: number }[];
  missionTarget?: number;
  missionProgressUnit?: "mnt" | "games";
}

export interface BonusSnapshot {
  user: User;
  catalog: Bonus[];
  welcome: WelcomeBonus;
  daily: DailyBonus;
  missions: DailyMissionBoard;
  scratch: ScratchCardBoard;
  mystery: MysteryBoxBoard;
  race: DiamondRace;
  weekend: WeekendBoost;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 500, code = "api_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** UI and hooks depend on this contract — never on Diamond HTTP paths. */
export interface BonusService {
  getCatalog(): Promise<Bonus[]>;
  getUser(): Promise<User>;
  getWelcomeBonus(): Promise<WelcomeBonus>;
  claimWelcomeBonus(): Promise<WelcomeBonus>;
  getDailyBonus(): Promise<DailyBonus>;
  claimDailyBonus(): Promise<DailyBonus>;
  getDailyMissions(): Promise<DailyMissionBoard>;
  claimMission(missionId: string): Promise<DailyMissionBoard>;
  getScratchCards(): Promise<ScratchCardBoard>;
  claimScratchCard(cardId: string): Promise<ScratchCardBoard>;
  getMysteryBoxes(): Promise<MysteryBoxBoard>;
  openMysteryBox(boxId: string): Promise<MysteryBoxBoard>;
  getDiamondRace(): Promise<DiamondRace>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  getWeekendBoost(): Promise<WeekendBoost>;
  claimWeekendBoost(depositMnt: number): Promise<WeekendBoost>;
}
