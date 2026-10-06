import { createServerFn } from "@tanstack/react-start";

export const getScratchStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getScratchStatus } = await import("@/lib/persist/store.server");
  return getScratchStatus();
});

export const completeScratchFn = createServerFn({ method: "POST" }).handler(async () => {
  const { completeScratch } = await import("@/lib/persist/store.server");
  return completeScratch();
});
