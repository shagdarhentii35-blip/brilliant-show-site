import type { Bonus, BonusId, MysteryBoxPool } from "./types";

/**
 * Admin-ready bonus configuration (no admin UI exists in this project).
 * When an admin app is added, bind forms to these objects — do not copy values into components.
 */
export const catalogConfig: Bonus[] = [
  {
    id: "welcome",
    name: "Welcome Bonus",
    eyebrow: "ШИНЭ ТОГЛОГЧ",
    title: "WELCOME BONUS",
    description: "Register and get 10,000₮",
    detail:
      "New registered users only. Registration bonus, first-deposit match, wagering, and a 24-hour claim window are enforced by the bonus service — not the UI.",
    action: "CLAIM BONUS",
    badge: "pink",
    imageKey: "welcome",
    placement: "featured",
  },
  {
    id: "daily",
    name: "Daily Bonus",
    eyebrow: "ӨДӨР БҮРИЙН",
    title: "DAILY BONUS",
    description: "7-day sequential rewards",
    detail: "Claim once per day, in order. A missed day resets the streak to Day 1.",
    action: "CLAIM TODAY'S BONUS",
    badge: "blue",
    imageKey: "daily",
    placement: "featured",
  },
  {
    id: "mission",
    name: "Daily Mission",
    eyebrow: "ДААЛГАВАР",
    title: "DAILY MISSION",
    description: "Complete tasks, claim rewards",
    detail: "Mission progress and rewards are returned by the service. Boards reset daily.",
    action: "VIEW MISSIONS",
    badge: "green",
    imageKey: "mission",
    placement: "featured",
  },
  {
    id: "scratch",
    name: "Scratch Card",
    eyebrow: "АЗЫН КАРТ",
    title: "SCRATCH CARD",
    description: "Scratch to reveal a prize",
    detail: "Card grants come from deposit rules. The revealed amount is assigned by the service.",
    action: "SCRATCH TO REVEAL",
    badge: "purple",
    imageKey: "scratch",
    placement: "featured",
  },
  {
    id: "mystery",
    name: "Mystery Box",
    eyebrow: "НУУЦ ХАЙРЦАГ",
    title: "MYSTERY BOX",
    description: "Open a box for a surprise reward",
    detail: "Reward pools and weights live in configuration. The UI only shows the opened result.",
    action: "OPEN BOX",
    badge: "gold",
    imageKey: "mystery",
    placement: "more",
  },
  {
    id: "race",
    name: "Diamond Race",
    eyebrow: "РАНКИНГ ЭВЕНТ",
    title: "DIAMOND RACE",
    description: "Compete on the leaderboard",
    detail: "Points, ranks, and prizes come from the race service — never computed in the browser.",
    action: "VIEW RACE",
    badge: "blue",
    imageKey: "race",
    placement: "more",
  },
  {
    id: "weekend",
    name: "Weekend Boost",
    eyebrow: "АМРАЛТЫН БОНУС",
    title: "WEEKEND BOOST",
    description: "Saturday–Sunday deposit boost",
    detail: "Active vs ended is determined from service time. Tiers and max bonus are configured.",
    action: "CLAIM BOOST",
    badge: "gold",
    imageKey: "weekend",
    placement: "more",
  },
];

export const welcomeConfig = {
  newRegisteredUsersOnly: true,
  registrationBonusMnt: 10_000,
  firstDepositPercent: 50,
  minDepositMnt: 10_000,
  maxBonusMnt: 100_000,
  wageringMultiplier: 5,
  claimPeriodHours: 24,
  oneClaimPerAccount: true,
};

export const dailyBonusSchedule = [
  { day: 1, amountMnt: 5_000 },
  { day: 2, amountMnt: 7_000 },
  { day: 3, amountMnt: 10_000 },
  { day: 4, amountMnt: 15_000 },
  { day: 5, amountMnt: 20_000 },
  { day: 6, amountMnt: 30_000 },
  { day: 7, amountMnt: 50_000 },
] as const;

export const missionTemplates = [
  {
    id: "deposit-50k",
    title: "Deposit 50,000₮",
    description: "Make deposits totaling 50,000₮ today",
    target: 50_000,
    unit: "mnt" as const,
    rewardMnt: 5_000,
  },
  {
    id: "play-50k",
    title: "Play 50,000₮",
    description: "Wager 50,000₮ across any games",
    target: 50_000,
    unit: "mnt" as const,
    rewardMnt: 5_000,
  },
  {
    id: "play-10-games",
    title: "Play 10 games",
    description: "Finish 10 game rounds today",
    target: 10,
    unit: "games" as const,
    rewardMnt: 3_000,
  },
  {
    id: "win-3-games",
    title: "Win 3 games",
    description: "Record 3 winning rounds",
    target: 3,
    unit: "games" as const,
    rewardMnt: 10_000,
  },
  {
    id: "slots-30k",
    title: "Play Slots 30,000₮",
    description: "Wager 30,000₮ on slots",
    target: 30_000,
    unit: "mnt" as const,
    rewardMnt: 5_000,
  },
];

export const scratchConfig = {
  possibleRewards: [
    { amountMnt: 1_000, weight: 28 },
    { amountMnt: 3_000, weight: 24 },
    { amountMnt: 5_000, weight: 18 },
    { amountMnt: 10_000, weight: 14 },
    { amountMnt: 20_000, weight: 9 },
    { amountMnt: 50_000, weight: 6 },
    { amountMnt: 100_000, weight: 1, kind: "jackpot" as const },
  ],
  earnRules: [
    { minDepositMnt: 30_000, cards: 1 },
    { minDepositMnt: 100_000, cards: 2 },
  ],
};

export const mysteryPools: MysteryBoxPool[] = [
  {
    tier: "bronze",
    rewards: [
      { amountMnt: 1_000, weight: 40 },
      { amountMnt: 3_000, weight: 30 },
      { amountMnt: 5_000, weight: 20 },
      { amountMnt: 10_000, weight: 10 },
    ],
  },
  {
    tier: "silver",
    rewards: [
      { amountMnt: 5_000, weight: 40 },
      { amountMnt: 10_000, weight: 30 },
      { amountMnt: 20_000, weight: 20 },
      { amountMnt: 50_000, weight: 10 },
    ],
  },
  {
    tier: "gold",
    rewards: [
      { amountMnt: 20_000, weight: 40 },
      { amountMnt: 50_000, weight: 30 },
      { amountMnt: 100_000, weight: 20 },
      { amountMnt: 500_000, weight: 10 },
    ],
  },
];

export const raceConfig = {
  title: "September Diamond Race",
  startsAt: "2026-09-01T00:00:00+08:00",
  endsAt: "2026-09-30T23:59:59+08:00",
  active: true,
  prizeTiers: [
    { rankFrom: 1, rankTo: 1, prizeMnt: 1_000_000 },
    { rankFrom: 2, rankTo: 2, prizeMnt: 500_000 },
    { rankFrom: 3, rankTo: 3, prizeMnt: 300_000 },
    { rankFrom: 4, rankTo: 10, prizeMnt: 100_000 },
    { rankFrom: 11, rankTo: 50, prizeMnt: 30_000 },
  ],
};

export const weekendConfig = {
  days: [6, 0] as number[],
  maxBonusMnt: 200_000,
  tiers: [
    { minDepositMnt: 50_000, bonusPercent: 20 },
    { minDepositMnt: 100_000, bonusPercent: 30 },
    { minDepositMnt: 500_000, bonusPercent: 50 },
  ],
};

export function getCatalogItem(id: BonusId): Bonus {
  const item = catalogConfig.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown bonus id: ${id}`);
  return item;
}

/** Amount saved on a PENDING claim. Server uses this; the UI cannot override it. */
export const promotionClaimAmountMnt: Record<BonusId, number> = {
  welcome: welcomeConfig.registrationBonusMnt,
  daily: 5_000,
  mission: 5_000,
  scratch: 5_000,
  mystery: 10_000,
  race: 30_000,
  weekend: 10_000,
};
