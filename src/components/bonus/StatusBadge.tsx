import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  available: "Available",
  claimed: "Claimed",
  expired: "Expired",
  not_eligible: "Not eligible",
  locked: "Locked",
  active: "Active",
  ended: "Ended",
  in_progress: "In progress",
  claimable: "Claim reward",
  loading: "Loading",
  error: "Error",
  pending: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "available" || status === "active" || status === "claimable"
      ? "bg-emerald-600 text-white"
      : status === "claimed" || status === "pending"
        ? "bg-primary text-primary-foreground"
        : status === "ended" || status === "expired" || status === "error"
          ? "bg-rose-600 text-white"
          : status === "loading"
            ? "bg-muted text-muted-foreground"
            : "bg-deep-sea text-primary-foreground";

  return (
    <span className={cn("rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide", tone)}>
      {labels[status] ?? status}
    </span>
  );
}

export function QueryState({
  isLoading,
  isError,
  error,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <StatusBadge status="loading" />
        <p className="mt-3 text-sm text-muted-foreground">Loading bonus data…</p>
      </div>
    );
  }
  if (isError) {
    const message = error instanceof Error ? error.message : "Could not load bonus data.";
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <StatusBadge status="error" />
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }
  return children;
}
