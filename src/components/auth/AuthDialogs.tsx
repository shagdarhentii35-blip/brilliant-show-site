import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister } from "@/hooks/use-auth";

type AuthView = "login" | "register" | null;

export function AuthDialogs({
  view,
  onViewChange,
}: {
  view: AuthView;
  onViewChange: (view: AuthView) => void;
}) {
  const login = useLogin();
  const register = useRegister();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isRegister = view === "register";
  const pending = login.isPending || register.isPending;
  const resultError = isRegister
    ? register.data && !register.data.ok
      ? register.data.error
      : register.error instanceof Error
        ? register.error.message
        : null
    : login.data && !login.data.ok
      ? login.data.error
      : login.error instanceof Error
        ? login.error.message
        : null;

  function reset() {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    login.reset();
    register.reset();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (isRegister) {
      const result = await register.mutateAsync({ username, password, confirmPassword });
      if (result.ok) {
        reset();
        onViewChange(null);
      }
      return;
    }
    const result = await login.mutateAsync({ username, password });
    if (result.ok) {
      reset();
      onViewChange(null);
    }
  }

  return (
    <Dialog
      open={view !== null}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onViewChange(null);
        }
      }}
    >
      <DialogContent className="max-w-sm rounded-lg p-6">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <Sparkles className="size-9 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-xl">
            {isRegister ? "Бүртгүүлэх" : "Нэвтрэх"}
          </DialogTitle>
          <DialogDescription className="pt-1 text-center">
            {isRegister ? "Create a promotion-site account." : "Log in to claim bonuses."}
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor="auth-username">Username</Label>
            <Input
              id="auth-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              minLength={3}
              maxLength={24}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>
          {isRegister ? (
            <div className="space-y-1">
              <Label htmlFor="auth-confirm">Confirm password</Label>
              <Input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>
          ) : null}
          {resultError ? <p className="text-sm text-rose-600">{resultError}</p> : null}
          <Button type="submit" variant="casino" className="w-full rounded-full" disabled={pending}>
            {isRegister ? "Create account" : "Log in"}
          </Button>
        </form>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {isRegister ? (
            <button
              type="button"
              className="font-bold text-primary"
              onClick={() => {
                reset();
                onViewChange("login");
              }}
            >
              Already have an account? Log in
            </button>
          ) : (
            <button
              type="button"
              className="font-bold text-primary"
              onClick={() => {
                reset();
                onViewChange("register");
              }}
            >
              New here? Register
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
