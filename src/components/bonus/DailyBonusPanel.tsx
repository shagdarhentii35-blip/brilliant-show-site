import { QueryState } from "@/components/bonus/StatusBadge";
import { ClaimControls } from "@/components/bonus/ClaimControls";
import { useDailyBonus } from "@/hooks/use-bonus";
import { formatMnt, formatRemaining } from "@/lib/bonus/format";
import { cn } from "@/lib/utils";

export function DailyBonusPanel() {
  const query = useDailyBonus();
  const data = query.data;
  const remaining = data?.nextClaimAt ? Math.max(0, new Date(data.nextClaimAt).getTime() - Date.now()) : 0;
  const today = data?.days.find((day) => day.state === "claimable");

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {data ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-black">7-DAY DAILY BONUS</h2>
          {today ? (
            <p className="mt-2 text-sm font-bold text-primary">
              Today&apos;s listed reward: Day {today.day} — {formatMnt(today.amountMnt)}
            </p>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {data.days.map((day) => (
              <div
                key={day.day}
                className={cn(
                  "rounded-lg pale-surface p-3 text-center",
                  day.state === "claimable" && "ring-2 ring-gold",
                )}
              >
                <p className="text-[10px] font-extrabold uppercase text-muted-foreground">DAY {day.day}</p>
                <p className="mt-1 font-display text-lg font-black">
                  {day.state === "claimed" ? "✓" : day.state === "claimable" ? "CLAIM" : day.isJackpot ? "💎" : "🔒"}
                </p>
                <p className="text-xs font-bold">{formatMnt(day.amountMnt)}</p>
              </div>
            ))}
          </div>
          {data.nextClaimAt ? (
            <p className="mt-3 text-sm text-muted-foreground">Next listed day in {formatRemaining(remaining)}</p>
          ) : null}
          <ClaimControls bonusId="daily" label="CLAIM TODAY'S BONUS" />
        </div>
      ) : null}
    </QueryState>
  );
}
