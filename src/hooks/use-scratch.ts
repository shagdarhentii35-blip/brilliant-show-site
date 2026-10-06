import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { claimsKey } from "@/hooks/use-auth";
import { completeScratchFn, getScratchStatusFn } from "@/lib/scratch/functions";
import { claimScratchRewardFn } from "@/lib/claims/functions";

export const scratchStatusKey = ["scratch", "status"] as const;

function useClockRemainingMs(nextScratchAt: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!nextScratchAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nextScratchAt]);

  if (!nextScratchAt) return 0;
  return Math.max(0, Date.parse(nextScratchAt) - now);
}

export function useScratchStatus() {
  const getScratchStatus = useServerFn(getScratchStatusFn);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: scratchStatusKey,
    queryFn: () => getScratchStatus(),
  });
  const remainingMs = useClockRemainingMs(query.data?.nextScratchAt);

  useEffect(() => {
    if (!query.data?.nextScratchAt || query.data.canScratch) return;
    if (remainingMs > 0) return;
    void client.invalidateQueries({ queryKey: scratchStatusKey });
  }, [client, query.data?.canScratch, query.data?.nextScratchAt, remainingMs]);

  return {
    ...query,
    remainingMs: query.data?.canScratch === false ? remainingMs : 0,
  };
}

export function useCompleteScratch() {
  const completeScratch = useServerFn(completeScratchFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => completeScratch(),
    onSuccess: (result) => {
      client.setQueryData(scratchStatusKey, result.status);
    },
  });
}

export function useClaimScratchReward() {
  const claimScratch = useServerFn(claimScratchRewardFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => claimScratch(),
    onSuccess: (result) => {
      client.setQueryData(scratchStatusKey, result.status);
      void client.invalidateQueries({ queryKey: claimsKey });
    },
  });
}
