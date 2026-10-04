import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/persist/store.server");
  return getSessionUser();
});

export const registerFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      username: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { registerUser } = await import("@/lib/persist/store.server");
    return registerUser(data);
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const { loginUser } = await import("@/lib/persist/store.server");
    return loginUser(data);
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutUser } = await import("@/lib/persist/store.server");
  await logoutUser();
  return { ok: true as const };
});
