import { Link } from "@tanstack/react-router";
import { Diamond, LockKeyhole, LogOut, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export function SiteHeader() {
  const { user, openLogin, openRegister, logout, isLoading } = useAuth();

  return (
    <header className="relative z-10 section-glass">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:py-2">
        <Link to="/" aria-label="DIAMOND нүүр" className="flex min-w-0 items-center gap-2 text-foreground">
          <Diamond className="size-7 shrink-0 fill-ice text-primary sm:size-8" strokeWidth={1.8} />
          <span className="truncate font-display text-2xl font-black leading-none sm:text-[29px]">DIAMOND</span>
        </Link>
        <nav className="hidden h-8 items-center justify-center gap-5 rounded-full bg-primary/12 px-5 text-xs font-bold text-primary lg:flex">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/bonuses" className="hover:underline">
            Bonuses
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="casino"
            size="sm"
            className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm lg:hidden"
            asChild
          >
            <Link to="/bonuses">Bonuses</Link>
          </Button>
          {isLoading ? null : user ? (
            <>
              <span className="max-w-[100px] truncate text-xs font-extrabold text-primary sm:max-w-[140px]">
                {user.username}
              </span>
              <Button
                variant="casino"
                size="sm"
                className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm"
                onClick={() => logout()}
              >
                <LogOut aria-hidden="true" className="hidden min-[420px]:inline" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="casino"
                size="sm"
                className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm"
                onClick={openLogin}
              >
                <LockKeyhole aria-hidden="true" className="hidden min-[420px]:inline" /> Нэвтрэх
              </Button>
              <Button
                variant="casino"
                size="sm"
                className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm"
                onClick={openRegister}
              >
                <UserRoundPlus aria-hidden="true" className="hidden min-[420px]:inline" /> Бүртгүүлэх
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground sm:flex-row">
      <span className="flex items-center gap-1 font-display font-black text-primary">
        <Diamond className="size-4" aria-hidden="true" /> DIAMOND
      </span>
      <span>© 2026 DIAMOND. Хариуцлагатай тоглоорой. 18+</span>
      <span>18+ насны хэрэглэгчдэд</span>
    </footer>
  );
}
