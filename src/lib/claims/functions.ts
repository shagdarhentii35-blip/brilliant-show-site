import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bonusIdSchema = z.enum([
  "welcome",
  "daily",
  "mission",
  "scratch",
  "mystery",
  "race",
  "weekend",
]);

export const createClaimFn = createServerFn({ method: "POST" })
  .validator(z.object({ bonusId: bonusIdSchema }))
  .handler(async ({ data }) => {
    const { createPendingClaim } = await import("@/lib/persist/store.server");
    return createPendingClaim(data.bonusId);
  });

export const listMyClaimsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listSessionClaims } = await import("@/lib/persist/store.server");
  return listSessionClaims();
});

export const claimScratchRewardFn = createServerFn({ method: "POST" }).handler(async () => {
  const { claimScratchReward } = await import("@/lib/persist/store.server");
  return claimScratchReward();
});
