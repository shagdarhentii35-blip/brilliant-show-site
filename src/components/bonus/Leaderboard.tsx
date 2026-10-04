import type { LeaderboardEntry } from "@/lib/bonus/types";
import { formatMnt } from "@/lib/bonus/format";
import { cn } from "@/lib/utils";

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-primary/10 font-display text-xs uppercase">
          <tr>
            <th className="px-3 py-2">Rank</th>
            <th className="px-3 py-2">Player</th>
            <th className="px-3 py-2">Points</th>
            <th className="px-3 py-2">Prize</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.userId}
              className={cn("border-t border-border", entry.isCurrentUser && "bg-gold/20 font-bold")}
            >
              <td className="px-3 py-2">#{entry.rank}</td>
              <td className="px-3 py-2">{entry.displayName}</td>
              <td className="px-3 py-2">{entry.points.toLocaleString("en-US")}</td>
              <td className="px-3 py-2">{formatMnt(entry.prizeMnt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
