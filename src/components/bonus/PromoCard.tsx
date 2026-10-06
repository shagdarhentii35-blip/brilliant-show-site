import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bonus } from "@/lib/bonus/types";
import { bonusImages } from "@/lib/bonus/images";

export function PromoCard({
  promo,
  compact,
  onOpen,
}: {
  promo: Bonus;
  compact?: boolean;
  onOpen?: (promo: Bonus) => void;
}) {
  const comingSoon = promo.kind === "comingSoon";
  const interactive = promo.kind === "interactive";
  const height = promo.emphasized
    ? "min-h-[300px] sm:min-h-[320px]"
    : compact
      ? "h-[205px] sm:h-[195px]"
      : "min-h-[270px] sm:min-h-[285px]";

  return (
    <article
      className={`promo-card relative isolate overflow-hidden rounded-lg border card-glow ${height} ${
        promo.emphasized
          ? "border-gold/80 ring-2 ring-gold/50"
          : interactive
            ? "border-ice/80 ring-2 ring-primary/55"
            : comingSoon
              ? "border-gold/40"
              : "border-primary-foreground/35"
      }`}
    >
      <img
        src={bonusImages[promo.imageKey]}
        alt=""
        loading="lazy"
        width={944}
        height={704}
        className={`absolute inset-0 h-full w-full object-cover ${comingSoon ? "grayscale-[0.35]" : ""}`}
      />
      <div className="absolute inset-0 promo-shade" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        <span
          className={`promo-badge badge-${promo.badge} rounded-full px-3 py-1 text-[10px] font-extrabold text-primary-foreground shadow-sm sm:text-xs`}
        >
          {promo.eyebrow}
        </span>
        {comingSoon ? (
          <span className="rounded-full border border-gold/80 bg-gold px-3 py-1 text-[10px] font-extrabold text-gold-foreground">
            ТУН УДАХГҮЙ
          </span>
        ) : null}
        {interactive ? (
          <span className="rounded-full border border-ice/80 bg-primary px-3 py-1 text-[10px] font-extrabold text-primary-foreground">
            PLAY
          </span>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-3 text-center text-primary-foreground sm:px-4">
        <h3
          className={`${compact ? "text-lg sm:text-xl" : promo.emphasized ? "text-2xl sm:text-[28px]" : "text-xl sm:text-[22px]"} font-display font-black leading-tight display-shadow`}
        >
          {promo.title}
        </h3>
        <p className="mt-1 font-display text-sm font-black text-gold display-shadow sm:text-base">{promo.highlight}</p>
        <p className="mt-1 line-clamp-2 text-[11px] font-medium sm:text-xs">{promo.description}</p>
        {onOpen ? (
          <Button
            variant={comingSoon ? "gold" : interactive || promo.emphasized ? "gold" : "casino"}
            size="sm"
            className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs"
            onClick={() => onOpen(promo)}
          >
            {promo.action}
            {comingSoon ? null : <ChevronRight aria-hidden="true" />}
          </Button>
        ) : comingSoon ? (
          <Button variant="gold" size="sm" className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs" disabled>
            {promo.action}
          </Button>
        ) : (
          <Button
            variant={interactive || promo.emphasized ? "gold" : "casino"}
            size="sm"
            className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs"
            asChild
          >
            <Link to="/bonuses/$bonusId" params={{ bonusId: promo.id }}>
              {promo.action}
              <ChevronRight aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
