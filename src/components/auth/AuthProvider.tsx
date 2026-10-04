import { createContext, useContext, useState, type ReactNode } from "react";
import { AuthDialogs } from "@/components/auth/AuthDialogs";
import { useLogout, useSession } from "@/hooks/use-auth";
import type { PublicUser } from "@/lib/auth/types";

type AuthView = "login" | "register" | null;

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  openLogin: () => void;
  openRegister: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const logoutMutation = useLogout();
  const [view, setView] = useState<AuthView>(null);

  const value: AuthContextValue = {
    user: session.data ?? null,
    isLoading: session.isLoading,
    openLogin: () => setView("login"),
    openRegister: () => setView("register"),
    logout: () => logoutMutation.mutate(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialogs view={view} onViewChange={setView} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
