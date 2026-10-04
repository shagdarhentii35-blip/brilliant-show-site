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
  return (
    <article
      className={`promo-card relative isolate overflow-hidden rounded-lg border border-primary-foreground/35 card-glow ${compact ? "h-[205px] sm:h-[195px]" : "h-[270px] sm:h-[285px]"}`}
    >
      <img
        src={bonusImages[promo.imageKey]}
        alt=""
        loading="lazy"
        width={944}
        height={704}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 promo-shade" />
      <div className="absolute inset-x-0 top-0 flex justify-start p-3">
        <span
          className={`promo-badge badge-${promo.badge} rounded-full px-3 py-1 text-[10px] font-extrabold text-primary-foreground shadow-sm sm:text-xs`}
        >
          {promo.eyebrow}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-3 text-center text-primary-foreground sm:px-4">
        <h3
          className={`${compact ? "text-lg sm:text-xl" : "text-xl sm:text-[22px]"} font-display font-black leading-tight display-shadow`}
        >
          {promo.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium sm:text-xs">{promo.description}</p>
        {onOpen ? (
          <Button
            variant={compact ? "gold" : "casino"}
            size="sm"
            className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs"
            onClick={() => onOpen(promo)}
          >
            {promo.action}
            <ChevronRight aria-hidden="true" />
          </Button>
        ) : (
          <Button variant={compact ? "gold" : "casino"} size="sm" className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs" asChild>
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
