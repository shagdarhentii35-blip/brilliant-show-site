import type { Bonus, BonusId, MysteryBoxPool } from "./types";

/**
 * Admin-ready bonus configuration (no admin UI exists in this project).
 * When an admin app is added, bind forms to these objects — do not copy values into components.
 */
export const catalogConfig: Bonus[] = [
  {
    id: "welcome",
    name: "First Deposit 100%",
    eyebrow: "FIRST DEPOSIT",
    title: "FIRST DEPOSIT 100% BONUS",
    highlight: "UP TO 1,000,000₮",
    description: "100% bonus on first deposit",
    points: ["100% bonus on first deposit", "Maximum bonus: 1,000,000₮", "New users only"],
    detail:
      "New users can receive a 100% bonus on their first deposit, up to 1,000,000₮. This page is information only — bonuses are not claimed or calculated on this website.",
    action: "VIEW DETAILS",
    badge: "gold",
    imageKey: "welcome",
    placement: "featured",
    kind: "info",
    emphasized: true,
  },
  {
    id: "daily",
    name: "Deposit Bonus",
    eyebrow: "DEPOSIT",
    title: "DEPOSIT BONUS",
    highlight: "10% EVERY DEPOSIT",
    description: "10% bonus on every deposit",
    points: ["10% bonus on every deposit", "Available for eligible deposits", "Promotion terms apply"],
    detail:
      "Eligible deposits may receive a 10% bonus according to the active promotion terms. This website does not track deposits or apply bonuses automatically.",
    action: "VIEW DETAILS",
    badge: "blue",
    imageKey: "daily",
    placement: "featured",
    kind: "info",
  },
  {
    id: "mission",
    name: "Cashback",
    eyebrow: "CASHBACK",
    title: "CASHBACK",
    highlight: "5–10% CASHBACK",
    description: "Weekly or monthly promotion",
    points: ["5–10% cashback", "Cashback depends on promotion conditions", "Weekly or monthly promotion"],
    detail:
      "Cashback of 5–10% may be offered under weekly or monthly promotion conditions. Rates and eligibility are not calculated on this website.",
    action: "VIEW DETAILS",
    badge: "green",
    imageKey: "mission",
    placement: "featured",
    kind: "info",
  },
  {
    id: "race",
    name: "VIP Program",
    eyebrow: "VIP",
    title: "VIP PROGRAM",
    highlight: "COMING SOON / ТУН УДАХГҮЙ",
    description: "Exclusive VIP rewards",
    points: ["Exclusive VIP rewards", "Special VIP benefits", "More details coming soon"],
    detail: "The DIAMOND VIP program is coming soon. Exclusive rewards and benefits will be announced here — no VIP levels or deposit tracking on this site.",
    action: "COMING SOON",
    badge: "gold",
    imageKey: "race",
    placement: "featured",
    kind: "comingSoon",
  },
  {
    id: "mystery",
    name: "Special Event",
    eyebrow: "EVENT",
    title: "SPECIAL EVENT",
    highlight: "LIMITED-TIME PROMOTIONS",
    description: "Giveaways and seasonal promotions",
    points: ["Special events", "Giveaways", "Seasonal promotions", "Limited-time rewards"],
    detail:
      "Watch this space for limited-time events, giveaways, and seasonal promotions. Details are informational and do not grant rewards from this website.",
    action: "VIEW DETAILS",
    badge: "pink",
    imageKey: "mystery",
    placement: "featured",
    kind: "info",
  },
  {
    id: "scratch",
    name: "Scratch Card",
    eyebrow: "SCRATCH & WIN",
    title: "SCRATCH CARD",
    highlight: "SCRATCH & WIN",
    description: "Scratch and reveal your reward",
    points: ["Get a scratch card through eligible promotions", "Scratch and reveal your reward"],
    detail:
      "Scratch cards may be offered through eligible promotions. Scratch here to reveal a prize presentation — this is the only interactive promotion on this site.",
    action: "SCRATCH NOW",
    badge: "purple",
    imageKey: "scratch",
    placement: "featured",
    kind: "interactive",
  },
  {
    id: "weekend",
    name: "Weekend Boost",
    eyebrow: "АМРАЛТЫН БОНУС",
    title: "WEEKEND BOOST",
    highlight: "WEEKEND OFFER",
    description: "Saturday–Sunday information",
    points: ["Weekend promotion details", "Terms apply"],
    detail: "Weekend offers are described for information only and are not claimed on this website.",
    action: "VIEW DETAILS",
    badge: "gold",
    imageKey: "weekend",
    placement: "more",
    kind: "info",
    visible: false,
  },
];

export const welcomeConfig = {
  newRegisteredUsersOnly: true,
  registrationBonusMnt: 10_000,
  firstDepositPercent: 100,
  minDepositMnt: 10_000,
  maxBonusMnt: 1_000_000,
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
  cooldownMs: 25 * 60 * 60 * 1000,
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

export function listedCatalog(): Bonus[] {
  return catalogConfig.filter((item) => item.visible !== false);
}

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
