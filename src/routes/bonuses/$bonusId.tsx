import { createFileRoute, notFound } from "@tanstack/react-router";
import { BonusPageShell } from "@/components/bonus/BonusPageShell";
import { DailyBonusPanel } from "@/components/bonus/DailyBonusPanel";
import { DailyMissionPanel } from "@/components/bonus/DailyMissionPanel";
import { DiamondRacePanel } from "@/components/bonus/DiamondRacePanel";
import { MysteryBoxPanel } from "@/components/bonus/MysteryBoxPanel";
import { ScratchCardPanel } from "@/components/bonus/ScratchCardPanel";
import { WeekendBoostPanel } from "@/components/bonus/WeekendBoostPanel";
import { WelcomeBonusPanel } from "@/components/bonus/WelcomeBonusPanel";
import type { BonusId } from "@/lib/bonus/types";

const bonusIds = ["welcome", "daily", "mission", "scratch", "mystery", "race", "weekend"] as const;

function isBonusId(value: string): value is BonusId {
  return (bonusIds as readonly string[]).includes(value);
}

const titles: Record<BonusId, { title: string; eyebrow: string }> = {
  welcome: { title: "WELCOME BONUS", eyebrow: "New player" },
  daily: { title: "DAILY BONUS", eyebrow: "7-day streak" },
  mission: { title: "DAILY MISSION", eyebrow: "Tasks" },
  scratch: { title: "SCRATCH CARD", eyebrow: "Reveal" },
  mystery: { title: "MYSTERY BOX", eyebrow: "Open" },
  race: { title: "DIAMOND RACE", eyebrow: "Leaderboard" },
  weekend: { title: "WEEKEND BOOST", eyebrow: "Sat–Sun" },
};

export const Route = createFileRoute("/bonuses/$bonusId")({
  beforeLoad: ({ params }) => {
    if (!isBonusId(params.bonusId)) throw notFound();
  },
  head: ({ params }) => {
    const bonusId = isBonusId(params.bonusId) ? params.bonusId : "welcome";
    const meta = titles[bonusId];
    return { meta: [{ title: `${meta.title} | DIAMOND Promotions` }] };
  },
  component: BonusDetailPage,
});

function BonusDetailPage() {
  const { bonusId } = Route.useParams();
  if (!isBonusId(bonusId)) return null;
  const meta = titles[bonusId];

  return (
    <BonusPageShell title={meta.title} eyebrow={meta.eyebrow} imageKey={bonusId}>
      {bonusId === "welcome" ? <WelcomeBonusPanel /> : null}
      {bonusId === "daily" ? <DailyBonusPanel /> : null}
      {bonusId === "mission" ? <DailyMissionPanel /> : null}
      {bonusId === "scratch" ? <ScratchCardPanel /> : null}
      {bonusId === "mystery" ? <MysteryBoxPanel /> : null}
      {bonusId === "race" ? <DiamondRacePanel /> : null}
      {bonusId === "weekend" ? <WeekendBoostPanel /> : null}
    </BonusPageShell>
  );
}
