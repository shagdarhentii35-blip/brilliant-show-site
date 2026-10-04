import { QueryState } from "@/components/bonus/StatusBadge";
import { ClaimControls } from "@/components/bonus/ClaimControls";
import { useWelcomeBonus } from "@/hooks/use-bonus";
import { formatMnt } from "@/lib/bonus/format";

export function WelcomeBonusPanel() {
  const query = useWelcomeBonus();
  const data = query.data;

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {data ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-black">WELCOME BONUS</h2>
          <ul className="mt-4 space-y-2 text-sm font-medium">
            <li>Register and get {formatMnt(data.rules.registrationBonusMnt)}</li>
            <li>{data.rules.firstDepositPercent}% First Deposit Bonus</li>
            <li>Minimum Deposit: {formatMnt(data.rules.minDepositMnt)}</li>
            <li>Maximum Bonus: {formatMnt(data.rules.maxBonusMnt)}</li>
            <li>Wagering: x{data.rules.wageringMultiplier}</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {data.rules.newRegisteredUsersOnly ? "New registered users only. " : ""}
            Claim period: {data.rules.claimPeriodHours} hours.
            {data.rules.oneClaimPerAccount ? " One claim per account." : ""}
          </p>
          <ClaimControls bonusId="welcome" label="CLAIM BONUS" />
        </div>
      ) : null}
    </QueryState>
  );
}
