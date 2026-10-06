import { createFileRoute, notFound } from "@tanstack/react-router";
import { BonusPageShell } from "@/components/bonus/BonusPageShell";
import { PromoInfoPanel } from "@/components/bonus/PromoInfoPanel";
import { ScratchCardPanel } from "@/components/bonus/ScratchCardPanel";
import { getCatalogItem } from "@/lib/bonus/admin-config";
import type { BonusId } from "@/lib/bonus/types";

const bonusIds = ["welcome", "daily", "mission", "scratch", "mystery", "race", "weekend"] as const;

function isBonusId(value: string): value is BonusId {
  return (bonusIds as readonly string[]).includes(value);
}

export const Route = createFileRoute("/bonuses/$bonusId")({
  beforeLoad: ({ params }) => {
    if (!isBonusId(params.bonusId)) throw notFound();
  },
  head: ({ params }) => {
    const bonusId = isBonusId(params.bonusId) ? params.bonusId : "welcome";
    const meta = getCatalogItem(bonusId);
    return { meta: [{ title: `${meta.title} | DIAMOND Promotions` }] };
  },
  component: BonusDetailPage,
});

function BonusDetailPage() {
  const { bonusId } = Route.useParams();
  if (!isBonusId(bonusId)) return null;
  const meta = getCatalogItem(bonusId);

  return (
    <BonusPageShell title={meta.title} eyebrow={meta.eyebrow} imageKey={bonusId}>
      {bonusId === "scratch" ? <ScratchCardPanel /> : <PromoInfoPanel bonusId={bonusId} />}
    </BonusPageShell>
  );
}
