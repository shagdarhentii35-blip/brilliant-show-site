import { ClaimControls } from "@/components/bonus/ClaimControls";
import { QueryState, StatusBadge } from "@/components/bonus/StatusBadge";
import { useWeekendBoost } from "@/hooks/use-bonus";
import { formatDateTime, formatMnt, formatRemaining } from "@/lib/bonus/format";

export function WeekendBoostPanel() {
  const query = useWeekendBoost();
  const data = query.data;

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {data ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-black">WEEKEND BOOST</h2>
            <StatusBadge status={data.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDateTime(data.startsAt)} — {formatDateTime(data.endsAt)}
            {data.status === "active" ? ` · ${formatRemaining(data.remainingMs)} left` : ""}
          </p>
          <p className="mt-2 text-sm font-bold">Maximum Bonus: {formatMnt(data.maxBonusMnt)}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {data.tiers.map((tier) => (
              <div key={tier.minDepositMnt} className="rounded-lg pale-surface p-3">
                <p className="text-xs font-extrabold">Deposit {formatMnt(tier.minDepositMnt)}</p>
                <p className="font-display text-2xl font-black">{tier.bonusPercent}%</p>
              </div>
            ))}
          </div>
          <ClaimControls bonusId="weekend" label="CLAIM BOOST" />
        </div>
      ) : null}
    </QueryState>
  );
}
