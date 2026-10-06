import { Link } from "@tanstack/react-router";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bonusImages } from "@/lib/bonus/images";
import scratchBanner from "@/assets/scratch-banner.jpg";
import { LiveScratchActivity } from "@/components/bonus/LiveScratchActivity";
import { formatCountdown } from "@/lib/bonus/format";
import { useScratchStatus } from "@/hooks/use-scratch";

export function ScratchFeatureBanner() {
  const status = useScratchStatus();
  const locked = status.data?.authenticated === true && status.data.canScratch === false;
  const remainingMs = status.remainingMs;

  return (
    <section
      aria-labelledby="scratch-win-title"
      className="relative isolate mx-auto mt-3 w-full max-w-[1000px] overflow-hidden rounded-lg border border-gold/55 scratch-feature-glow"
    >
      <div className="relative isolate">
        <img
          src={scratchBanner}
          alt=""
          loading="lazy"
          width={1920}
          height={640}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-deep-sea/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-sea/55 via-deep-sea/35 to-deep-sea/75" />

        <div className="relative flex flex-col items-center px-4 py-8 text-center text-primary-foreground sm:px-8 sm:py-10">
          <span className="grid size-11 place-items-center rounded-full bg-gold text-gold-foreground shadow-[var(--shadow-gold)] sm:size-12">
            <Crown className="size-5 fill-current sm:size-6" aria-hidden="true" />
          </span>
          <h2
            id="scratch-win-title"
            className="mt-3 font-display text-5xl font-black leading-[0.9] display-shadow sm:text-6xl lg:text-7xl"
          >
            SCRATCH <span className="text-gold">&amp; WIN</span>
          </h2>

          <div className="relative mt-6 w-[min(100%,360px)] sm:mt-8 sm:w-[min(100%,440px)]">
            <div className="absolute -inset-6 rounded-[1.25rem] bg-gold/25 blur-2xl" />
            <img
              src={bonusImages.scratch}
              alt="Gold scratch card"
              width={944}
              height={704}
              className="relative z-10 w-full rotate-[-5deg] rounded-lg border-2 border-gold/80 object-cover scratch-feature-glow"
            />
          </div>

          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.22em] text-gold sm:text-sm">
            Gold scratch card
          </p>
          <p className="mt-2 max-w-md text-base font-bold text-primary-foreground/95 sm:text-lg">
            Scratch your card and reveal your reward
          </p>
          {locked ? (
            <div className="mt-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold">NEXT SCRATCH IN</p>
              <p className="mt-1 font-display text-3xl font-black tabular-nums text-primary-foreground sm:text-4xl">
                {formatCountdown(remainingMs)}
              </p>
              <Button
                variant="gold"
                disabled
                className="mt-4 h-14 rounded-full px-10 text-base font-black sm:h-16 sm:px-12 sm:text-lg"
              >
                NEXT SCRATCH IN {formatCountdown(remainingMs)}
              </Button>
            </div>
          ) : (
            <Button
              variant="gold"
              className="mt-5 h-14 rounded-full px-10 text-base font-black sm:h-16 sm:px-12 sm:text-lg [&_svg]:size-5"
              asChild
            >
              <Link to="/bonuses/$bonusId" params={{ bonusId: "scratch" }}>
                SCRATCH NOW <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <LiveScratchActivity />
    </section>
  );
}
