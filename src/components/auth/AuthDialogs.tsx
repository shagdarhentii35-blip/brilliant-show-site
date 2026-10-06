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
import { isValidPromotionUsername } from "@/lib/auth/username";

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
  const [confirmUsername, setConfirmUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmedDiamondMatch, setConfirmedDiamondMatch] = useState(false);

  const isRegister = view === "register";
  const pending = login.isPending || register.isPending;
  const usernameValid = isValidPromotionUsername(username);
  const usernamesMatch = username.trim() === confirmUsername.trim() && username.trim().length > 0;
  const registerBlocked =
    isRegister && (!usernameValid || !usernamesMatch || !confirmedDiamondMatch);
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
    setConfirmUsername("");
    setPassword("");
    setConfirmPassword("");
    setConfirmedDiamondMatch(false);
    login.reset();
    register.reset();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (isRegister) {
      if (registerBlocked) return;
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
      <DialogContent className="max-w-md rounded-lg p-6">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <Sparkles className="size-9 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-xl">
            {isRegister ? "Promotion account бүртгүүлэх" : "Promotion account-аараа нэвтэрнэ үү"}
          </DialogTitle>
          <DialogDescription className="pt-1 text-center">
            {isRegister
              ? "Promotion account нь DIAMOND account-аас тусдаа. Зөвхөн Username нь DIAMOND үндсэн account-ийн Username-тэй яг ижил байх ёстой. Нууц үг тусдаа байж болно."
              : "Promotion account нь DIAMOND account-аас тусдаа боловч Username нь DIAMOND үндсэн account-ийн Username-тэй заавал ижил байна."}
          </DialogDescription>
        </DialogHeader>

        {isRegister ? (
          <div className="mt-4 rounded-lg border border-gold/55 bg-gold/15 px-3 py-3 text-sm text-foreground">
            <p className="font-bold leading-snug">
              ⚠️ Анхаар: Promotion account үүсгэхдээ DIAMOND үндсэн сайтад ашигладаг Username-тэйгээ яг ижил
              Username ашиглана уу.
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed">
              DIAMOND Username: diamond123
              <br />
              Promotion Username: diamond123 ✓
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Энэ нь ижил account биш. Promotion нууц үг тусдаа. Username зөвхөн 3–24 үсэг, тоо, _ байна.
            </p>
          </div>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor="auth-username">{isRegister ? "DIAMOND / Promotion Username" : "Username"}</Label>
            <Input
              id="auth-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="DIAMOND Username-тэй ижил"
              required
              minLength={3}
              maxLength={24}
              pattern="[a-zA-Z0-9_]{3,24}"
              title="3–24 letters, numbers, or underscores — same as your DIAMOND username"
            />
            {isRegister && username.length > 0 && !usernameValid ? (
              <p className="text-xs font-bold text-rose-600">
                Username DIAMOND форматад тохирохгүй. Зөвхөн 3–24 үсэг, тоо, _ ашиглана.
              </p>
            ) : null}
          </div>
          {isRegister ? (
            <div className="space-y-1">
              <Label htmlFor="auth-username-confirm">DIAMOND Username баталгаажуулах</Label>
              <Input
                id="auth-username-confirm"
                autoComplete="off"
                value={confirmUsername}
                onChange={(event) => setConfirmUsername(event.target.value)}
                placeholder="DIAMOND Username-тэй ижил"
                required
                minLength={3}
                maxLength={24}
                pattern="[a-zA-Z0-9_]{3,24}"
              />
              {confirmUsername.length > 0 && !usernamesMatch ? (
                <p className="text-xs font-bold text-rose-600">
                  Promotion Username нь DIAMOND Username-тэй яг ижил байх ёстой.
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="space-y-1">
            <Label htmlFor="auth-password">{isRegister ? "Promotion Password" : "Password"}</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Promotion Password"
              required
              minLength={8}
            />
          </div>
          {isRegister ? (
            <div className="space-y-1">
              <Label htmlFor="auth-confirm">Promotion Password баталгаажуулах</Label>
              <Input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Promotion Password"
                required
                minLength={8}
              />
            </div>
          ) : null}
          {isRegister ? (
            <label className="flex items-start gap-2 text-xs leading-snug text-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-primary"
                checked={confirmedDiamondMatch}
                onChange={(event) => setConfirmedDiamondMatch(event.target.checked)}
                required
              />
              <span>
                Энэ Username нь миний DIAMOND үндсэн сайтад ашигладаг Username-тэй яг ижил. Promotion account нь
                тусдаа account бөгөөд нууц үг өөр байж болно.
              </span>
            </label>
          ) : null}
          {resultError ? <p className="text-sm text-rose-600">{resultError}</p> : null}
          <Button
            type="submit"
            variant="casino"
            className="w-full rounded-full"
            disabled={pending || registerBlocked}
          >
            {isRegister ? "Бүртгүүлэх" : "Нэвтрэх"}
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
              Promotion account-тай юу? Нэвтрэх
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
              Promotion account байхгүй юу? Бүртгүүлэх →
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
