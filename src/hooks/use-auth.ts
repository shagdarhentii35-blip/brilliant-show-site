import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSessionFn, loginFn, logoutFn, registerFn } from "@/lib/auth/functions";
import { createClaimFn, listMyClaimsFn } from "@/lib/claims/functions";
import type { BonusId } from "@/lib/bonus/types";

export const sessionKey = ["auth", "session"] as const;
export const claimsKey = ["claims", "mine"] as const;

export function useSession() {
  const getSession = useServerFn(getSessionFn);
  return useQuery({
    queryKey: sessionKey,
    queryFn: () => getSession(),
  });
}

export function useRegister() {
  const register = useServerFn(registerFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; password: string; confirmPassword: string }) =>
      register({ data }),
    onSuccess: (result) => {
      if (result.ok) {
        client.setQueryData(sessionKey, result.user);
        void client.invalidateQueries({ queryKey: claimsKey });
      }
    },
  });
}

export function useLogin() {
  const login = useServerFn(loginFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; password: string }) => login({ data }),
    onSuccess: (result) => {
      if (result.ok) {
        client.setQueryData(sessionKey, result.user);
        void client.invalidateQueries({ queryKey: claimsKey });
      }
    },
  });
}

export function useLogout() {
  const logout = useServerFn(logoutFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      client.setQueryData(sessionKey, null);
      client.setQueryData(claimsKey, []);
    },
  });
}

export function useMyClaims() {
  const listMyClaims = useServerFn(listMyClaimsFn);
  const session = useSession();
  return useQuery({
    queryKey: claimsKey,
    queryFn: () => listMyClaims(),
    enabled: Boolean(session.data),
  });
}

export function useCreateClaim() {
  const createClaim = useServerFn(createClaimFn);
  const client = useQueryClient();
  return useMutation({
    mutationFn: (bonusId: BonusId) => createClaim({ data: { bonusId } }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: claimsKey });
    },
  });
}
