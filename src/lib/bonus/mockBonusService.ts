import {
  catalogConfig,
  dailyBonusSchedule,
  getCatalogItem,
  missionTemplates,
  mysteryPools,
  raceConfig,
  scratchConfig,
  weekendConfig,
  welcomeConfig,
} from "./admin-config";
import {
  formatRewardLabel,
  isSameLocalDay,
  localDayKey,
  nextLocalMidnight,
  pickWeighted,
  startOfLocalDay,
  weekendWindow,
} from "./format";
import type {
  Bonus,
  BonusClaim,
  BonusId,
  BonusReward,
  BonusService,
  DailyBonus,
  DailyMission,
  DailyMissionBoard,
  DiamondRace,
  LeaderboardEntry,
  MysteryBox,
  MysteryBoxBoard,
  ScratchCard,
  ScratchCardBoard,
  User,
  WeekendBoost,
  WelcomeBonus,
} from "./types";
import { ApiError } from "./types";

const STORAGE_KEY = "diamond-bonus-mock-v1";

interface MockState {
  user: User;
  welcomeClaim: BonusClaim | null;
  daily: {
    currentDay: number;
    lastClaimedAt: string | null;
    claimedDays: number[];
  };
  missionDayKey: string;
  missions: Record<string, { current: number; status: DailyMission["status"] }>;
  scratchCards: ScratchCard[];
  boxes: MysteryBox[];
  weekendClaim: BonusClaim | null;
  weekendClaimKey: string | null;
  racePoints: number;
}

function defaultMissions(): MockState["missions"] {
  return {
    "deposit-50k": { current: 30_000, status: "in_progress" },
    "play-50k": { current: 50_000, status: "claimable" },
    "play-10-games": { current: 4, status: "in_progress" },
    "win-3-games": { current: 3, status: "claimable" },
    "slots-30k": { current: 12_000, status: "in_progress" },
  };
}

function defaultState(): MockState {
  const registeredAt = new Date();
  registeredAt.setHours(registeredAt.getHours() - 2);
  return {
    user: {
      id: "user-mock-1",
      displayName: "You",
      isNewRegistrant: true,
      registeredAt: registeredAt.toISOString(),
    },
    welcomeClaim: null,
    daily: {
      currentDay: 3,
      lastClaimedAt: yesterdayIso(),
      claimedDays: [1, 2],
    },
    missionDayKey: localDayKey(),
    missions: defaultMissions(),
    scratchCards: [
      { id: "scratch-1", status: "ready", source: "deposit_30000" },
      { id: "scratch-2", status: "ready", source: "deposit_100000" },
      { id: "scratch-3", status: "ready", source: "deposit_100000" },
    ],
    boxes: [
      { id: "box-bronze-1", tier: "bronze", status: "available" },
      { id: "box-silver-1", tier: "silver", status: "available" },
      { id: "box-gold-1", tier: "gold", status: "available" },
    ],
    weekendClaim: null,
    weekendClaimKey: null,
    racePoints: 12_400,
  };
}

function yesterdayIso(): string {
  const d = startOfLocalDay();
  d.setDate(d.getDate() - 1);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
}

function loadState(): MockState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...(JSON.parse(raw) as MockState) };
  } catch {
    return defaultState();
  }
}

let state = loadState();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function reward(amountMnt: number, kind: BonusReward["kind"] | null = null): BonusReward {
  const result: BonusReward = {
    amountMnt,
    label: formatRewardLabel(amountMnt, kind ?? undefined),
  };
  if (kind) result.kind = kind;
  return result;
}

function newClaim(
  bonusId: BonusId,
  status: BonusClaim["status"],
  extra?: Partial<BonusClaim>,
): BonusClaim {
  return {
    id: `claim-${bonusId}-${Date.now()}`,
    userId: state.user.id,
    bonusId,
    status,
    ...extra,
  };
}

function resetMissionsIfNeeded() {
  const today = localDayKey();
  if (state.missionDayKey === today) return;
  state.missionDayKey = today;
  state.missions = defaultMissions();
  persist();
}

function prizeForRank(rank: number): number {
  const tier = raceConfig.prizeTiers.find((item) => rank >= item.rankFrom && rank <= item.rankTo);
  return tier?.prizeMnt ?? 0;
}

function buildLeaderboard(): LeaderboardEntry[] {
  const names = [
    "Munkh",
    "Sarnai",
    "Bat",
    "Nomin",
    "Temuulen",
    "Anu",
    "Khangai",
    "You",
    "Gerel",
    "Tuya",
    "Bold",
    "Oyuna",
    "Naran",
    "Khulan",
    "Ganbaatar",
  ];
  const points = [25400, 21300, 19850, 17600, 16220, 15100, 13880, state.racePoints, 11900, 10850, 9900, 9100, 8700, 8200, 7600];
  return names.map((displayName, index) => {
    const rank = index + 1;
    const userId = displayName === "You" ? state.user.id : `racer-${rank}`;
    return {
      rank,
      userId,
      displayName,
      points: points[index] ?? 0,
      prizeMnt: prizeForRank(rank),
      isCurrentUser: displayName === "You",
    };
  });
}

export const mockBonusService: BonusService = {
  async getCatalog(): Promise<Bonus[]> {
    return catalogConfig;
  },

  async getUser(): Promise<User> {
    return state.user;
  },

  async getWelcomeBonus(): Promise<WelcomeBonus> {
    const catalog = getCatalogItem("welcome");
    const registeredAt = new Date(state.user.registeredAt);
    const expiresAt = new Date(registeredAt.getTime() + welcomeConfig.claimPeriodHours * 3_600_000);
    const expired = Date.now() > expiresAt.getTime();

    let status: WelcomeBonus["status"] = "available";
    if (!state.user.isNewRegistrant) status = "not_eligible";
    else if (state.welcomeClaim) status = "claimed";
    else if (expired) status = "expired";

    return {
      catalog,
      status,
      rules: { ...welcomeConfig },
      ...(state.welcomeClaim ? { claim: state.welcomeClaim } : {}),
    };
  },

  async claimWelcomeBonus(): Promise<WelcomeBonus> {
    const current = await this.getWelcomeBonus();
    if (current.status === "not_eligible") {
      throw new ApiError("Not eligible for welcome bonus", 403, "not_eligible");
    }
    if (current.status === "claimed") {
      throw new ApiError("Welcome bonus already claimed", 409, "already_claimed");
    }
    if (current.status === "expired") {
      throw new ApiError("Welcome bonus claim period has expired", 410, "expired");
    }
    state.welcomeClaim = newClaim("welcome", "claimed", {
      claimedAt: new Date().toISOString(),
      reward: reward(welcomeConfig.registrationBonusMnt),
    });
    persist();
    return this.getWelcomeBonus();
  },

  async getDailyBonus(): Promise<DailyBonus> {
    const catalog = getCatalogItem("daily");
    let { currentDay, lastClaimedAt, claimedDays } = state.daily;

    if (lastClaimedAt && !isSameLocalDay(lastClaimedAt) && !isYesterday(lastClaimedAt)) {
      currentDay = 1;
      claimedDays = [];
      state.daily = { currentDay, lastClaimedAt: null, claimedDays };
      persist();
    }

    const claimedToday = Boolean(lastClaimedAt && isSameLocalDay(lastClaimedAt));
    const days = dailyBonusSchedule.map((entry) => {
      if (claimedDays.includes(entry.day)) {
        return { ...entry, state: "claimed" as const, isJackpot: entry.day === 7 };
      }
      if (!claimedToday && entry.day === currentDay) {
        return { ...entry, state: "claimable" as const, isJackpot: entry.day === 7 };
      }
      return { ...entry, state: "locked" as const, isJackpot: entry.day === 7 };
    });

    return {
      catalog,
      currentDay,
      days,
      claimedToday,
      nextClaimAt: claimedToday ? nextLocalMidnight().toISOString() : null,
      lastClaimedAt,
      status: claimedToday ? "claimed" : "available",
    };
  },

  async claimDailyBonus(): Promise<DailyBonus> {
    const board = await this.getDailyBonus();
    if (board.claimedToday) {
      throw new ApiError("Daily bonus already claimed today", 409, "already_claimed");
    }
    const claimable = board.days.find((day) => day.state === "claimable");
    if (!claimable) {
      throw new ApiError("No daily bonus is available", 400, "not_available");
    }
    const claimedDays = [...state.daily.claimedDays, claimable.day];
    const nextDay = claimable.day >= 7 ? 1 : claimable.day + 1;
    state.daily = {
      currentDay: nextDay,
      lastClaimedAt: new Date().toISOString(),
      claimedDays: claimable.day >= 7 ? [] : claimedDays,
    };
    persist();
    return this.getDailyBonus();
  },

  async getDailyMissions(): Promise<DailyMissionBoard> {
    resetMissionsIfNeeded();
    const resetsAt = nextLocalMidnight().toISOString();
    const missions: DailyMission[] = missionTemplates.map((template) => {
      const progress = state.missions[template.id] ?? { current: 0, status: "in_progress" as const };
      return {
        id: template.id,
        title: template.title,
        description: template.description,
        current: Math.min(progress.current, template.target),
        target: template.target,
        unit: template.unit,
        reward: reward(template.rewardMnt),
        status: progress.status,
        resetsAt,
      };
    });
    return { catalog: getCatalogItem("mission"), missions, resetsAt };
  },

  async claimMission(missionId: string): Promise<DailyMissionBoard> {
    resetMissionsIfNeeded();
    const progress = state.missions[missionId];
    const template = missionTemplates.find((item) => item.id === missionId);
    if (!progress || !template) {
      throw new ApiError("Mission not found", 404, "not_found");
    }
    if (progress.status === "claimed") {
      throw new ApiError("Mission already claimed", 409, "already_claimed");
    }
    if (progress.current < template.target || progress.status !== "claimable") {
      throw new ApiError("Mission is not complete", 400, "not_complete");
    }
    state.missions[missionId] = { ...progress, status: "claimed" };
    persist();
    return this.getDailyMissions();
  },

  async getScratchCards(): Promise<ScratchCardBoard> {
    return {
      catalog: getCatalogItem("scratch"),
      cards: state.scratchCards,
      possibleRewards: scratchConfig.possibleRewards.map((item) =>
        reward(item.amountMnt, "kind" in item && item.kind ? item.kind : null),
      ),
      earnRules: scratchConfig.earnRules,
    };
  },

  async claimScratchCard(cardId: string): Promise<ScratchCardBoard> {
    const card = state.scratchCards.find((item) => item.id === cardId);
    if (!card) throw new ApiError("Scratch card not found", 404, "not_found");
    if (card.status === "claimed") {
      throw new ApiError("This card has already been claimed", 409, "already_claimed");
    }
    const picked = pickWeighted(scratchConfig.possibleRewards);
    card.status = "claimed";
    card.reward = reward(picked.amountMnt, picked.kind);
    card.claimedAt = new Date().toISOString();
    persist();
    return this.getScratchCards();
  },

  async getMysteryBoxes(): Promise<MysteryBoxBoard> {
    return {
      catalog: getCatalogItem("mystery"),
      boxes: state.boxes,
      pools: mysteryPools,
    };
  },

  async openMysteryBox(boxId: string): Promise<MysteryBoxBoard> {
    const box = state.boxes.find((item) => item.id === boxId);
    if (!box) throw new ApiError("Mystery box not found", 404, "not_found");
    if (box.status === "opened") {
      throw new ApiError("This box has already been opened", 409, "already_opened");
    }
    const pool = mysteryPools.find((item) => item.tier === box.tier);
    if (!pool) throw new ApiError("Reward pool missing", 500, "config_error");
    const picked = pickWeighted(pool.rewards);
    box.status = "opened";
    box.reward = reward(picked.amountMnt, picked.kind);
    box.openedAt = new Date().toISOString();
    persist();
    return this.getMysteryBoxes();
  },

  async getDiamondRace(): Promise<DiamondRace> {
    const startsAt = new Date(raceConfig.startsAt);
    const endsAt = new Date(raceConfig.endsAt);
    const now = Date.now();
    const leaderboard = buildLeaderboard().sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1, prizeMnt: prizeForRank(index + 1) }));
    const current = leaderboard.find((entry) => entry.isCurrentUser);
    return {
      catalog: getCatalogItem("race"),
      title: raceConfig.title,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      remainingMs: Math.max(0, endsAt.getTime() - now),
      status: now >= startsAt.getTime() && now <= endsAt.getTime() ? "active" : "ended",
      currentUser: {
        rank: current?.rank ?? null,
        points: current?.points ?? state.racePoints,
        prizeMnt: current?.prizeMnt ?? 0,
      },
      prizeTiers: raceConfig.prizeTiers.map((tier) => ({
        rankLabel: tier.rankFrom === tier.rankTo ? `#${tier.rankFrom}` : `#${tier.rankFrom}–${tier.rankTo}`,
        prizeMnt: tier.prizeMnt,
      })),
      leaderboard,
    };
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const race = await this.getDiamondRace();
    return race.leaderboard;
  },

  async getWeekendBoost(): Promise<WeekendBoost> {
    const now = new Date();
    const { startsAt, endsAt } = weekendWindow(now);
    const isWeekend = weekendConfig.days.includes(now.getDay());
    const weekKey = startsAt.toISOString().slice(0, 10);
    if (state.weekendClaimKey && state.weekendClaimKey !== weekKey) {
      state.weekendClaim = null;
      state.weekendClaimKey = null;
      persist();
    }
    const eligibility = !isWeekend
      ? "not_eligible"
      : state.weekendClaim
        ? "claimed"
        : "available";
    return {
      catalog: getCatalogItem("weekend"),
      status: isWeekend && now <= endsAt ? "active" : "ended",
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      remainingMs: isWeekend ? Math.max(0, endsAt.getTime() - now.getTime()) : 0,
      maxBonusMnt: weekendConfig.maxBonusMnt,
      tiers: weekendConfig.tiers,
      eligibility,
      ...(state.weekendClaim ? { claim: state.weekendClaim } : {}),
    };
  },

  async claimWeekendBoost(depositMnt: number): Promise<WeekendBoost> {
    const board = await this.getWeekendBoost();
    if (board.status !== "active") {
      throw new ApiError("Weekend boost is not active", 400, "ended");
    }
    if (board.eligibility === "claimed") {
      throw new ApiError("Weekend boost already claimed", 409, "already_claimed");
    }
    const sorted = [...board.tiers].sort((a, b) => b.minDepositMnt - a.minDepositMnt);
    const tier = sorted.find((item) => depositMnt >= item.minDepositMnt);
    if (!tier) {
      throw new ApiError("Deposit does not meet the minimum tier", 400, "not_eligible");
    }
    const raw = Math.floor((depositMnt * tier.bonusPercent) / 100);
    const amountMnt = Math.min(raw, board.maxBonusMnt);
    const weekKey = new Date(board.startsAt).toISOString().slice(0, 10);
    state.weekendClaim = newClaim("weekend", "claimed", {
      claimedAt: new Date().toISOString(),
      reward: reward(amountMnt),
    });
    state.weekendClaimKey = weekKey;
    persist();
    return this.getWeekendBoost();
  },
};

function isYesterday(iso: string): boolean {
  const target = startOfLocalDay();
  target.setDate(target.getDate() - 1);
  return startOfLocalDay(new Date(iso)).getTime() === target.getTime();
}
