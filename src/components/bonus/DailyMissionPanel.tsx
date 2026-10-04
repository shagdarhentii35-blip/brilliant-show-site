import { Progress } from "@/components/ui/progress";
import { QueryState, StatusBadge } from "@/components/bonus/StatusBadge";
import { ClaimControls } from "@/components/bonus/ClaimControls";
import { useDailyMissions } from "@/hooks/use-bonus";
import { formatMnt } from "@/lib/bonus/format";

export function DailyMissionPanel() {
  const query = useDailyMissions();

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError} error={query.error}>
      {query.data ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Mission list is for display. Claim submits one PENDING request for Daily Mission.</p>
          {query.data.missions.map((mission) => {
            const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));
            const currentLabel = mission.unit === "mnt" ? formatMnt(mission.current) : String(mission.current);
            const targetLabel = mission.unit === "mnt" ? formatMnt(mission.target) : String(mission.target);
            return (
              <article key={mission.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-black">{mission.title}</h3>
                    <p className="text-xs text-muted-foreground">{mission.description}</p>
                  </div>
                  <StatusBadge status={mission.status} />
                </div>
                <p className="mt-3 text-sm font-bold">
                  Progress: {currentLabel} / {targetLabel}
                </p>
                <Progress className="mt-2" value={percent} />
                <p className="mt-2 text-sm">Reward: {mission.reward.label}</p>
              </article>
            );
          })}
          <div className="rounded-lg border border-border bg-card p-4">
            <ClaimControls bonusId="mission" label="CLAIM REWARD" />
          </div>
        </div>
      ) : null}
    </QueryState>
  );
}
