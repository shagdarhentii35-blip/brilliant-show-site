import { useState } from "react";
import { ScratchCanvas } from "@/components/bonus/ScratchCanvas";
import { ClaimControls } from "@/components/bonus/ClaimControls";
import { QueryState, StatusBadge } from "@/components/bonus/StatusBadge";
import { Button } from "@/components/ui/button";
import { useScratchCards } from "@/hooks/use-bonus";
import { formatMnt } from "@/lib/bonus/format";
import { promotionClaimAmountMnt } from "@/lib/bonus/admin-config";

export function ScratchCardPanel() {
  const query = useScratchCards();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const cards = query.data?.cards ?? [];
  const active = cards.find((card) => card.id === (activeId ?? cards[0]?.id));
  const claimAmount = formatMnt(promotionClaimAmountMnt.scratch);

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {query.data ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            {active ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-black">Scratch card</h2>
                  <StatusBadge status={revealed[active.id] ? "available" : "locked"} />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 grid place-items-center rounded-lg bg-deep-sea text-primary-foreground">
                    <p className="font-display text-3xl font-black">{claimAmount}</p>
                  </div>
                  {revealed[active.id] ? (
                    <div className="grid h-44 place-items-center rounded-lg border border-gold bg-deep-sea text-gold">
                      <p className="font-display text-3xl font-black">{claimAmount}</p>
                    </div>
                  ) : (
                    <ScratchCanvas
                      key={active.id}
                      disabled={false}
                      onComplete={() => setRevealed((current) => ({ ...current, [active.id]: true }))}
                    />
                  )}
                </div>
                <ClaimControls bonusId="scratch" label="CLAIM" />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No scratch cards yet.</p>
            )}
          </div>
          <aside className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-display font-black">Your cards</h3>
            <div className="mt-2 space-y-2">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant={card.id === active?.id ? "casino" : "outline"}
                  size="sm"
                  className="w-full justify-between rounded-full"
                  onClick={() => setActiveId(card.id)}
                >
                  <span>{card.id}</span>
                  <span>{revealed[card.id] ? claimAmount : "Ready"}</span>
                </Button>
              ))}
            </div>
            <h3 className="mt-4 font-display font-black">Earn more</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {query.data.earnRules.map((rule) => (
                <li key={rule.minDepositMnt}>
                  Deposit {formatMnt(rule.minDepositMnt)} → {rule.cards} Scratch Card{rule.cards > 1 ? "s" : ""}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 font-display font-black">Possible rewards</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {query.data.possibleRewards.map((item) => item.label).join(" · ")}
            </p>
          </aside>
        </div>
      ) : null}
    </QueryState>
  );
}
