import { useState } from "react";
import { ScratchCanvas } from "@/components/bonus/ScratchCanvas";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { getCatalogItem } from "@/lib/bonus/admin-config";
import { formatCountdown, formatMnt } from "@/lib/bonus/format";
import { useClaimScratchReward, useCompleteScratch, useScratchStatus } from "@/hooks/use-scratch";
import type { ScratchRewardView } from "@/lib/scratch/types";

function ScratchWinReveal({ reward }: { reward: ScratchRewardView }) {
  const amountPlain = reward.amountMnt.toLocaleString("en-US");
  const amountLabel = formatMnt(reward.amountMnt);

  return (
    <div className="relative isolate overflow-hidden rounded-lg border-2 border-gold bg-deep-sea px-4 py-7 text-center scratch-feature-glow">
      <div className="scratch-win-burst pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="scratch-win-spark left-[12%] top-[18%] size-1.5" aria-hidden="true" />
      <span className="scratch-win-spark right-[16%] top-[22%] size-2" style={{ animationDelay: "0.35s" }} aria-hidden="true" />
      <span className="scratch-win-spark left-[22%] bottom-[20%] size-1" style={{ animationDelay: "0.7s" }} aria-hidden="true" />
      <span className="scratch-win-spark right-[20%] bottom-[24%] size-1.5" style={{ animationDelay: "1s" }} aria-hidden="true" />
      <p className="relative text-sm font-extrabold uppercase tracking-[0.18em] text-gold">🎉 БАЯР ХҮРГЭЕ!</p>
      <p className="scratch-win-amount relative mt-2 font-display text-5xl font-black tabular-nums text-gold display-shadow sm:text-6xl">
        ₮{amountPlain}
      </p>
      {reward.kind === "jackpot" ? (
        <p className="relative mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-gold">Jackpot</p>
      ) : null}
      <p className="relative mt-3 text-sm font-bold text-primary-foreground sm:text-base">
        Та {amountLabel}-ийн шагнал хожлоо!
      </p>
    </div>
  );
}

export function ScratchCardPanel() {
  const promo = getCatalogItem("scratch");
  const { user, openLogin } = useAuth();
  const status = useScratchStatus();
  const complete = useCompleteScratch();
  const claim = useClaimScratchReward();
  const [canvasKey, setCanvasKey] = useState(0);

  const locked = Boolean(user) && status.data?.canScratch === false;
  const remainingMs = status.remainingMs;
  const lastReward = complete.data?.ok ? complete.data.reward : status.data?.lastReward;
  const showWin = Boolean(lastReward) && locked;
  const canPlay = Boolean(user) && status.data?.canScratch === true && !complete.isPending;
  const canClaim = Boolean(user) && (status.data?.canClaim === true || (complete.data?.ok && complete.data.status.canClaim));
  const claimStatus = status.data?.claimStatus;
  const claimSubmitted = Boolean(claimStatus) || Boolean(claim.data?.ok);

  async function onScratchComplete() {
    if (!user) {
      openLogin();
      setCanvasKey((value) => value + 1);
      return;
    }
    const result = await complete.mutateAsync();
    if (!result.ok) {
      if (result.code === "unauthorized") openLogin();
      setCanvasKey((value) => value + 1);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="rounded-lg border border-ice/40 bg-card p-4 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase text-primary">Interactive</p>
        <h2 className="font-display text-xl font-black">{promo.title}</h2>
        <p className="mt-1 font-display text-lg font-black text-primary">{promo.highlight}</p>
        <div className="relative mt-4">
          {showWin && lastReward ? (
            <ScratchWinReveal reward={lastReward} />
          ) : complete.isPending ? (
            <div className="grid min-h-[220px] place-items-center rounded-lg border border-gold/70 bg-deep-sea px-4 text-center scratch-feature-glow">
              <p className="font-display text-xl font-black text-gold">…</p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-deep-sea" />
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-gold/10" />
              <ScratchCanvas key={canvasKey} disabled={!canPlay} onComplete={() => void onScratchComplete()} />
            </div>
          )}
        </div>
        {locked ? (
          <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
            NEXT SCRATCH IN {formatCountdown(remainingMs)}
          </p>
        ) : null}
        {showWin && canClaim && !claimSubmitted ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Button
              variant="gold"
              className="rounded-full px-8"
              disabled={claim.isPending}
              onClick={() => void claim.mutateAsync()}
            >
              CLAIM REWARD
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Submit a pending request for admin approval. This does not pay out automatically.
            </p>
          </div>
        ) : null}
        {showWin && claimSubmitted ? (
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-foreground">Your reward claim has been submitted.</p>
            <p className="mt-1 text-sm text-muted-foreground">Please wait for approval.</p>
            <Button variant="gold" className="mt-3 rounded-full px-8" disabled>
              CLAIM REWARD
            </Button>
          </div>
        ) : null}
        {claim.data && !claim.data.ok ? (
          <p className="mt-3 text-center text-sm text-rose-600">{claim.data.error}</p>
        ) : null}
        {!user ? (
          <Button variant="gold" className="mt-4 rounded-full" onClick={openLogin}>
            Log in to scratch
          </Button>
        ) : null}
      </div>
      <aside className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display font-black">How it works</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {promo.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{promo.detail}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          One scratch every 25 hours per account. Claim submits a pending request for admin approval — it is not an
          automatic payout.
        </p>
      </aside>
    </div>
  );
}
