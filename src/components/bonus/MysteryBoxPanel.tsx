import { useState } from "react";
import { ClaimControls } from "@/components/bonus/ClaimControls";
import { QueryState, StatusBadge } from "@/components/bonus/StatusBadge";
import { Button } from "@/components/ui/button";
import { useMysteryBoxes } from "@/hooks/use-bonus";
import { formatMnt } from "@/lib/bonus/format";
import type { MysteryBoxTier } from "@/lib/bonus/types";
import { cn } from "@/lib/utils";

const tierStyles: Record<MysteryBoxTier, string> = {
  bronze: "from-amber-800 to-amber-500",
  silver: "from-slate-400 to-slate-200",
  gold: "from-yellow-500 to-amber-200",
};

export function MysteryBoxPanel() {
  const query = useMysteryBoxes();
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [openingId, setOpeningId] = useState<string | null>(null);

  function handleOpen(boxId: string) {
    setOpeningId(boxId);
    window.setTimeout(() => {
      setOpened((current) => ({ ...current, [boxId]: true }));
      setOpeningId(null);
    }, 700);
  }

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {query.data ? (
        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            {query.data.boxes.map((box) => (
              <article key={box.id} className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
                <div
                  className={cn(
                    "mx-auto grid h-28 w-28 place-items-center rounded-xl bg-gradient-to-b text-3xl shadow-lg",
                    tierStyles[box.tier],
                    openingId === box.id && "mystery-box-shake",
                  )}
                >
                  {opened[box.id] ? "🎁" : "📦"}
                </div>
                <h3 className="mt-3 font-display text-lg font-black capitalize">{box.tier} Box</h3>
                <StatusBadge status={opened[box.id] ? "available" : "locked"} />
                <Button
                  variant="gold"
                  className="mt-3 w-full rounded-full"
                  disabled={Boolean(opened[box.id]) || openingId !== null}
                  onClick={() => handleOpen(box.id)}
                >
                  OPEN BOX
                </Button>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <ClaimControls bonusId="mystery" label="CLAIM" />
          </div>
          <section className="mt-4 rounded-lg pale-surface p-4">
            <h3 className="font-display font-black">Configurable reward pools</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {query.data.pools.map((pool) => (
                <div key={pool.tier}>
                  <p className="text-xs font-extrabold uppercase">{pool.tier}</p>
                  <ul className="mt-1 text-xs text-muted-foreground">
                    {pool.rewards.map((item) => (
                      <li key={`${pool.tier}-${item.amountMnt}`}>{formatMnt(item.amountMnt)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </QueryState>
  );
}
