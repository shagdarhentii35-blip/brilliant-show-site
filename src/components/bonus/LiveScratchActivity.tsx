import { Crown, Ticket } from "lucide-react";

const demoActivity = [
  { user: "di****88", amount: "₮50,000", time: "1 min ago" },
  { user: "kh****10", amount: "₮100,000", time: "3 min ago" },
  { user: "an****27", amount: "₮25,000", time: "5 min ago" },
  { user: "ba****03", amount: "₮500,000", time: "8 min ago" },
  { user: "te****41", amount: "₮10,000", time: "12 min ago" },
  { user: "mo****19", amount: "₮75,000", time: "15 min ago" },
  { user: "sa****62", amount: "₮200,000", time: "18 min ago" },
  { user: "er****07", amount: "₮50,000", time: "22 min ago" },
] as const;

function ActivityRows({ cycle }: { cycle: string }) {
  return (
    <>
      {demoActivity.map((row) => (
        <li
          key={`${cycle}-${row.user}-${row.time}`}
          className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-b border-border/60 px-3 py-1.5 last:border-b-0 sm:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1fr)_auto] sm:gap-3 sm:py-2"
        >
          <span className="truncate text-xs font-extrabold text-foreground sm:text-sm">{row.user}</span>
          <span className="hidden size-7 place-items-center rounded-full bg-gold/20 text-gold-foreground sm:grid">
            <Ticket className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-right text-xs font-black text-primary sm:text-sm">{row.amount}</span>
          <span className="text-right text-[10px] font-bold text-muted-foreground sm:min-w-[5.5rem] sm:text-xs">
            {row.time}
          </span>
        </li>
      ))}
    </>
  );
}

export function LiveScratchActivity() {
  return (
    <div
      role="region"
      aria-label="Sample promotional scratch activity. Fictional demo data only."
      className="relative isolate border-t border-gold/35"
    >
      <div className="flex items-center justify-center gap-3 nav-surface px-3 py-2 text-center text-primary-foreground sm:px-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground shadow-[var(--shadow-gold)]">
          <Crown className="size-3.5 fill-current" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold">Live Scratch</p>
          <h3 className="font-display text-sm font-black leading-tight sm:text-base">Recent Winners</h3>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-primary-foreground/75 sm:text-[10px]">
          Sample activity
        </p>
      </div>
      <div className="pale-surface">
        <div className="h-[160px] overflow-hidden sm:h-[180px]">
          <ul className="scratch-live-scroll">
            <ActivityRows cycle="a" />
            <ActivityRows cycle="b" />
          </ul>
        </div>
        <p className="border-t border-border/70 px-3 py-1.5 text-center text-[10px] font-medium text-muted-foreground">
          Fictional demo list for promotion display only — not live results.
        </p>
      </div>
    </div>
  );
}
