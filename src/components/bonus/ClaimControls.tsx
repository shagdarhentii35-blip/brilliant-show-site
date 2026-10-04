import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/bonus/StatusBadge";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCreateClaim, useMyClaims } from "@/hooks/use-auth";
import { getCatalogItem, promotionClaimAmountMnt } from "@/lib/bonus/admin-config";
import { formatMnt } from "@/lib/bonus/format";
import type { BonusId } from "@/lib/bonus/types";

export function ClaimControls({ bonusId, label = "CLAIM" }: { bonusId: BonusId; label?: string }) {
  const { user, openLogin } = useAuth();
  const claims = useMyClaims();
  const createClaim = useCreateClaim();
  const catalog = getCatalogItem(bonusId);
  const amountMnt = promotionClaimAmountMnt[bonusId];
  const existing = claims.data?.find((claim) => claim.bonusId === bonusId);
  const errorMessage =
    createClaim.data && !createClaim.data.ok
      ? createClaim.data.error
      : createClaim.error instanceof Error
        ? createClaim.error.message
        : null;

  async function onClaim() {
    if (!user) {
      openLogin();
      return;
    }
    await createClaim.mutateAsync(bonusId);
  }

  return (
    <div className="mt-5">
      <p className="text-sm text-muted-foreground">
        Claim as <span className="font-bold text-foreground">{user?.username ?? "your account"}</span>
        {" · "}
        {catalog.title}: {formatMnt(amountMnt)}
      </p>
      {existing ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status="pending" />
          <p className="text-sm font-bold text-primary">
            Submitted {formatMnt(existing.amountMnt)} — waiting for manual review
          </p>
        </div>
      ) : (
        <Button
          variant="casino"
          className="mt-3 w-full rounded-full sm:w-auto"
          disabled={createClaim.isPending}
          onClick={() => void onClaim()}
        >
          {label}
        </Button>
      )}
      {errorMessage ? <p className="mt-3 text-sm text-rose-600">{errorMessage}</p> : null}
    </div>
  );
}
