import { ClaimControls } from "@/components/bonus/ClaimControls";
import { Leaderboard } from "@/components/bonus/Leaderboard";
import { QueryState, StatusBadge } from "@/components/bonus/StatusBadge";
import { useDiamondRace } from "@/hooks/use-bonus";
import { formatDateTime, formatMnt, formatRemaining } from "@/lib/bonus/format";

export function DiamondRacePanel() {
  const query = useDiamondRace();
  const data = query.data;

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {data ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-black">{data.title}</h2>
              <StatusBadge status={data.status} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md pale-surface p-3">
                <dt className="text-xs text-muted-foreground">Your rank</dt>
                <dd className="font-display text-2xl font-black">#{data.currentUser.rank ?? "—"}</dd>
              </div>
              <div className="rounded-md pale-surface p-3">
                <dt className="text-xs text-muted-foreground">Your points</dt>
                <dd className="font-display text-2xl font-black">{data.currentUser.points.toLocaleString("en-US")}</dd>
              </div>
              <div className="rounded-md pale-surface p-3">
                <dt className="text-xs text-muted-foreground">Your prize</dt>
                <dd className="font-display text-2xl font-black">{formatMnt(data.currentUser.prizeMnt)}</dd>
              </div>
              <div className="rounded-md pale-surface p-3">
                <dt className="text-xs text-muted-foreground">Remaining</dt>
                <dd className="font-display text-2xl font-black">{formatRemaining(data.remainingMs)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {formatDateTime(data.startsAt)} — {formatDateTime(data.endsAt)}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              {data.prizeTiers.map((tier) => (
                <li key={tier.rankLabel} className="rounded-full bg-primary/10 px-3 py-1">
                  {tier.rankLabel}: {formatMnt(tier.prizeMnt)}
                </li>
              ))}
            </ul>
          </div>
          <Leaderboard entries={data.leaderboard} />
          <div className="rounded-lg border border-border bg-card p-4">
            <ClaimControls bonusId="race" label="CLAIM" />
          </div>
        </div>
      ) : null}
    </QueryState>
  );
}
