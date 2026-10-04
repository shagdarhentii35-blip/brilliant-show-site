import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import type { BonusId } from "@/lib/bonus/types";
import { bonusImages } from "@/lib/bonus/images";

export function BonusPageShell({
  title,
  eyebrow,
  imageKey,
  children,
}: {
  title: string;
  eyebrow: string;
  imageKey?: BonusId;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main className="mx-auto max-w-[1320px] px-3 pb-10 pt-4 sm:px-6">
        <Link to="/bonuses" className="inline-flex items-center gap-1 text-xs font-bold text-primary">
          <ArrowLeft className="size-3.5" /> All bonuses
        </Link>
        {imageKey ? (
          <div className="relative mt-3 h-36 overflow-hidden rounded-lg border border-primary-foreground/35 sm:h-44">
            <img src={bonusImages[imageKey]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 promo-shade" />
            <div className="absolute bottom-4 left-4">
              <p className="text-[10px] font-extrabold uppercase text-gold">{eyebrow}</p>
              <h1 className="font-display text-3xl font-black text-primary-foreground display-shadow sm:text-4xl">
                {title}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="mt-3 font-display text-3xl font-black text-foreground sm:text-4xl">{title}</h1>
        )}
        <div className="mt-4">{children}</div>
        <SiteFooter />
      </main>
    </div>
  );
}
