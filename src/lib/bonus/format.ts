export function formatMnt(amount: number): string {
  return `${amount.toLocaleString("en-US")}₮`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatRewardLabel(amountMnt: number, kind?: "cash" | "jackpot"): string {
  const base = formatMnt(amountMnt);
  return kind === "jackpot" ? `${base} JACKPOT` : base;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ended";
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function startOfLocalDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function nextLocalMidnight(from = new Date()): Date {
  const next = startOfLocalDay(from);
  next.setDate(next.getDate() + 1);
  return next;
}

export function isSameLocalDay(a: string | Date, b: Date = new Date()): boolean {
  const left = typeof a === "string" ? new Date(a) : a;
  return startOfLocalDay(left).getTime() === startOfLocalDay(b).getTime();
}

export function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekendWindow(now = new Date()): { startsAt: Date; endsAt: Date } {
  const day = now.getDay();
  const saturdayOffset = day === 0 ? -1 : 6 - day;
  const saturday = startOfLocalDay(now);
  saturday.setDate(saturday.getDate() + saturdayOffset);
  const sunday = new Date(saturday);
  sunday.setDate(sunday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);
  return { startsAt: saturday, endsAt: sunday };
}

export function pickWeighted<T extends { weight: number }>(items: readonly T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item;
  }
  const fallback = items[items.length - 1];
  if (!fallback) throw new Error("Cannot pick from an empty weighted list");
  return fallback;
}
